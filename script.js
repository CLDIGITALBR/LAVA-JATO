// =============================================
//  LavaSync — script.js  (versão Supabase)
//  + Editar registro  + Histórico por placa
// =============================================

let LAVA_JATO_ID = null;
let PAPEL = null;              // 'dono' | 'atendente'
let SERVICOS = [];             // [{id, nome, preco, ...}]
let editandoId = null;         // id da lavagem sendo editada
let editandoServicoId = null;  // id do serviço sendo editado (tela Opções)
let DIAS_ACESSO = null;        // dias de crédito restantes (plano Free Trial)
let PLANO = null;              // 'Free Trial' | 'Mensal'
let NOME_LAVAJATO = "";        // nome do lava-jato (usado na saudação da Início)

// ── HELPERS ───────────────────────────────────

// ── COR DO SISTEMA ────────────────────────────

const CORES_PRESET = ["#0071e3", "#ff3b30", "#137a45", "#b26a00", "#8e44ec", "#1d1d1f"];

function aplicarCor(hex) {
  document.documentElement.style.setProperty("--brand", hex);
}

function getCorBrand() {
  return (getComputedStyle(document.documentElement).getPropertyValue("--brand") || "#0071e3").trim();
}

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function montarPresetsDeCor() {
  const container = document.getElementById("cor-presets");
  if (!container) return;
  container.innerHTML = CORES_PRESET.map((c) =>
    `<button type="button" class="cor-preset" style="background:${c}" data-cor="${c}" title="${c}"></button>`
  ).join("");
  container.querySelectorAll(".cor-preset").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cor = btn.dataset.cor;
      document.getElementById("cor-principal").value = cor;
      aplicarCor(cor); // prévia instantânea
    });
  });
}

document.getElementById("btn-salvar-cor").addEventListener("click", salvarCor);
document.getElementById("cor-principal").addEventListener("input", (e) => aplicarCor(e.target.value));

async function salvarCor() {
  if (PAPEL !== "dono") { toast("Apenas o dono pode alterar a cor do sistema."); return; }
  const hex = document.getElementById("cor-principal").value;
  const { error } = await sb.from("lava_jatos").update({ cor_principal: hex }).eq("id", LAVA_JATO_ID);
  if (error) { console.error(error); toast("❌ Erro ao salvar a cor."); return; }
  aplicarCor(hex);
  toast("✔ Cor do sistema atualizada!");
  if (document.getElementById("page-dashboard").classList.contains("active")) {
    const concluidas = await renderDashboardCards();
    renderGraficoFaturamento(concluidas);
    await renderGraficoVolume30Dias();
    await renderGraficoPicoSemanal();
  }
}

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
  const msg = `Olá ${primeiroNome}! Seu ${reg.marca} ${reg.modelo} (${reg.placa}) já está pronto aqui no lava-jato. Serviço: ${reg.servico}. Pode retirar quando quiser.`;
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

// ── SONS (gerados no navegador, sem arquivos) ──
let _audioCtx = null;
function _ctxAudio() {
  try {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (_audioCtx.state === "suspended") _audioCtx.resume();
    return _audioCtx;
  } catch (e) { return null; }
}
function _nota(ctx, freq, atraso, dur, vol) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.connect(g); g.connect(ctx.destination);
  const t = ctx.currentTime + atraso;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}
function tocarSom(evento) {
  if (localStorage.getItem("som_desligado") === "1") return;  // permite mutar
  const ctx = _ctxAudio();
  if (!ctx) return;
  if (evento === "registrar") {
    // dois "blips" curtos subindo — som de "entrou na fila"
    _nota(ctx, 660, 0, 0.12, 0.18);
    _nota(ctx, 880, 0.10, 0.14, 0.18);
  } else if (evento === "concluir") {
    // acorde alegre de 3 notas — som de "finalizado"
    _nota(ctx, 523.25, 0.00, 0.16, 0.18); // dó
    _nota(ctx, 659.25, 0.12, 0.16, 0.18); // mi
    _nota(ctx, 783.99, 0.24, 0.32, 0.20); // sol
  }
}

// ── HELPERS DE DATA (dashboard) ───────────────

function inicioDia(data = new Date()) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}
function somaDias(data, dias) {
  const d = new Date(data);
  d.setDate(d.getDate() + dias);
  return d;
}
function inicioSemana(data = new Date()) {
  // segunda-feira como 1º dia: getDay() dá 0=domingo...6=sábado
  const dia = data.getDay();
  const diffParaSegunda = dia === 0 ? -6 : 1 - dia;
  return inicioDia(somaDias(data, diffParaSegunda));
}
function inicioMes(data = new Date()) {
  return new Date(data.getFullYear(), data.getMonth(), 1);
}

// ── FILTRO POR PERÍODO ────────────────────────
// [inicio, fim) — inclui o início, exclui o fim. Isso evita contar
// a mesma lavagem duas vezes na fronteira entre dois períodos.
function filtrarPorPeriodo(lista, inicio, fim) {
  return lista.filter((r) => {
    const d = new Date(r.concluido_em);
    return d >= inicio && d < fim;
  });
}

// ── AGREGADOS ──────────────────────────────────

function calcularMetricas(lista) {
  const fat = lista.reduce((s, r) => s + Number(r.valor_servico), 0);
  const qtd = lista.length;
  const ticket = qtd ? fat / qtd : 0;
  return { fat, qtd, ticket };
}

function tempoMedioMinutos(lista) {
  const validos = lista.filter((r) => r.criado_em && r.concluido_em);
  if (!validos.length) return 0;
  const totalMs = validos.reduce(
    (s, r) => s + (new Date(r.concluido_em) - new Date(r.criado_em)), 0
  );
  return Math.round(totalMs / validos.length / 60000); // ms → min
}

function topServicos(lista, n = 5) {
  const contagem = {};
  lista.forEach((r) => { contagem[r.servico] = (contagem[r.servico] || 0) + 1; });
  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

// ── RENDER DOS CARDS DO DASHBOARD ─────────────

async function renderDashboardCards() {
  const concluidas = await buscarLavagens("concluida");
  const doMes = filtrarPorPeriodo(concluidas, inicioMes(), somaDias(new Date(), 1));

  const { fat, qtd, ticket } = calcularMetricas(doMes);
  document.getElementById("dash-fat-mes").textContent = formatarBRL(fat);
  document.getElementById("dash-ticket-mes").textContent = formatarBRL(ticket);
  document.getElementById("dash-qtd-mes").textContent = qtd;
  document.getElementById("dash-tempo-medio").textContent = tempoMedioMinutos(doMes) + " min";

  const top3 = topServicos(doMes, 5);
  const container = document.getElementById("dash-top3");
  container.innerHTML = top3.length
    ? top3.map(([nome, c], i) => `
        <div class="top3-item">
          <span class="top3-pos">${i + 1}º</span>
          <span class="top3-nome">${nome}</span>
          <span class="top3-qtd">${c}x</span>
        </div>`).join("")
    : `<p style="color:var(--muted);font-size:14px;">Sem lavagens este mês ainda.</p>`;

  return concluidas; // reaproveitado pelo gráfico
}

// ── TELA INÍCIO (HOME) ────────────────────────

const DICAS = [
  "Peça sempre o telefone do cliente: assim você avisa pelo WhatsApp quando o carro estiver pronto — e ele volta mais.",
  "Cadastre seus serviços e preços em Opções. O valor preenche sozinho e você não erra no troco.",
  "Anote a placa em toda lavagem. O sistema reconhece clientes recorrentes automaticamente no cadastro.",
  "Ofereça um combo (lavagem + cera, ou + higienização) para aumentar o ticket médio sem gastar mais tempo.",
  "Confira o Dashboard toda segunda para ver o serviço mais vendido e o horário de pico da semana.",
  "Fim de semana costuma lotar. Ofereça horário marcado durante a semana para clientes fiéis.",
  "Um cliente satisfeito indica outros. Vale a pena um cartãozinho de 'a cada 10 lavagens, 1 grátis'.",
  "Registre a lavagem assim que o carro chega — a fila fica organizada e ninguém fura a ordem.",
];

// Dias restantes de crédito (Free Trial). null = sem informação.
function diasDeCredito() {
  if (DIAS_ACESSO == null || isNaN(DIAS_ACESSO)) return null;
  return DIAS_ACESSO;
}

function renderCreditoBanner() {
  const banner = document.getElementById("credito-banner");
  if (!banner) return;   // index.html sem a tela Início → nada a fazer
  const icon = document.getElementById("credito-icon");
  const titulo = document.getElementById("credito-titulo");
  const detalhe = document.getElementById("credito-detalhe");
  const btnRenovar = document.getElementById("btn-renovar");
  if (btnRenovar) btnRenovar.hidden = true;   // só aparece em alerta/crítico
  banner.classList.remove("alerta", "critico");

  const contato = (typeof CL_DIGITAL_CONTATO !== "undefined" && CL_DIGITAL_CONTATO)
    ? " Fale com a CL Digital: " + CL_DIGITAL_CONTATO + "." : "";

  const plano = (PLANO || "").toString().trim();
  const ehMensal = plano.toLowerCase().includes("mensal");
  const dias = (DIAS_ACESSO == null || isNaN(DIAS_ACESSO)) ? null : DIAS_ACESSO;
  const nomePlano = plano || (dias !== null ? "Free Trial" : "");

  // Sem nenhuma informação de plano/dias → não mostra a faixa
  if (!plano && dias === null) { banner.hidden = true; return; }
  banner.hidden = false;

  // Plano mensal: assinatura em dia, sem contagem regressiva
  if (ehMensal) {
    icon.textContent = "✅";
    titulo.textContent = "Plano Mensal";
    detalhe.textContent = "Assinatura ativa.";
    return;
  }

  // Plano por contador de dias (Free Trial etc.) sem número de dias definido
  if (dias === null) {
    icon.textContent = "✅";
    titulo.textContent = "Plano: " + nomePlano;
    detalhe.textContent = "Acesso ativo.";
    return;
  }

  // Com contador de dias
  if (dias <= 0) {
    banner.classList.add("critico");
    icon.textContent = "⛔";
    titulo.textContent = `${nomePlano} — dias de crédito esgotados`;
    detalhe.textContent = "Renove para continuar usando o sistema." + contato;
    if (btnRenovar) btnRenovar.hidden = false;
  } else if (dias <= 7) {
    banner.classList.add("alerta");
    icon.textContent = "⚠️";
    titulo.textContent = `${nomePlano} — faltam ${dias} dia(s)`;
    detalhe.textContent = "Renove para não interromper o serviço." + contato;
    if (btnRenovar) btnRenovar.hidden = false;
  } else {
    icon.textContent = "✅";
    titulo.textContent = `${nomePlano} — ${dias} dias restantes`;
    detalhe.textContent = "Seu acesso está em dia.";
  }
}

function escolherDica(filaQtd) {
  const dias = diasDeCredito();
  if (PLANO !== "Mensal" && dias !== null && dias <= 7) {
    return "Seu crédito está acabando. Renove com a CL Digital para não interromper o atendimento.";
  }
  if (PAPEL === "dono" && SERVICOS.length === 0) {
    return "Cadastre seus serviços e preços em Opções — o valor passa a preencher sozinho a cada lavagem e você evita erros de digitação.";
  }
  if (filaQtd >= 5) {
    return `Você tem ${filaQtd} carros na fila agora. Avise os clientes pelo WhatsApp conforme forem ficando prontos para agilizar a saída.`;
  }
  // dica rotativa, estável ao longo do dia (troca a cada dia)
  const diaAno = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return DICAS[diaAno % DICAS.length];
}

let ULTIMO_FAT_MES = 0;   // guardado p/ re-render da meta sem refetch

async function renderHome() {
  if (!document.getElementById("page-home")) return;  // index.html sem a Início → ignora
  document.getElementById("home-saudacao").textContent =
    NOME_LAVAJATO ? "Olá, " + NOME_LAVAJATO : "Início";

  renderCreditoBanner();
  renderClima();  // assíncrono, atualiza sozinho quando chegar

  const concluidas = await buscarLavagens("concluida");
  const hoje = inicioDia();
  const ontem = somaDias(hoje, -1);
  const amanha = somaDias(hoje, 1);

  const mHoje = calcularMetricas(filtrarPorPeriodo(concluidas, hoje, amanha));
  const mOntem = calcularMetricas(filtrarPorPeriodo(concluidas, ontem, hoje));

  document.getElementById("home-hoje-qtd").textContent = mHoje.qtd;
  document.getElementById("home-hoje-fat").textContent = formatarBRL(mHoje.fat);

  // tendência de hoje comparado a ontem (só quantidade)
  const trend = document.getElementById("home-hoje-trend");
  const diff = mHoje.qtd - mOntem.qtd;
  if (mHoje.qtd === 0 && mOntem.qtd === 0) {
    trend.textContent = ""; trend.className = "trend";
  } else if (diff > 0) {
    trend.textContent = `▲ ${diff}`; trend.className = "trend up";
  } else if (diff < 0) {
    trend.textContent = `▼ ${Math.abs(diff)}`; trend.className = "trend down";
  } else {
    trend.textContent = "= igual a ontem"; trend.className = "trend flat";
  }

  // fechamento de ontem (destaque)
  document.getElementById("home-ontem-fechamento").textContent = `${mOntem.qtd} carro(s)`;
  document.getElementById("home-ontem-sub").textContent = `${formatarBRL(mOntem.fat)} faturados`;

  // carros esperando agora + alerta de carro parado
  const fila = await buscarLavagens("fila");
  document.getElementById("home-fila").textContent = fila.length;
  renderAlertaFila(fila);

  // cliente mais fiel do mês
  const doMes = filtrarPorPeriodo(concluidas, inicioMes(), amanha);
  renderClienteFiel(doMes);

  // comparativo da semana
  const semanaAtual = inicioSemana();
  const nSemana = filtrarPorPeriodo(concluidas, semanaAtual, somaDias(semanaAtual, 7)).length;
  const nSemanaPassada = filtrarPorPeriodo(concluidas, somaDias(semanaAtual, -7), semanaAtual).length;
  document.getElementById("home-semana-qtd").textContent = `${nSemana} lavagem(ns)`;
  const ds = nSemana - nSemanaPassada;
  document.getElementById("home-semana-sub").textContent =
    ds > 0 ? `${ds} a mais que a semana passada`
    : ds < 0 ? `${Math.abs(ds)} a menos que a semana passada`
    : "igual à semana passada";

  // meta do mês
  ULTIMO_FAT_MES = calcularMetricas(doMes).fat;
  renderMeta(ULTIMO_FAT_MES);

  // dica do dia (contextual ou rotativa)
  document.getElementById("home-dica-texto").textContent = escolherDica(fila.length);
}

// ── ALERTA: CARRO PARADO NA FILA ──────────────
function formatarEspera(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}
function renderAlertaFila(fila) {
  const el = document.getElementById("home-fila-alerta");
  if (!el) return;
  let maxMin = 0, carro = null;
  fila.forEach((r) => {
    if (!r.criado_em) return;
    const min = Math.floor((Date.now() - new Date(r.criado_em)) / 60000);
    if (min > maxMin) { maxMin = min; carro = r; }
  });
  if (carro && maxMin >= 60) {
    const quem = carro.nome_cliente || "Um carro";
    const placa = carro.placa ? ` (${carro.placa})` : "";
    document.getElementById("fila-alerta-texto").textContent =
      `${quem}${placa} está na fila há ${formatarEspera(maxMin)}. Dê uma atenção pra não deixar o cliente esperando.`;
    el.hidden = false;
  } else {
    el.hidden = true;
  }
}

// ── CLIENTE MAIS FIEL DO MÊS ──────────────────
function renderClienteFiel(doMes) {
  const cont = {};
  doMes.forEach((r) => {
    const placa = (r.placa && r.placa.trim()) ? r.placa.trim().toUpperCase() : "";
    const chave = placa || (r.nome_cliente || "—");
    if (!cont[chave]) cont[chave] = { n: 0, nome: r.nome_cliente || chave, placa };
    cont[chave].n++;
  });
  const top = Object.values(cont).sort((a, b) => b.n - a.n)[0];
  const valEl = document.getElementById("home-cliente-fiel");
  const subEl = document.getElementById("home-cliente-fiel-sub");
  if (top && top.n >= 2) {
    valEl.textContent = top.nome;
    subEl.textContent = (top.placa ? top.placa + " · " : "") + `${top.n} lavagens este mês`;
  } else {
    valEl.textContent = "—";
    subEl.textContent = "Sem cliente recorrente ainda este mês.";
  }
}

// ── META DO MÊS (salva no navegador) ──────────
function chaveMeta() { return "meta_mes_" + LAVA_JATO_ID; }
function renderMeta(fatMes) {
  const barra = document.getElementById("meta-preenchida");
  const texto = document.getElementById("meta-texto");
  if (!barra || !texto) return;
  const meta = Number(localStorage.getItem(chaveMeta()) || 0);
  if (!meta || meta <= 0) {
    barra.style.width = "0%";
    barra.classList.remove("batida");
    texto.textContent = "Defina uma meta de faturamento para acompanhar o progresso do mês.";
    return;
  }
  const pct = Math.min(100, Math.round((fatMes / meta) * 100));
  barra.style.width = pct + "%";
  const batida = fatMes >= meta;
  barra.classList.toggle("batida", batida);
  texto.textContent = `${formatarBRL(fatMes)} de ${formatarBRL(meta)} — ${pct}%` + (batida ? " 🎉 meta batida!" : "");
}
ligarClique("btn-editar-meta", () => {
  const ed = document.getElementById("meta-editor");
  document.getElementById("meta-input").value = Number(localStorage.getItem(chaveMeta()) || 0) || "";
  ed.hidden = !ed.hidden;
});
ligarClique("btn-cancelar-meta", () => { document.getElementById("meta-editor").hidden = true; });
ligarClique("btn-salvar-meta", () => {
  const v = Number(document.getElementById("meta-input").value);
  if (!v || v <= 0) localStorage.removeItem(chaveMeta());
  else localStorage.setItem(chaveMeta(), String(v));
  document.getElementById("meta-editor").hidden = true;
  renderMeta(ULTIMO_FAT_MES);
});

// ── PREVISÃO DO TEMPO (Open-Meteo, sem chave) ──
function descreverTempo(code, isDay) {
  const dia = isDay !== 0;   // undefined tratado como dia
  if (code === 0) return { ico: dia ? "☀️" : "🌙", txt: "céu limpo", chuva: false };
  if (code === 1 || code === 2) return { ico: dia ? "🌤️" : "☁️", txt: "parcialmente nublado", chuva: false };
  if (code === 3) return { ico: "☁️", txt: "nublado", chuva: false };
  if (code === 45 || code === 48) return { ico: "🌫️", txt: "névoa", chuva: false };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { ico: "🌧️", txt: "chuva", chuva: true };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { ico: "🌨️", txt: "neve", chuva: true };
  if (code >= 95) return { ico: "⛈️", txt: "tempestade", chuva: true };
  return { ico: "🌡️", txt: "tempo variável", chuva: false };
}
function _climaSet(cidade, ico, temp, cond, minmax, sens, vento, umid) {
  document.getElementById("clima-cidade").textContent = cidade;
  document.getElementById("clima-ico").textContent = ico;
  document.getElementById("clima-temp").textContent = temp;
  document.getElementById("clima-cond").textContent = cond;
  document.getElementById("clima-minmax").textContent = minmax;
  document.getElementById("clima-sensacao").textContent = sens;
  document.getElementById("clima-vento").textContent = vento;
  document.getElementById("clima-umidade").textContent = umid;
}

async function renderClima() {
  const card = document.getElementById("home-clima");
  if (!card) return;

  // card já aparece na hora, em estado "carregando" — não espera aceitar/negar
  card.hidden = false;
  card.classList.remove("chuva");
  _climaSet("Buscando previsão...", "🌡️", "--°", "", "", "--°", "--", "--");

  const coords = await coordenadasDoUsuario();   // GPS (1ª vez) ou cidade cadastrada
  if (!coords) {
    _climaSet("Clima indisponível", "📍", "--°", "Autorize a localização ou cadastre a cidade.", "", "--°", "--", "--");
    return;
  }

  try {
    const prev = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=1`
    ).then((r) => r.json());

    const c = prev.current, d = prev.daily;
    if (!c || !d) throw new Error("sem dados");

    const info = descreverTempo(c.weather_code, c.is_day);
    const tmax = Math.round(d.temperature_2m_max[0]);
    const tmin = Math.round(d.temperature_2m_min[0]);
    const prob = d.precipitation_probability_max ? d.precipitation_probability_max[0] : null;
    const choveMuito = prob != null && prob >= 50;

    _climaSet(
      coords.nome,
      info.ico,
      `${Math.round(c.temperature_2m)}°`,
      info.txt,
      `Máx ${tmax}° · Mín ${tmin}°`,
      `${Math.round(c.apparent_temperature)}°`,
      `${Math.round(c.wind_speed_10m)} km/h`,
      `${Math.round(c.relative_humidity_2m)}%`
    );
    card.classList.toggle("chuva", info.chuva || choveMuito);
  } catch (e) {
    console.log("[LavaSync] clima: erro ao buscar previsão", e);
    _climaSet("Clima indisponível", "🌡️", "--°", "Tente novamente mais tarde.", "", "--°", "--", "--");
  }
}

// Localização FIXA: usa sempre a cidade cadastrada do lava-jato (sem pedir GPS).
// Se não houver cidade, tenta coordenadas guardadas de uma autorização anterior;
// em último caso, retorna null e o card simplesmente não aparece.
const GEO_LS = "geo_coords";
function coordsCacheadas() {
  try {
    const o = JSON.parse(localStorage.getItem(GEO_LS) || "null");
    if (!o || o.lat == null) return null;
    if (Date.now() - (o.ts || 0) > 7 * 24 * 3600 * 1000) return null;  // expira em 7 dias
    return o;
  } catch (e) { return null; }
}
function salvarCoords(o) {
  if (!o || o.lat == null) return;
  try { localStorage.setItem(GEO_LS, JSON.stringify({ lat: o.lat, lon: o.lon, nome: o.nome, ts: Date.now() })); } catch (e) {}
}
// Tenta GPS (pede permissão só na 1ª vez; depois reaproveita o cache por 7 dias).
// Se negar/indisponível, usa a cidade cadastrada.
function coordenadasDoUsuario() {
  return new Promise((resolve) => {
    const cache = coordsCacheadas();
    if (cache) { resolve(cache); return; }
    if (!navigator.geolocation) { coordsPelaCidade().then(resolve); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const o = { lat: pos.coords.latitude, lon: pos.coords.longitude, nome: "Sua região" };
        salvarCoords(o);
        resolve(o);
      },
      () => { coordsPelaCidade().then(resolve); },
      { timeout: 10000, maximumAge: 30 * 60 * 1000 }
    );
  });
}

async function coordsPelaCidade() {
  try {
    const { data } = await sb.from("lava_jatos").select("cidade").eq("id", LAVA_JATO_ID).maybeSingle();
    const cidade = data && data.cidade ? String(data.cidade).trim() : null;
    if (!cidade) return null;
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt`
    ).then((r) => r.json());
    if (!geo.results || !geo.results.length) return null;
    const g = geo.results[0];
    return { lat: g.latitude, lon: g.longitude, nome: g.name };
  } catch (e) {
    return null;
  }
}

// ── RENOVAR PLANO (WhatsApp da CL Digital) ────
function abrirRenovacao() {
  const bruto = (typeof CL_DIGITAL_CONTATO !== "undefined" && CL_DIGITAL_CONTATO) ? CL_DIGITAL_CONTATO : "";
  let tel = bruto.replace(/\D/g, "");
  if (!tel) { toast("Contato da CL Digital não configurado."); return; }
  if (tel.length <= 11) tel = "55" + tel;   // adiciona o DDI do Brasil se faltar
  const msg = encodeURIComponent(`Olá, quero renovar o plano do ${NOME_LAVAJATO || "meu lava-jato"}.`);
  window.open(`https://wa.me/${tel}?text=${msg}`, "_blank");
}
ligarClique("btn-renovar", abrirRenovacao);

// atalhos rápidos da Início (à prova de elemento ausente)
function ligarClique(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", fn);
}
ligarClique("atalho-registrar", () => irParaPagina("registrar"));
ligarClique("atalho-fila", () => irParaPagina("fila"));
ligarClique("atalho-dashboard", () => irParaPagina("dashboard"));


// ── GRÁFICO: FATURAMENTO COMPARATIVO ──────────

let chartFaturamento = null;

function renderGraficoFaturamento(concluidas) {
  const hoje = inicioDia();
  const ontem = somaDias(hoje, -1);
  const semanaAtual = inicioSemana();
  const semanaPassada = somaDias(semanaAtual, -7);
  const mesAtual = inicioMes();
  const mesPassado = inicioMes(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1));

  const fatHoje = calcularMetricas(filtrarPorPeriodo(concluidas, hoje, somaDias(hoje, 1))).fat;
  const fatOntem = calcularMetricas(filtrarPorPeriodo(concluidas, ontem, hoje)).fat;
  const fatSemanaAtual = calcularMetricas(filtrarPorPeriodo(concluidas, semanaAtual, somaDias(semanaAtual, 7))).fat;
  const fatSemanaPassada = calcularMetricas(filtrarPorPeriodo(concluidas, semanaPassada, semanaAtual)).fat;
  const fatMesAtual = calcularMetricas(filtrarPorPeriodo(concluidas, mesAtual, somaDias(mesAtual, 31))).fat;
  const fatMesPassado = calcularMetricas(filtrarPorPeriodo(concluidas, mesPassado, mesAtual)).fat;

  const ctx = document.getElementById("chart-faturamento");
  if (chartFaturamento) chartFaturamento.destroy(); // evita empilhar gráficos ao voltar pra página

  chartFaturamento = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Ontem", "Hoje", "Semana passada", "Esta semana", "Mês passado", "Este mês"],
      datasets: [{
        data: [fatOntem, fatHoje, fatSemanaPassada, fatSemanaAtual, fatMesPassado, fatMesAtual],
        backgroundColor: ["#d2d2d7", getCorBrand(), "#d2d2d7", getCorBrand(), "#d2d2d7", getCorBrand()],
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => formatarBRL(ctx.parsed.y),
          },
        },
      },
      scales: { y: { beginAtZero: true, ticks: { callback: (v) => formatarBRL(v) } } },
    },
  });
}

// ── 0. LOGIN / SESSÃO ─────────────────────────

const authScreen = document.getElementById("auth-screen");
function mostrarLogin() { authScreen.hidden = false; }

async function entrarNoApp(pularChecagemSenha) {
  // Troca de senha obrigatória (primeiro acesso ou reset pela CL Digital)
  if (!pularChecagemSenha) {
    const { data: { user } } = await sb.auth.getUser();
    if (user && user.user_metadata && user.user_metadata.precisa_trocar_senha) {
      abrirTrocaSenha();   // o app só abre depois de criar a senha
      return;
    }
  }

  const { data: perfil, error } = await sb.from("perfis").select("lava_jato_id, nome, papel").maybeSingle();
  if (error || !perfil || !perfil.lava_jato_id) {
    const erro = document.getElementById("auth-erro");
    erro.textContent = "Conta sem lava-jato vinculado. Fale com o suporte.";
    erro.hidden = false;
    await sb.auth.signOut();
    return;
  }
  LAVA_JATO_ID = perfil.lava_jato_id;
  PAPEL = perfil.papel || "atendente";
  /*AS LINHAS ABAIXO DEIXAM FIXO A COR AZUL
  const { data: lj } = await sb.from("lava_jatos").select("nome").eq("id", LAVA_JATO_ID).maybeSingle();
  if (lj && lj.nome) document.getElementById("nome-lavajato").textContent = lj.nome;*/

  // AS LINHAS ABAIXO SALVAM A VARIAÇÃO DE COR ESCOLHIDA PELO CLIENTE
    const { data: lj, error: ljErr } = await sb.from("lava_jatos").select("nome, cor_principal, ativo, dias_acesso, plano").eq("id", LAVA_JATO_ID).maybeSingle();
    if (ljErr) console.warn("[LavaSync] erro ao ler lava_jato:", ljErr.message);

    if (lj && lj.ativo === false) {
      const erro = document.getElementById("auth-erro");
      erro.textContent = "Acesso bloqueado. Entre em contato com o suporte.";
      erro.hidden = false;
      await sb.auth.signOut();
      return;
    }

    if (lj && lj.nome) {
      NOME_LAVAJATO = lj.nome;
      document.getElementById("nome-lavajato").textContent = lj.nome;
    }
    DIAS_ACESSO = (lj && lj.dias_acesso != null) ? Number(lj.dias_acesso) : null;
    PLANO = (lj && lj.plano) || null;
    console.log("[LavaSync] plano:", PLANO, "| dias_acesso:", DIAS_ACESSO);
    const corSalva = (lj && lj.cor_principal) || "#0071e3";
    aplicarCor(corSalva);
    document.getElementById("cor-principal").value = corSalva;
    montarPresetsDeCor();

  const ehDono = (PAPEL === "dono");
  // Opções (gestão de serviços/preços) só aparece para o dono
  document.getElementById("nav-opcoes").hidden = !ehDono;
  // Atendente não edita valores: o campo fica travado (preenche pelo preço do serviço)
  document.getElementById("valor_servico").readOnly = !ehDono;
  document.getElementById("edit-valor").readOnly = !ehDono;

  authScreen.hidden = true;
  await carregarServicos();
  await atualizarBadge();
  await renderHome();
  verificarOnboarding();
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

// "Esqueci minha senha" → orienta a contatar a CL Digital
document.getElementById("btn-esqueci").addEventListener("click", () => {
  const aviso = document.getElementById("auth-aviso");
  const contatoEl = document.getElementById("auth-contato");
  if (typeof CL_DIGITAL_CONTATO !== "undefined" && CL_DIGITAL_CONTATO) {
    contatoEl.textContent = "Contato: " + CL_DIGITAL_CONTATO;
    contatoEl.hidden = false;
  }
  aviso.hidden = false;
});

// Popup OBRIGATÓRIO de criar senha própria
function abrirTrocaSenha() {
  const erro = document.getElementById("senha-erro");
  erro.hidden = true;
  document.getElementById("nova-senha").value = "";
  document.getElementById("conf-senha").value = "";
  document.getElementById("senha-overlay").hidden = false;
  document.getElementById("nova-senha").focus();
}

async function salvarNovaSenha() {
  const s1 = document.getElementById("nova-senha").value;
  const s2 = document.getElementById("conf-senha").value;
  const erro = document.getElementById("senha-erro");
  erro.hidden = true;
  if (s1.length < 6) { erro.textContent = "A senha precisa ter ao menos 6 caracteres."; erro.hidden = false; return; }
  if (s1 !== s2) { erro.textContent = "As senhas não conferem."; erro.hidden = false; return; }

  const btn = document.getElementById("btn-salvar-senha");
  btn.disabled = true; btn.textContent = "Salvando...";
  const { error } = await sb.auth.updateUser({ password: s1, data: { precisa_trocar_senha: false } });
  btn.disabled = false; btn.textContent = "Salvar e entrar";
  if (error) {
    erro.textContent = "Não foi possível salvar. Saia e entre de novo. (" + (error.message || "") + ")";
    erro.hidden = false;
    return;
  }
  document.getElementById("senha-overlay").hidden = true;
  toast("✔ Senha atualizada!");
  await entrarNoApp(true);   // já sem o flag → entra normalmente
}

document.getElementById("btn-salvar-senha").addEventListener("click", salvarNovaSenha);
document.getElementById("conf-senha").addEventListener("keydown", (e) => { if (e.key === "Enter") salvarNovaSenha(); });

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
    if (alvo === "home") await renderHome();
    if (alvo === "fila") await renderFila();
    if (alvo === "lavagens") await renderHistorico();
    if (alvo === "opcoes") await carregarServicos();
    if (alvo === "dashboard") {
      const concluidas = await renderDashboardCards();
      renderGraficoFaturamento(concluidas);
      await renderGraficoVolume30Dias();
      await renderGraficoPicoSemanal();
    }
    fecharSidebar();
  });
});

// ── HELPERS: janelas de dias e contagem por dia/hora ──

function ultimosNDias(n) {
  const hoje = inicioDia();
  const dias = [];
  for (let i = n - 1; i >= 0; i--) dias.push(somaDias(hoje, -i));
  return dias;
}

// conta por criado_em (data de registro), não por conclusão
function contarPorDia(lista, dias) {
  return dias.map((dia) => {
    const fimDia = somaDias(dia, 1);
    return lista.filter((r) => {
      const d = new Date(r.criado_em);
      return d >= dia && d < fimDia;
    }).length;
  });
}

// ── GRÁFICO: VOLUME DE LAVAGENS (30 dias corridos) ──

let chartVolume30 = null;

async function renderGraficoVolume30Dias() {
  const todas = await buscarLavagens(); // sem filtro de status = tudo que foi registrado
  const dias = ultimosNDias(30);
  const contagens = contarPorDia(todas, dias);
  const labels = dias.map((d) => formatarData(d));

  const ctx = document.getElementById("chart-volume-30dias");
  if (chartVolume30) chartVolume30.destroy();

  chartVolume30 = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Lavagens registradas",
        data: contagens,
        borderColor: getCorBrand(),
        backgroundColor: hexToRgba(getCorBrand(), 0.12),
        fill: true,
        tension: 0.3,
        pointRadius: 2,
      }],
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y} lavagem(ns)`,
          },
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
        x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 } },
      },
    },
  });
}

// ── GRÁFICO: HORÁRIO DE PICO (últimos 15 dias corridos) ──

let chartPicoHorario = null;

// ── HELPER: contagem por hora do dia (0-23), dado um período ──

function contarPorHoraPeriodo(lista, inicio, fim) {
  const doPeriodo = filtrarPorPeriodo(lista, inicio, fim);
  const contagem = new Array(24).fill(0);
  doPeriodo.forEach((r) => {
    const h = new Date(r.criado_em).getHours();
    contagem[h]++;
  });
  return contagem;
}

const HORAS_LABELS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0") + "h");

// opções comuns pros gráficos de linha com comparação (tooltip + hover no eixo todo)
function opcoesComparativoLinha() {
  return {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: true, position: "top", labels: { boxWidth: 12, usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} lavagem(ns)`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };
}

// ── GRÁFICO: PICO SEMANAL (semana atual x semana passada, por hora) ──

let chartPicoSemanal = null;

async function renderGraficoPicoSemanal() {
  const todas = await buscarLavagens();

  const semanaAtual = inicioSemana();
  const fimSemanaAtual = somaDias(semanaAtual, 7);
  const semanaPassada = somaDias(semanaAtual, -7);

  const dadosAtual = contarPorHoraPeriodo(todas, semanaAtual, fimSemanaAtual);
  const dadosPassada = contarPorHoraPeriodo(todas, semanaPassada, semanaAtual);

  const ctx = document.getElementById("chart-pico-semanal");
  if (chartPicoSemanal) chartPicoSemanal.destroy();

  chartPicoSemanal = new Chart(ctx, {
    type: "line",
    data: {
      labels: HORAS_LABELS,
      datasets: [
        {
          label: "Semana atual",
          data: dadosAtual,
          borderColor: getCorBrand(),
          backgroundColor: hexToRgba(getCorBrand(), 0.12),
          fill: false,
          tension: 0.3,
          pointRadius: 2,
        },
        {
          label: "Semana passada",
          data: dadosPassada,
          borderColor: "#ff9500",
          backgroundColor: "rgba(255,149,0,0.12)",
          fill: false,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    },
    options: opcoesComparativoLinha(),
  });
}

// ── GRÁFICO: PICO MENSAL (mês atual x mês anterior, por hora) ──

let chartPicoMensal = null;


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

// ── 4. SERVIÇOS (cadastrados por cada lava-jato) ──

// Preenche um <select> de serviços com os serviços do banco.
// Guarda o preço em data-preco para o auto-preenchimento do valor.
// valorSelecionado (nome) garante que um serviço antigo/removido ainda apareça.
function popularSelectServicos(selectEl, valorSelecionado) {
  if (!selectEl) return;
  const ativos = SERVICOS.filter((s) => s.ativo !== false);
  selectEl.innerHTML = ativos.length
    ? '<option value="">Selecione...</option>'
    : '<option value="">Nenhum serviço cadastrado</option>';
  ativos.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.nome;
    opt.dataset.preco = s.preco;
    opt.textContent = `${s.nome} — ${formatarBRL(s.preco)}`;
    selectEl.appendChild(opt);
  });
  if (valorSelecionado && !ativos.some((s) => s.nome === valorSelecionado)) {
    const opt = document.createElement("option");
    opt.value = valorSelecionado;
    opt.textContent = valorSelecionado + " (serviço antigo)";
    selectEl.appendChild(opt);
  }
  if (valorSelecionado) selectEl.value = valorSelecionado;
}

// Auto-preenche o valor a partir do serviço escolhido
servicoSelect.addEventListener("change", () => {
  const opt = servicoSelect.selectedOptions[0];
  if (opt && opt.dataset.preco !== undefined && opt.dataset.preco !== "") {
    document.getElementById("valor_servico").value = opt.dataset.preco;
  }
});
const editServicoSelect = document.getElementById("edit-servico");
editServicoSelect.addEventListener("change", () => {
  const opt = editServicoSelect.selectedOptions[0];
  if (opt && opt.dataset.preco !== undefined && opt.dataset.preco !== "") {
    document.getElementById("edit-valor").value = opt.dataset.preco;
  }
});

// Busca os serviços do lava-jato e atualiza selects + tela Opções
async function carregarServicos() {
  const { data, error } = await sb.from("servicos").select("*").order("nome");
  SERVICOS = error ? [] : (data || []);
  popularSelectServicos(servicoSelect, servicoSelect.value);
  popularSelectServicos(editServicoSelect, null);
  renderServicos();
}

// Lista os serviços na tela Opções
function renderServicos() {
  const container = document.getElementById("servicos-lista");
  if (!container) return;
  if (SERVICOS.length === 0) {
    container.innerHTML = `<div class="card"><div class="empty-state"><span class="empty-icon">🧼</span><h3>Nenhum serviço cadastrado</h3><p>Adicione acima os serviços que o seu lava-jato oferece e o preço de cada um</p></div></div>`;
    return;
  }
  container.innerHTML = SERVICOS.map((s) => `
    <div class="servico-row">
      <div class="servico-info">
        <span class="servico-nome">${s.nome}</span>
        <span class="servico-preco">${formatarBRL(s.preco)}</span>
      </div>
      <div class="servico-acoes">
        <button class="btn-action btn-editar" onclick="editarServico('${s.id}')">✏️ Editar</button>
        <button class="btn-action btn-remover" onclick="removerServico('${s.id}')">Remover</button>
      </div>
    </div>`).join("");
}

// Adicionar OU salvar edição de serviço (só o dono)
async function salvarServico() {
  if (PAPEL !== "dono") { toast("Apenas o dono pode alterar os serviços."); return; }
  const nome = document.getElementById("novo-servico-nome").value.trim();
  const preco = Number(document.getElementById("novo-servico-preco").value) || 0;
  if (!nome) { toast("Informe o nome do serviço."); return; }

  const editando = !!editandoServicoId;
  let error;
  if (editando) {
    ({ error } = await sb.from("servicos").update({ nome, preco }).eq("id", editandoServicoId));
  } else {
    ({ error } = await sb.from("servicos").insert({ lava_jato_id: LAVA_JATO_ID, nome, preco }));
  }
  if (error) { console.error(error); toast("❌ Erro ao salvar serviço."); return; }

  cancelarEdicaoServico();
  toast(editando ? "✔ Serviço atualizado." : "✔ Serviço adicionado.");
  await carregarServicos();
}

function editarServico(id) {
  if (PAPEL !== "dono") return;
  const s = SERVICOS.find((x) => x.id === id);
  if (!s) return;
  editandoServicoId = id;
  document.getElementById("novo-servico-nome").value = s.nome;
  document.getElementById("novo-servico-preco").value = s.preco;
  document.getElementById("btn-add-servico").textContent = "✔ Salvar alteração";
  document.getElementById("btn-cancelar-servico").hidden = false;
  document.getElementById("novo-servico-nome").focus();
}

function cancelarEdicaoServico() {
  editandoServicoId = null;
  document.getElementById("novo-servico-nome").value = "";
  document.getElementById("novo-servico-preco").value = "";
  document.getElementById("btn-add-servico").textContent = "➕ Adicionar";
  document.getElementById("btn-cancelar-servico").hidden = true;
}

async function removerServico(id) {
  if (PAPEL !== "dono") return;
  if (!confirm("Remover este serviço da lista?")) return;
  const { error } = await sb.from("servicos").delete().eq("id", id);
  if (error) { console.error(error); toast("❌ Erro ao remover."); return; }
  if (editandoServicoId === id) cancelarEdicaoServico();
  toast("Serviço removido.");
  await carregarServicos();
}

document.getElementById("btn-add-servico").addEventListener("click", salvarServico);
document.getElementById("btn-cancelar-servico").addEventListener("click", cancelarEdicaoServico);

// ── ONBOARDING (primeiro acesso do dono) ──────

function verificarOnboarding() {
  if (PAPEL !== "dono") return;                 // só o dono cadastra
  if (SERVICOS.length > 0) return;              // já tem serviços → não precisa
  if (localStorage.getItem("onboarding_pulado_" + LAVA_JATO_ID)) return; // já pulou
  document.getElementById("onboarding-overlay").hidden = false;
}

document.getElementById("onb-adicionar").addEventListener("click", () => {
  document.getElementById("onboarding-overlay").hidden = true;
  irParaPagina("opcoes");
});
document.getElementById("onb-pular").addEventListener("click", () => {
  localStorage.setItem("onboarding_pulado_" + LAVA_JATO_ID, "1");
  document.getElementById("onboarding-overlay").hidden = true;
});

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

  // data da última visita: usa data_entrada; se faltar, cai pro criado_em
  let dataUltima = "—";
  const bruta = ultimo.data_entrada || ultimo.criado_em;
  if (bruta) {
    // data_entrada vem como "YYYY-MM-DD" (sem fuso); trata pra não virar o dia anterior
    const d = /^\d{4}-\d{2}-\d{2}$/.test(bruta)
      ? new Date(bruta + "T00:00:00")
      : new Date(bruta);
    if (!isNaN(d)) dataUltima = d.toLocaleDateString("pt-BR");
  }

  placaHint.innerHTML = `🔁 <b>Cliente recorrente</b> — já veio ${data.length} vez(es). Última: ${dataUltima}.`;
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
  tocarSom("registrar");
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
  tocarSom("concluir");
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
  popularSelectServicos(editServicoSelect, r.servico || "");
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