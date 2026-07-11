// =============================================
//  LavaSync — script.js  (versão Supabase)
//  + Editar registro  + Histórico por placa
// =============================================

let LAVA_JATO_ID = null;
let editandoId = null; // id da lavagem sendo editada

// ── HELPERS ───────────────────────────────────

function formatarBRL(valor) {
  return (Number(valor) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatarHora(iso) {
  if (!iso) return "--:--";
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
function formatarData(iso) {
  if (!iso) return "--/--";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function ehHoje(iso) {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date().toDateString();
}
function ehMesAtual(iso) {
  if (!iso) return false;
  const d = new Date(iso), h = new Date();
  return d.getMonth() === h.getMonth() && d.getFullYear() === h.getFullYear();
}
function linkWhatsApp(reg) {
  let numero = (reg.telefone_cliente || "").replace(/\D/g, "");
  if (numero && !numero.startsWith("55")) numero = "55" + numero;
  const primeiroNome = (reg.nome_cliente || "").split(" ")[0] || "";
  const msg = `Olá ${primeiroNome}! 🚗 Seu ${reg.marca} ${reg.modelo} (${reg.placa}) já está pronto aqui no lava-jato. Serviço: ${reg.servico}. Pode retirar quando quiser. 💧`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
}
function toast(texto) {
  const el = document.getElementById("toast");
  el.textContent = texto;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.classList.remove("show"); setTimeout(() => (el.hidden = true), 300); }, 3000);
}

// ── 0. LOGIN / SESSÃO ─────────────────────────

const authScreen = document.getElementById("auth-screen");
function mostrarLogin() { authScreen.hidden = false; }

async function entrarNoApp() {
  const { data: perfil, error } = await sb.from("perfis").select("lava_jato_id, nome").maybeSingle();
  if (error || !perfil || !perfil.lava_jato_id) {
    const erro = document.getElementById("auth-erro");
    erro.textContent = "Conta sem lava-jato vinculado. Fale com o suporte.";
    erro.hidden = false;
    await sb.auth.signOut();
    return;
  }
  LAVA_JATO_ID = perfil.lava_jato_id;
  const { data: lj } = await sb.from("lava_jatos").select("nome").eq("id", LAVA_JATO_ID).maybeSingle();
  if (lj && lj.nome) document.getElementById("nome-lavajato").textContent = lj.nome;
  authScreen.hidden = true;
  await atualizarBadge();
}

async function iniciarSessao() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) await entrarNoApp(); else mostrarLogin();
}

async function fazerLogin() {
  const email = document.getElementById("login-email").value.trim();
  const senha = document.getElementById("login-senha").value;
  const erro = document.getElementById("auth-erro");
  erro.hidden = true;
  const { error } = await sb.auth.signInWithPassword({ email, password: senha });
  if (error) { erro.textContent = "E-mail ou senha inválidos."; erro.hidden = false; return; }
  await entrarNoApp();
}

document.getElementById("btn-login").addEventListener("click", fazerLogin);
document.getElementById("login-senha").addEventListener("keydown", (e) => { if (e.key === "Enter") fazerLogin(); });
document.getElementById("btn-logout").addEventListener("click", async () => { await sb.auth.signOut(); location.reload(); });

// ── 1. HAMBÚRGUER ─────────────────────────────

const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const abrirSidebar = () => { sidebar.classList.add("open"); overlay.classList.add("open"); };
const fecharSidebar = () => { sidebar.classList.remove("open"); overlay.classList.remove("open"); };
hamburger.addEventListener("click", abrirSidebar);
overlay.addEventListener("click", fecharSidebar);

// ── 2. NAVEGAÇÃO ──────────────────────────────

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
navItems.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const alvo = btn.dataset.page;
    navItems.forEach((b) => b.classList.remove("active"));
    pages.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("page-" + alvo).classList.add("active");
    if (alvo === "fila") await renderFila();
    if (alvo === "lavagens") await renderHistorico();
    fecharSidebar();
  });
});

function irParaPagina(alvo) {
  document.querySelector('.nav-item[data-page="' + alvo + '"]').click();
}

// ── 3. CASCATA TIPO → MARCA → MODELO ──────────

const tipoSelect = document.getElementById("tipo_veiculo");
const marcaSelect = document.getElementById("marca");
const modeloSelect = document.getElementById("modelo");
const servicoSelect = document.getElementById("servico");

function preencherSelect(selectEl, opcoes, textoPadrao) {
  selectEl.innerHTML = `<option value="">${textoPadrao}</option>`;
  opcoes.forEach((opcao) => {
    const opt = document.createElement("option");
    opt.value = opcao; opt.textContent = opcao;
    selectEl.appendChild(opt);
  });
}
function carregarTipos() {
  const tipos = [...new Set(veiculosData.map((item) => item.tipo))];
  preencherSelect(tipoSelect, tipos, "Selecione...");
}
tipoSelect.addEventListener("change", () => {
  const tipo = tipoSelect.value;
  if (!tipo) {
    preencherSelect(marcaSelect, [], "Selecione o tipo primeiro"); marcaSelect.disabled = true;
    preencherSelect(modeloSelect, [], "Selecione a marca primeiro"); modeloSelect.disabled = true;
    return;
  }
  const marcas = [...new Set(veiculosData.filter((v) => v.tipo === tipo).map((v) => v.marca))];
  preencherSelect(marcaSelect, marcas, "Selecione..."); marcaSelect.disabled = false;
  preencherSelect(modeloSelect, [], "Selecione a marca primeiro"); modeloSelect.disabled = true;
});
marcaSelect.addEventListener("change", () => {
  const tipo = tipoSelect.value, marca = marcaSelect.value;
  if (!marca) { preencherSelect(modeloSelect, [], "Selecione a marca primeiro"); modeloSelect.disabled = true; return; }
  const modelos = veiculosData.filter((v) => v.tipo === tipo && v.marca === marca).map((v) => v.modelo);
  preencherSelect(modeloSelect, modelos, "Selecione..."); modeloSelect.disabled = false;
});

// ── 4. SERVIÇOS ───────────────────────────────

const servicosData = [
  "Lavagem simples","Lavagem completa","Lavagem a seco","Lavagem ecológica",
  "Lavagem de motor","Lavagem de chassis","Higienização interna",
  "Higienização de ar-condicionado","Polimento","Cristalização","Cera",
  "Pretinho de pneu","Limpeza de estofados","Limpeza de tapetes",
  "Lavagem de bancos de couro","Lavagem de teto","Descontaminação de pintura",
  "Vitrificação de pintura","Lavagem de caminhonetes e utilitários","Lavagem de motos"
];
preencherSelect(servicoSelect, servicosData, "Selecione...");
preencherSelect(document.getElementById("edit-servico"), servicosData, "Selecione...");

// ── HISTÓRICO POR PLACA: recorrência no cadastro ──

const placaInput = document.getElementById("placa");
const placaHint = document.getElementById("placa-hint");

placaInput.addEventListener("blur", async () => {
  const placa = placaInput.value.trim().toUpperCase();
  placaHint.hidden = true;
  if (!placa || !LAVA_JATO_ID) return;
  const { data, error } = await sb.from("lavagens").select("*").eq("placa", placa);
  if (error || !data || data.length === 0) return;

  data.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
  const ultimo = data[0];
  placaHint.innerHTML = `🔁 <b>Cliente recorrente</b> — já veio ${data.length} vez(es). Última: ${ultimo.nome_cliente}.`;
  placaHint.hidden = false;

  // preenche nome e telefone se estiverem vazios
  const nomeEl = document.getElementById("nome_cliente");
  const telEl = document.getElementById("telefone_cliente");
  if (!nomeEl.value) nomeEl.value = ultimo.nome_cliente || "";
  if (!telEl.value) telEl.value = ultimo.telefone_cliente || "";
});

// ── 5. REGISTRAR (INSERT) ─────────────────────

document.getElementById("form-entrada").addEventListener("submit", async (event) => {
  event.preventDefault();
  const registro = {
    lava_jato_id: LAVA_JATO_ID,
    data_entrada: document.getElementById("data_entrada").value,
    nome_cliente: document.getElementById("nome_cliente").value.trim(),
    telefone_cliente: document.getElementById("telefone_cliente").value.trim(),
    responsavel: document.getElementById("responsavel").value.trim(),
    tipo_veiculo: document.getElementById("tipo_veiculo").value,
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    placa: document.getElementById("placa").value.trim().toUpperCase(),
    servico: document.getElementById("servico").value,
    valor_servico: Number(document.getElementById("valor_servico").value) || 0,
    status: "fila",
  };
  const { error } = await sb.from("lavagens").insert(registro);
  if (error) { console.error(error); toast("❌ Erro ao registrar. Tente de novo."); return; }
  toast("✔ " + registro.nome_cliente + " adicionado à fila!");
  event.target.reset();
  placaHint.hidden = true;
  document.getElementById("data_entrada").valueAsDate = new Date();
  preencherSelect(marcaSelect, [], "Selecione o tipo primeiro"); marcaSelect.disabled = true;
  preencherSelect(modeloSelect, [], "Selecione a marca primeiro"); modeloSelect.disabled = true;
  await atualizarBadge();
  irParaPagina("fila");
});

// ── ACESSO AOS DADOS ──────────────────────────

async function buscarLavagens(status) {
  let q = sb.from("lavagens").select("*");
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) { console.error(error); toast("❌ Erro ao carregar dados."); return []; }
  return data || [];
}

// ── 6. FILA DE ESPERA ─────────────────────────

async function renderFila() {
  const lista = await buscarLavagens("fila");
  const container = document.getElementById("fila-lista");
  document.getElementById("stat-fila-qtd").textContent = lista.length;
  const total = lista.reduce((s, r) => s + Number(r.valor_servico), 0);
  document.getElementById("stat-fila-valor").textContent = formatarBRL(total);

  if (lista.length === 0) {
    container.innerHTML = `<div class="card"><div class="empty-state"><span class="empty-icon">🚗</span><h3>Nenhum veículo na fila</h3><p>Os veículos registrados aparecem aqui aguardando atendimento</p></div></div>`;
    return;
  }
  lista.sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));
  container.innerHTML = lista.map((r) => `
    <div class="wash-card">
      <div class="wash-info">
        <div class="wash-top">
          <span class="wash-cliente">${r.nome_cliente}</span>
          <span class="badge-placa" onclick="verPlaca('${r.placa}')">${r.placa}</span>
        </div>
        <div class="wash-veiculo">${r.tipo_veiculo} • ${r.marca} ${r.modelo}</div>
        <div class="wash-meta">
          <span class="badge-servico">${r.servico}</span>
          <span>Entrada: <b>${formatarHora(r.criado_em)}</b></span>
          <span>Resp.: <b>${r.responsavel || "-"}</b></span>
          <span class="wash-valor">${formatarBRL(r.valor_servico)}</span>
        </div>
      </div>
      <div class="wash-actions">
        <button class="btn-action btn-concluir" onclick="concluirLavagem('${r.id}')">✔ Concluir</button>
        <a class="btn-action btn-whats" href="${linkWhatsApp(r)}" target="_blank" rel="noopener">📲 Avisar cliente</a>
        <button class="btn-action btn-editar" onclick="abrirEdicao('${r.id}')">✏️ Editar</button>
        <button class="btn-action btn-remover" onclick="removerLavagem('${r.id}')">Remover</button>
      </div>
    </div>`).join("");
}

async function concluirLavagem(id) {
  const { error } = await sb.from("lavagens").update({ status: "concluida", concluido_em: new Date().toISOString() }).eq("id", id);
  if (error) { console.error(error); toast("❌ Erro ao concluir."); return; }
  toast("💧 Lavagem concluída — enviada para o histórico");
  await renderFila(); await atualizarBadge();
}

async function removerLavagem(id) {
  if (!confirm("Remover este registro da fila?")) return;
  const { error } = await sb.from("lavagens").delete().eq("id", id);
  if (error) { console.error(error); toast("❌ Erro ao remover."); return; }
  await renderFila(); await atualizarBadge();
}

// ── EDITAR REGISTRO ───────────────────────────

const editOverlay = document.getElementById("edit-overlay");

async function abrirEdicao(id) {
  const { data: r, error } = await sb.from("lavagens").select("*").eq("id", id).single();
  if (error || !r) { toast("❌ Não foi possível abrir o registro."); return; }
  editandoId = id;
  document.getElementById("edit-nome").value = r.nome_cliente || "";
  document.getElementById("edit-telefone").value = r.telefone_cliente || "";
  document.getElementById("edit-responsavel").value = r.responsavel || "";
  document.getElementById("edit-placa").value = r.placa || "";
  document.getElementById("edit-servico").value = r.servico || "";
  document.getElementById("edit-valor").value = r.valor_servico || 0;
  editOverlay.hidden = false;
}

function fecharEdicao() { editOverlay.hidden = true; editandoId = null; }

document.getElementById("edit-cancelar").addEventListener("click", fecharEdicao);
editOverlay.addEventListener("click", (e) => { if (e.target === editOverlay) fecharEdicao(); });

document.getElementById("edit-salvar").addEventListener("click", async () => {
  if (!editandoId) return;
  const dados = {
    nome_cliente: document.getElementById("edit-nome").value.trim(),
    telefone_cliente: document.getElementById("edit-telefone").value.trim(),
    responsavel: document.getElementById("edit-responsavel").value.trim(),
    placa: document.getElementById("edit-placa").value.trim().toUpperCase(),
    servico: document.getElementById("edit-servico").value,
    valor_servico: Number(document.getElementById("edit-valor").value) || 0,
  };
  const { error } = await sb.from("lavagens").update(dados).eq("id", editandoId);
  if (error) { console.error(error); toast("❌ Erro ao salvar."); return; }
  toast("✔ Alterações salvas.");
  fecharEdicao();
  // recarrega a tela ativa
  if (document.getElementById("page-fila").classList.contains("active")) await renderFila();
  if (document.getElementById("page-lavagens").classList.contains("active")) await renderHistorico();
  await atualizarBadge();
});

// ── 7. HISTÓRICO + FINANCEIRO + POR PLACA ─────

function verPlaca(placa) {
  document.getElementById("busca-historico").value = placa;
  irParaPagina("lavagens");
}

async function renderHistorico() {
  const concluidas = await buscarLavagens("concluida");

  const hoje = concluidas.filter((r) => ehHoje(r.concluido_em));
  const mes = concluidas.filter((r) => ehMesAtual(r.concluido_em));
  const fatHoje = hoje.reduce((s, r) => s + Number(r.valor_servico), 0);
  const fatMes = mes.reduce((s, r) => s + Number(r.valor_servico), 0);
  const ticket = mes.length ? fatMes / mes.length : 0;
  document.getElementById("stat-hoje-qtd").textContent = hoje.length;
  document.getElementById("stat-hoje-fat").textContent = formatarBRL(fatHoje);
  document.getElementById("stat-mes-fat").textContent = formatarBRL(fatMes);
  document.getElementById("stat-ticket").textContent = formatarBRL(ticket);

  const termo = (document.getElementById("busca-historico").value || "").toLowerCase().trim();
  let filtradas = concluidas;
  if (termo) {
    filtradas = concluidas.filter((r) =>
      (r.nome_cliente + " " + r.placa + " " + r.marca + " " + r.modelo).toLowerCase().includes(termo));
  }

  // Resumo da busca (histórico por placa)
  const resumo = document.getElementById("resumo-placa");
  if (termo && filtradas.length > 0) {
    const totalGasto = filtradas.reduce((s, r) => s + Number(r.valor_servico), 0);
    const ordenadas = [...filtradas].sort((a, b) => new Date(b.concluido_em) - new Date(a.concluido_em));
    const ultima = ordenadas[0];
    resumo.innerHTML = `🔎 <b>${filtradas.length}</b> lavagem(ns) para "<b>${termo.toUpperCase()}</b>" • total <b>${formatarBRL(totalGasto)}</b> • última em <b>${formatarData(ultima.concluido_em)}</b> (${ultima.nome_cliente})`;
    resumo.hidden = false;
  } else {
    resumo.hidden = true;
  }

  const container = document.getElementById("lavagens-lista");
  if (filtradas.length === 0) {
    container.innerHTML = `<div class="card"><div class="empty-state"><span class="empty-icon">📋</span><h3>${termo ? "Nada encontrado" : "Nenhuma lavagem registrada"}</h3><p>${termo ? "Tente outro termo de busca" : "As lavagens concluídas aparecem aqui"}</p></div></div>`;
    return;
  }
  filtradas.sort((a, b) => new Date(b.concluido_em) - new Date(a.concluido_em));
  container.innerHTML = filtradas.map((r) => `
    <div class="wash-card done">
      <div class="wash-info">
        <div class="wash-top">
          <span class="wash-cliente">${r.nome_cliente}</span>
          <span class="badge-placa" onclick="verPlaca('${r.placa}')">${r.placa}</span>
        </div>
        <div class="wash-veiculo">${r.tipo_veiculo} • ${r.marca} ${r.modelo}</div>
        <div class="wash-meta">
          <span class="badge-servico">${r.servico}</span>
          <span>Entrada: <b>${formatarHora(r.criado_em)}</b></span>
          <span>Saída: <b>${formatarHora(r.concluido_em)}</b></span>
          <span>Resp.: <b>${r.responsavel || "-"}</b></span>
          <span class="wash-valor">${formatarBRL(r.valor_servico)}</span>
        </div>
      </div>
      <div class="wash-actions">
        <button class="btn-action btn-editar" onclick="abrirEdicao('${r.id}')">✏️ Editar</button>
      </div>
    </div>`).join("");
}

document.getElementById("busca-historico").addEventListener("input", renderHistorico);

// ── BADGE DA FILA ─────────────────────────────

async function atualizarBadge() {
  const lista = await buscarLavagens("fila");
  const badge = document.getElementById("fila-badge");
  badge.textContent = lista.length;
  badge.hidden = lista.length === 0;
}

// ── INICIALIZAÇÃO ─────────────────────────────

carregarTipos();
document.getElementById("data_entrada").valueAsDate = new Date();
iniciarSessao();
