// =====================================================================
//  Netlify Function — criar-lavajato
//  Painel admin da CL Digital: cria um lava-jato novo + usuário de login
//  + vínculo, tudo de uma vez. Roda no BACKEND (nunca no navegador),
//  por isso pode usar a SECRET KEY com segurança.
//
//  Endpoint: /.netlify/functions/criar-lavajato
//    GET  → lista os lava-jatos já cadastrados
//    POST → cria um lava-jato novo
//
//  VARIÁVEIS DE AMBIENTE (Netlify → Site settings → Environment variables):
//    SUPABASE_URL          = https://sgwqagzrrxkmzywazzlv.supabase.co
//    SUPABASE_SERVICE_KEY  = a SECRET KEY nova (sb_secret_...)  ← gere uma nova!
//    ADMIN_TOKEN           = uma senha forte que só a CL Digital conhece
// =====================================================================

const { createClient } = require("@supabase/supabase-js");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function resposta(statusCode, obj) {
  return {
    statusCode,
    headers: { ...CORS, "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS };

  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_TOKEN } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ADMIN_TOKEN) {
    return resposta(500, {
      erro: "Variáveis de ambiente faltando no Netlify (SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_TOKEN).",
    });
  }

  // Autenticação simples por token de admin
  const token = event.headers["x-admin-token"] || event.headers["X-Admin-Token"];
  if (token !== ADMIN_TOKEN) {
    return resposta(401, { erro: "Token de admin inválido." });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ── LISTAR lava-jatos ──────────────────────────
  if (event.httpMethod === "GET") {
    const { data, error } = await admin
      .from("lava_jatos")
      .select("id, nome, telefone, criado_em")
      .order("criado_em", { ascending: false });
    if (error) return resposta(500, { erro: error.message });
    return resposta(200, { lava_jatos: data });
  }

  // ── CRIAR lava-jato ────────────────────────────
  if (event.httpMethod === "POST") {
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return resposta(400, { erro: "JSON inválido." });
    }

    const { nome, telefone, cor, email, senha, nome_dono } = body;

    if (!nome || !email || !senha) {
      return resposta(400, {
        erro: "Nome do lava-jato, e-mail e senha são obrigatórios.",
      });
    }
    if (String(senha).length < 6) {
      return resposta(400, { erro: "A senha precisa ter ao menos 6 caracteres." });
    }

    // 1) cria o usuário de login (já confirmado, sem precisar de e-mail)
    const { data: userData, error: userErr } = await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });
    if (userErr) {
      return resposta(400, { erro: "Erro ao criar usuário: " + userErr.message });
    }
    const uid = userData.user.id;

    // 2) cria o lava-jato
    const { data: lj, error: ljErr } = await admin
      .from("lava_jatos")
      .insert({
        nome,
        telefone: telefone || null,
        cor_primaria: cor || "#1976D2",
      })
      .select("id")
      .single();
    if (ljErr) {
      await admin.auth.admin.deleteUser(uid); // desfaz o usuário
      return resposta(500, { erro: "Erro ao criar lava-jato: " + ljErr.message });
    }

    // 3) vincula o usuário ao lava-jato (papel = dono)
    const { error: perfilErr } = await admin.from("perfis").insert({
      id: uid,
      lava_jato_id: lj.id,
      nome: nome_dono || nome,
      papel: "dono",
    });
    if (perfilErr) {
      await admin.auth.admin.deleteUser(uid);
      await admin.from("lava_jatos").delete().eq("id", lj.id);
      return resposta(500, { erro: "Erro ao vincular perfil: " + perfilErr.message });
    }

    return resposta(200, { ok: true, lava_jato_id: lj.id, email });
  }

  return resposta(405, { erro: "Método não permitido." });
};
