/* REF-Genius · TCG
   ------------------------------------------------------------------
   • O menu (tcg/index.html) é estático: nenhuma requisição.
   • Cada página de TCG mostra as COMBINAÇÕES DE CORES do jogo; em cada combinação você
     cadastra os nomes dos seus baralhos. Tudo é local (localStorage) — nenhuma API, nenhuma carta.
   • loadTCG(id) só roda dentro da página do próprio TCG.

   Para ajustar um jogo, edite TCGS: colors = [chave, nome, cor], min/max = tamanho da combinação. */

const PROFILE_KEY = "refgenius-profile";     // mesmo perfil da home (não existe outro sistema)
const DECKS_KEY = "refgenius-tcg-decks";     // { [tcg]: { [combinação]: [{ id, name }] } }
const NAME_MAX = 40;

const TCGS = {
  magic: { name: "MAGIC", noun: "cores", min: 0, max: 5, dots: ["#f8f6d8", "#0e68ab", "#1c1a1a", "#d3202a", "#00733e"],
    colors: [["W", "Branco", "#f8f6d8"], ["U", "Azul", "#0e68ab"], ["B", "Preto", "#1c1a1a"], ["R", "Vermelho", "#d3202a"], ["G", "Verde", "#00733e"]],
    // nomes tradicionais das combinações (chave = letras na ordem W U B R G)
    names: {
      WU: "Azorius", UB: "Dimir", BR: "Rakdos", RG: "Gruul", WG: "Selesnya", WB: "Orzhov", UR: "Izzet", BG: "Golgari", WR: "Boros", UG: "Simic",
      WUG: "Bant", WUB: "Esper", UBR: "Grixis", BRG: "Jund", WRG: "Naya", WBG: "Abzan", WUR: "Jeskai", UBG: "Sultai", WBR: "Mardu", URG: "Temur",
      WUBR: "Yore-Tiller", UBRG: "Glint-Eye", WBRG: "Dune-Brood", WURG: "Ink-Treader", WUBG: "Witch-Maw", WUBRG: "Cinco cores"
    } },
  ptcg: { name: "POKÉMON TCG", noun: "tipos", min: 1, max: 2, dots: ["#ffcb05", "#3b4cca", "#ef4444"],
    colors: [["G", "Planta", "#4caf50"], ["R", "Fogo", "#ef5a38"], ["W", "Água", "#3b9be8"], ["L", "Elétrico", "#f7d02c"], ["P", "Psíquico", "#b05cc7"], ["F", "Lutador", "#c1682c"], ["D", "Escuridão", "#2b2a35"], ["M", "Metal", "#9aa3ad"]] },
  lorcana: { name: "LORCANA", noun: "tintas", min: 1, max: 2, dots: ["#2f5bff", "#d4af37", "#8b5cf6"],
    colors: [["A", "Âmbar", "#f5b800"], ["Z", "Ametista", "#8b5cf6"], ["E", "Esmeralda", "#16a34a"], ["R", "Rubi", "#dc2626"], ["S", "Safira", "#2563eb"], ["T", "Aço", "#94a3b8"]] },
  onepiece: { name: "ONE PIECE", noun: "cores", min: 1, max: 2, dots: ["#e2323a", "#111111", "#f5c542"],
    colors: [["R", "Vermelho", "#e2323a"], ["G", "Verde", "#16a34a"], ["B", "Azul", "#2563eb"], ["P", "Roxo", "#8b5cf6"], ["K", "Preto", "#1f2937"], ["Y", "Amarelo", "#f5c542"]] },
  riftbound: { name: "RIFTBOUND", noun: "domínios", min: 2, max: 2, dots: ["#2f7bff", "#8b5cf6", "#ef4444"],   // deck = 2 domínios (Lenda)
    colors: [["F", "Fury", "#ef4444"], ["C", "Calm", "#22c55e"], ["M", "Mind", "#3b82f6"], ["B", "Body", "#f97316"], ["H", "Chaos", "#a855f7"], ["O", "Order", "#eab308"]] }
};

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (sel, root = document) => root.querySelector(sel);

/* ---------- Perfil: só LÊ o avatar salvo na home (refgenius-profile) ---------- */
function paintAvatar(el, p) {
  el.innerHTML = "";
  el.classList.toggle("has", !!p);
  if (p) el.dataset.game = p.game; else delete el.dataset.game;
  if (!p) { el.textContent = "◉"; return; }
  const img = new Image();
  img.alt = p.character;
  img.onerror = () => { img.remove(); el.textContent = (p.character || "?")[0]; };
  img.src = p.image;
  el.appendChild(img);
}
(function initAvatar() {
  let p = null;
  try { p = JSON.parse(localStorage.getItem(PROFILE_KEY)); } catch {}
  const el = $("#tcgAvatar .av");
  if (el) paintAvatar(el, p && p.image ? p : null);
})();

/* ---------- Combinações de cores ---------- */
function buildCombos(cfg) {
  const n = cfg.colors.length, out = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const idx = []; for (let i = 0; i < n; i++) if (mask & (1 << i)) idx.push(i);
    if (idx.length < cfg.min || idx.length > cfg.max) continue;
    const cols = idx.map(i => cfg.colors[i]);
    const key = cols.map(c => c[0]).join("") || "_";
    const size = cols.length;
    let title, sub;
    if (cfg.names) {                                  // Magic: nomes tradicionais
      title = size === 0 ? "Incolor" : size === 1 ? cols[0][1] : cfg.names[key] || cols.map(c => c[1]).join(" + ");
      sub = size === 0 ? "Sem cor" : size === 1 ? "Mono" : cols.map(c => c[1]).join(" · ");
    } else {
      title = cols.map(c => c[1]).join(" + ");
      sub = size === 1 ? "Mono" : `${size} ${cfg.noun}`;
    }
    out.push({ key, size, cols, title, sub });
  }
  return out.sort((a, b) => a.size - b.size);         // mantém a ordem das cores dentro de cada grupo
}
const groupLabel = (cfg, size) => size === 0 ? "Incolor" : size === 1 ? "Mono" : `${size} ${cfg.noun}`;

/* ---------- Baralhos salvos (local) ---------- */
let ALL = {};
try { ALL = JSON.parse(localStorage.getItem(DECKS_KEY)) || {}; } catch {}
const saveAll = () => { try { localStorage.setItem(DECKS_KEY, JSON.stringify(ALL)); } catch {} };
const decksOf = (id, key) => ((ALL[id] || {})[key]) || [];
const totalDecks = id => Object.values(ALL[id] || {}).reduce((n, l) => n + l.length, 0);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ---------- Página do TCG ---------- */
let S = null;

function loadTCG(id) {
  const cfg = TCGS[id], app = $("#app");
  if (!cfg || !app) return;
  S = { id, cfg, combos: buildCombos(cfg), group: "all", adding: null, editing: null };
  const groups = [...new Set(S.combos.map(c => c.size))];
  app.innerHTML = `
    <div class="tcg-head"><h1>${esc(cfg.name)}</h1><span class="tcg-dots" aria-hidden="true">${cfg.dots.map(c => `<i style="--d:${c}"></i>`).join("")}</span></div>
    <div class="tcg-stripe"></div>
    <p class="tcg-intro">Escolha uma combinação de ${cfg.noun} e dê nome aos seus baralhos. <b id="deckTotal"></b></p>
    <div class="tcg-tabs" id="tabs">
      <button class="tcg-tab" data-g="all">Todas<em>${S.combos.length}</em></button>
      ${groups.map(g => `<button class="tcg-tab" data-g="${g}">${esc(groupLabel(cfg, g))}<em>${S.combos.filter(c => c.size === g).length}</em></button>`).join("")}
      <button class="tcg-tab" data-g="mine">Meus baralhos<em id="mineCount"></em></button>
    </div>
    <div class="combo-grid" id="combos"></div>`;
  $("#tabs").onclick = e => { const b = e.target.closest("[data-g]"); if (b) { S.group = b.dataset.g; S.adding = S.editing = null; renderGrid(); } };
  $("#combos").onclick = onGridClick;
  $("#combos").addEventListener("submit", onSubmit);
  $("#combos").addEventListener("keydown", e => { if (e.key === "Escape" && (S.adding || S.editing)) { S.adding = S.editing = null; renderGrid(); } });
  renderGrid();
}

function visible() {
  const { combos, group, id } = S;
  return combos.filter(c => group === "all" || (group === "mine" ? decksOf(id, c.key).length > 0 : c.size === +group));
}

function renderGrid() {
  const { id } = S;
  document.querySelectorAll("#tabs .tcg-tab").forEach(b => b.classList.toggle("on", b.dataset.g === S.group));
  const n = totalDecks(id);
  $("#deckTotal").textContent = n ? `${n} baralho${n > 1 ? "s" : ""} salvo${n > 1 ? "s" : ""}.` : "";
  $("#mineCount").textContent = n;
  const list = visible();
  $("#combos").innerHTML = list.length ? list.map(comboHTML).join("") : `<div class="combo-empty">Nenhum baralho ainda. Escolha uma combinação e clique em “+ Baralho”.</div>`;
  const focus = $("#combos input"); if (focus) { focus.focus(); focus.setSelectionRange(focus.value.length, focus.value.length); }
}

function comboHTML(c) {
  const decks = decksOf(S.id, c.key);
  const grad = c.cols.length ? `linear-gradient(90deg,${c.cols.map((x, i, a) => `${x[2]} ${i * 100 / a.length}% ${(i + 1) * 100 / a.length}%`).join(",")})` : "linear-gradient(90deg,#9ca3af,#9ca3af)";
  const pips = c.cols.length ? c.cols.map(x => `<i class="pip" title="${esc(x[1])}" style="--d:${x[2]}"></i>`).join("") : `<i class="pip" style="--d:#9ca3af"></i>`;
  const rows = decks.map(d => S.editing === d.id
    ? `<li class="deck"><form class="edit-form" data-k="${c.key}" data-id="${d.id}"><input name="n" maxlength="${NAME_MAX}" value="${esc(d.name)}" aria-label="Nome do baralho"><button class="ib" aria-label="Salvar">✓</button></form></li>`
    : `<li class="deck"><span class="nm">${esc(d.name)}</span><button class="ib" data-edit="${d.id}" title="Renomear" aria-label="Renomear">✎</button><button class="ib" data-del="${d.id}" data-k="${c.key}" title="Excluir" aria-label="Excluir">✕</button></li>`).join("");
  const add = S.adding === c.key
    ? `<form class="add-form" data-k="${c.key}"><input name="n" maxlength="${NAME_MAX}" placeholder="Nome do baralho" autocomplete="off" aria-label="Nome do baralho"><button class="ib ok" aria-label="Adicionar">＋</button></form>`
    : `<button class="add-btn" data-add="${c.key}">+ Baralho</button>`;
  return `<article class="combo${decks.length ? " has" : ""}" data-key="${c.key}" style="--grad:${grad}">
    <div class="top"><div><h3>${esc(c.title)}</h3><span class="sub">${esc(c.sub)}</span></div>${decks.length ? `<span class="badge">${decks.length}</span>` : ""}</div>
    <div class="pips">${pips}</div>
    ${decks.length ? `<ul class="decks">${rows}</ul>` : ""}${add}</article>`;
}

function onGridClick(e) {
  const t = e.target.closest("[data-add],[data-edit],[data-del]");
  if (!t) return;
  if (t.dataset.add) { S.adding = t.dataset.add; S.editing = null; }
  else if (t.dataset.edit) { S.editing = t.dataset.edit; S.adding = null; }
  else if (t.dataset.del) {
    const k = t.dataset.k, list = decksOf(S.id, k).filter(d => d.id !== t.dataset.del);
    ALL[S.id] = ALL[S.id] || {};
    if (list.length) ALL[S.id][k] = list; else delete ALL[S.id][k];
    saveAll();
  }
  renderGrid();
}

function onSubmit(e) {
  e.preventDefault();
  const f = e.target, k = f.dataset.k, name = f.n.value.trim().slice(0, NAME_MAX);
  if (f.classList.contains("add-form")) {
    if (name) {
      ALL[S.id] = ALL[S.id] || {};
      (ALL[S.id][k] = ALL[S.id][k] || []).push({ id: uid(), name });
      saveAll();
    }
    S.adding = name ? k : null;                       // continua aberto para adicionar outro; vazio fecha
  } else {
    const d = decksOf(S.id, k).find(x => x.id === f.dataset.id);
    if (d && name) { d.name = name; saveAll(); }
    S.editing = null;
  }
  renderGrid();
}

/* ---------- Entrada: só páginas de um TCG montam algo ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const id = document.body.dataset.tcg;
  if (id) loadTCG(id);
});
