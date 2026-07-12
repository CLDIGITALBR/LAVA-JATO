// =====================================================================
//  Netlify Function — criar-lavajato (painel admin CL Digital)
//  Endpoint: /.netlify/functions/criar-lavajato
//
//  GET  → lista lava-jatos, cada um com seus logins (e-mail + papel)
//  POST → várias ações, definidas pelo campo "acao":
//         - criar_lavajato    : cria lava-jato + 1º login
//         - adicionar_login   : adiciona um login a um lava-jato existente
//         - remover_login     : apaga um login (usuário)
//         - remover_lavajato  : apaga o lava-jato inteiro (logins + lavagens)
//
//  VARIÁVEIS DE AMBIENTE (Netlify → Site settings → Environment variables):
//    SUPABASE_URL, SUPABASE_SERVICE_KEY (sb_secret_...), ADMIN_TOKEN
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

  const token = event.headers["x-admin-token"] || event.headers["X-Admin-Token"];
  if (token !== ADMIN_TOKEN) {
    return resposta(401, { erro: "Token de admin inválido." });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ── GET: lista lava-jatos com seus logins ──────
  if (event.httpMethod === "GET") {
    const { data: ljs, error: e1 } = await admin
      .from("lava_jatos")
      .select("id, nome, telefone, criado_em")
      .order("criado_em", { ascending: false });
    if (e1) return resposta(500, { erro: e1.message });

    const { data: perfis, error: e2 } = await admin
      .from("perfis")
      .select("id, lava_jato_id, nome, papel");
    if (e2) return resposta(500, { erro: e2.message });

    // pega os e-mails a partir do Auth
    const { data: usersData, error: e3 } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (e3) return resposta(500, { erro: e3.message });
    const emailPorId = {};
    (usersData.users || []).forEach((u) => (emailPorId[u.id] = u.email));

    const resultado = (ljs || []).map((lj) => ({
      ...lj,
      usuarios: (perfis || [])
        .filter((p) => p.lava_jato_id === lj.id)
        .map((p) => ({
          uid: p.id,
          email: emailPorId[p.id] || "(sem e-mail)",
          papel: p.papel,
          nome: p.nome,
        })),
    }));

    return resposta(200, { lava_jatos: resultado });
  }

  // ── POST: ações ────────────────────────────────
  if (event.httpMethod === "POST") {
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return resposta(400, { erro: "JSON inválido." });
    }
    const acao = body.acao || "criar_lavajato";

    // -- criar lava-jato + 1º login ----------------
    if (acao === "criar_lavajato") {
      const { nome, telefone, cor, email, senha, nome_dono } = body;
      if (!nome || !email || !senha)
        return resposta(400, { erro: "Nome do lava-jato, e-mail e senha são obrigatórios." });
      if (String(senha).length < 6)
        return resposta(400, { erro: "A senha precisa ter ao menos 6 caracteres." });

      const { data: u, error: ue } = await admin.auth.admin.createUser({
        email, password: senha, email_confirm: true,
        user_metadata: { precisa_trocar_senha: true },
      });
      if (ue) return resposta(400, { erro: "Erro ao criar usuário: " + ue.message });
      const uid = u.user.id;

      const { data: lj, error: le } = await admin
        .from("lava_jatos")
        .insert({ nome, telefone: telefone || null, cor_primaria: cor || "#1976D2" })
        .select("id").single();
      if (le) {
        await admin.auth.admin.deleteUser(uid);
        return resposta(500, { erro: "Erro ao criar lava-jato: " + le.message });
      }

      const { error: pe } = await admin.from("perfis").insert({
        id: uid, lava_jato_id: lj.id, nome: nome_dono || nome, papel: "dono",
      });
      if (pe) {
        await admin.auth.admin.deleteUser(uid);
        await admin.from("lava_jatos").delete().eq("id", lj.id);
        return resposta(500, { erro: "Erro ao vincular perfil: " + pe.message });
      }
      return resposta(200, { ok: true, lava_jato_id: lj.id });
    }

    // -- adicionar login a lava-jato existente ------
    if (acao === "adicionar_login") {
      const { lava_jato_id, email, senha, nome, papel } = body;
      if (!lava_jato_id || !email || !senha)
        return resposta(400, { erro: "Lava-jato, e-mail e senha são obrigatórios." });
      if (String(senha).length < 6)
        return resposta(400, { erro: "A senha precisa ter ao menos 6 caracteres." });

      const { data: u, error: ue } = await admin.auth.admin.createUser({
        email, password: senha, email_confirm: true,
        user_metadata: { precisa_trocar_senha: true },
      });
      if (ue) return resposta(400, { erro: "Erro ao criar usuário: " + ue.message });
      const uid = u.user.id;

      const { error: pe } = await admin.from("perfis").insert({
        id: uid,
        lava_jato_id,
        nome: nome || email,
        papel: papel === "dono" ? "dono" : "atendente",
      });
      if (pe) {
        await admin.auth.admin.deleteUser(uid);
        return resposta(500, { erro: "Erro ao vincular login: " + pe.message });
      }
      return resposta(200, { ok: true });
    }

    // -- resetar senha (senha provisória) ----------
    //    Define uma nova senha e marca a conta para trocar
    //    a senha obrigatoriamente no próximo login.
    if (acao === "resetar_senha") {
      const { uid, senha } = body;
      if (!uid || !senha)
        return resposta(400, { erro: "UID do login e a nova senha são obrigatórios." });
      if (String(senha).length < 6)
        return resposta(400, { erro: "A senha precisa ter ao menos 6 caracteres." });

      const { error } = await admin.auth.admin.updateUserById(uid, {
        password: senha,
        user_metadata: { precisa_trocar_senha: true },
      });
      if (error) return resposta(500, { erro: "Erro ao redefinir a senha: " + error.message });
      return resposta(200, { ok: true });
    }

    // -- remover login (usuário) --------------------
    if (acao === "remover_login") {      const { uid } = body;
      if (!uid) return resposta(400, { erro: "UID do login é obrigatório." });
      const { error } = await admin.auth.admin.deleteUser(uid); // cascata remove o perfil
      if (error) return resposta(500, { erro: "Erro ao remover login: " + error.message });
      return resposta(200, { ok: true });
    }

    // -- remover lava-jato inteiro ------------------
    if (acao === "remover_lavajato") {
      const { lava_jato_id } = body;
      if (!lava_jato_id) return resposta(400, { erro: "ID do lava-jato é obrigatório." });

      // pega os logins desse lava-jato antes de apagar
      const { data: perfis } = await admin
        .from("perfis").select("id").eq("lava_jato_id", lava_jato_id);
      const uids = (perfis || []).map((p) => p.id);

      // apaga o lava-jato (cascata remove perfis + lavagens)
      const { error: le } = await admin.from("lava_jatos").delete().eq("id", lava_jato_id);
      if (le) return resposta(500, { erro: "Erro ao remover lava-jato: " + le.message });

      // apaga os usuários de login que sobraram no Auth
      for (const uid of uids) {
        await admin.auth.admin.deleteUser(uid);
      }
      return resposta(200, { ok: true });
    }

    return resposta(400, { erro: "Ação desconhecida." });
  }

  return resposta(405, { erro: "Método não permitido." });
};
