/* REF-Genius · STEAM — biblioteca pessoal de jogos
   ------------------------------------------------------------------
   • Tudo é local: os jogos ficam no localStorage (chave ref-genius-steam-games).
     Na 1ª abertura a lista começa com os exemplos de data/games.js.
   • Status: wishlist (quero jogar) · playing · completed (jogado) · platinum (100%).
     Um jogo com todas as conquistas (desbloqueadas === total, total > 0) conta como 100% automaticamente.
   • Futura integração com a Steam Web API: veja o bloco "Preparado para a Steam" no fim do arquivo. */

const STORAGE_KEY = "ref-genius-steam-games";
const PROFILE_KEY = "refgenius-profile";     // mesmo perfil da home (não existe outro sistema)
const PAGE_SIZE = 60;                        // cards renderizados por vez (as capas ainda carregam em lazy loading)
const NAME_MAX = 80;

const STATUS = {
  wishlist:  { label: "Quero jogar", icon: "○" },
  playing:   { label: "Jogando",     icon: "◐" },
  completed: { label: "Jogado",      icon: "✓" },
  platinum:  { label: "100%",        icon: "🏆" }
};
const FILTERS = [["all", "Todos"], ["wishlist", "Quero jogar"], ["playing", "Jogando"], ["played", "Jogados"], ["platinum", "🏆 100% completos"]];

const $ = (sel, root = document) => root.querySelector(sel);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const plain = s => String(s).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const fmtNum = n => Number(n).toLocaleString("pt-BR", { maximumFractionDigits: 1 });

/* ---------- Perfil: só LÊ o avatar salvo na home ---------- */
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
  const el = $("#stAvatar .av");
  if (el) paintAvatar(el, p && p.image ? p : null);
})();

/* ---------- Modelo do jogo ---------- */
const steamCoverUrl = appId => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;
const safeUrl = u => /^https?:\/\//i.test(u) || /^data:image\//i.test(u) ? u : "";

function normalize(g) {
  const num = v => { v = Number(v); return Number.isFinite(v) && v >= 0 ? v : 0; };
  const total = Math.floor(num(g.achievementsTotal));
  let unlocked = Math.floor(num(g.achievementsUnlocked));
  if (total && unlocked > total) unlocked = total;
  let rating = g.rating === null || g.rating === undefined || g.rating === "" ? null : Number(g.rating);
  rating = Number.isFinite(rating) ? Math.min(10, Math.max(0, rating)) : null;
  return {
    id: g.id ?? uid(),
    steamAppId: Number(g.steamAppId) > 0 ? Math.floor(Number(g.steamAppId)) : null,
    name: String(g.name || "").trim().slice(0, NAME_MAX) || "Sem nome",
    cover: String(g.cover || "").trim(),
    status: STATUS[g.status] ? g.status : "wishlist",
    playtime: num(g.playtime ?? g.hours),            // aceita "hours" (nome antigo) e "playtime"
    achievementsUnlocked: unlocked,
    achievementsTotal: total,
    rating,
    lastPlayed: g.lastPlayed || null,
    source: g.source || "manual"
  };
}

const pct = g => !g.achievementsTotal ? 0 : g.achievementsUnlocked >= g.achievementsTotal ? 100 : Math.floor(g.achievementsUnlocked / g.achievementsTotal * 100);
const isPerfect = g => g.status === "platinum" || (g.achievementsTotal > 0 && g.achievementsUnlocked === g.achievementsTotal);
const statusOf = g => isPerfect(g) ? "platinum" : g.status;
const isPlayed = g => ["completed", "platinum"].includes(statusOf(g));
const coverOf = g => safeUrl(g.cover) || (g.steamAppId ? steamCoverUrl(g.steamAppId) : "");

/* ---------- Armazenamento (localStorage) ---------- */
let lib = load();
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const a = JSON.parse(raw); if (Array.isArray(a)) return a.map(normalize); }
  } catch {}
  const seed = (typeof games !== "undefined" ? games : []).map(normalize);   // exemplos de data/games.js
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch {}
  return seed;
}
const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lib)); } catch {} };

/* ---------- Estado da tela ---------- */
const S = { filter: "all", q: "", sort: "name", limit: PAGE_SIZE, editing: null };

const byName = (a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
const SORTS = {
  name: byName,
  progress: (a, b) => pct(b) - pct(a) || byName(a, b),
  achievements: (a, b) => b.achievementsUnlocked - a.achievementsUnlocked || byName(a, b),
  lastPlayed: (a, b) => (b.lastPlayed || "").localeCompare(a.lastPlayed || "") || byName(a, b)
};
const matches = (g, f) => f === "all" || (f === "played" ? isPlayed(g) : statusOf(g) === f);

function visible() {
  const q = plain(S.q.trim());
  return lib.filter(g => matches(g, S.filter) && (!q || plain(g.name).includes(q))).sort(SORTS[S.sort]);
}

/* ---------- Render ---------- */
function renderStats() {
  const n = f => lib.filter(g => matches(g, f)).length;
  $("#stats").innerHTML = [
    ["Total", lib.length, ""], ["Jogados", n("played"), ""], ["Jogando", n("playing"), ""], ["100%", n("platinum"), "gold"]
  ].map(([l, v, c]) => `<div class="st-stat ${c}"><b>${v}</b><span>${l}</span></div>`).join("");
}

function renderTabs() {
  $("#tabs").innerHTML = FILTERS.map(([f, label]) =>
    `<button class="st-tab${S.filter === f ? " on" : ""}" type="button" role="tab" aria-selected="${S.filter === f}" data-f="${f}">${esc(label)}<em>${lib.filter(g => matches(g, f)).length}</em></button>`).join("");
}

const initials = name => String(name).split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
const placeholder = name => `<div class="st-ph" aria-hidden="true">${esc(initials(name))}</div>`;

function cardHTML(g) {
  const st = statusOf(g), s = STATUS[st], p = pct(g), has = g.achievementsTotal > 0, cover = coverOf(g);
  const img = cover ? `<img loading="lazy" decoding="async" alt="" src="${esc(cover)}" data-name="${esc(g.name)}">` : placeholder(g.name);
  return `<article class="st-card${st === "platinum" ? " perfect" : ""}" data-id="${esc(g.id)}" tabindex="0" role="button" aria-label="Abrir ${esc(g.name)}">
    <div class="st-cover">${img}</div>
    <div class="st-body">
      <h3 class="st-name">${esc(g.name)}</h3>
      <div class="st-status s-${st}">${s.icon} ${s.label}</div>
      <div class="st-meta"><span>${has ? `🏆 ${g.achievementsUnlocked}/${g.achievementsTotal}` : "Sem conquistas"}</span>${g.playtime ? `<span>${fmtNum(g.playtime)}h</span>` : ""}</div>
      ${has ? `<div class="st-prog"><div class="st-bar${p === 100 ? " full" : ""}"><i style="width:${p}%"></i></div><b>${p}%</b></div>` : ""}
    </div>
  </article>`;
}

function renderGrid() {
  const list = visible(), shown = list.slice(0, S.limit);
  $("#grid").innerHTML = shown.length ? shown.map(cardHTML).join("")
    : `<div class="st-empty">${lib.length ? "Nenhum jogo encontrado com esse filtro." : "Sua biblioteca está vazia. Clique em “+ Adicionar jogo” para começar."}</div>`;
  const rest = list.length - shown.length;
  $("#more").innerHTML = rest > 0 ? `<button class="st-btn st-ghost" type="button" id="moreBtn">Mostrar mais (${rest})</button>` : "";
}

const render = () => { renderStats(); renderTabs(); renderGrid(); };

/* capa que falhou → placeholder com as iniciais (o evento "error" não borbulha: usa captura) */
document.addEventListener("error", e => {
  const img = e.target;
  if (img.tagName !== "IMG" || !img.closest(".st-cover")) return;
  const ph = document.createElement("div");
  ph.className = "st-ph"; ph.setAttribute("aria-hidden", "true"); ph.textContent = initials(img.dataset.name);
  img.replaceWith(ph);
}, true);

/* ---------- Eventos da página ---------- */
let t;
$("#q").oninput = e => { clearTimeout(t); t = setTimeout(() => { S.q = e.target.value; S.limit = PAGE_SIZE; renderGrid(); }, 120); };
$("#sort").onchange = e => { S.sort = e.target.value; S.limit = PAGE_SIZE; renderGrid(); };
$("#tabs").onclick = e => { const b = e.target.closest("[data-f]"); if (b) { S.filter = b.dataset.f; S.limit = PAGE_SIZE; render(); } };
$("#more").onclick = e => { if (e.target.closest("#moreBtn")) { S.limit += PAGE_SIZE; renderGrid(); } };
$("#grid").onclick = e => { const c = e.target.closest(".st-card"); if (c) openModal(c.dataset.id); };
$("#grid").onkeydown = e => { if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("st-card")) { e.preventDefault(); openModal(e.target.dataset.id); } };
$("#addBtn").onclick = () => openModal(null);

/* ---------- Modal: adicionar / editar ---------- */
const modal = $("#modal"), form = $("#form");
const showErr = msg => { const el = $("#fErr"); el.textContent = msg || ""; el.hidden = !msg; };

function updatePreview() {
  const un = Math.max(0, Math.floor(Number($("#fUnlocked").value) || 0)), tot = Math.max(0, Math.floor(Number($("#fTotal").value) || 0));
  const p = tot ? Math.min(100, Math.floor(un / tot * 100)) : 0;
  $("#mBar").style.width = p + "%";
  $("#mBar").parentElement.classList.toggle("full", tot > 0 && un >= tot);
  $("#mPct").textContent = p + "%";
}
form.addEventListener("input", e => { if (e.target.id === "fUnlocked" || e.target.id === "fTotal") updatePreview(); });

function openModal(id) {
  const g = id === null ? null : lib.find(x => String(x.id) === String(id));
  S.editing = g ? g.id : null;
  form.reset(); showErr("");
  $("#mTitle").textContent = g ? "EDITAR JOGO" : "ADICIONAR JOGO";
  $("#delBtn").hidden = !g;
  if (g) {
    $("#fName").value = g.name; $("#fCover").value = g.cover; $("#fApp").value = g.steamAppId || "";
    $("#fStatus").value = g.status; $("#fUnlocked").value = g.achievementsUnlocked; $("#fTotal").value = g.achievementsTotal;
    $("#fHours").value = g.playtime || ""; $("#fRating").value = g.rating ?? ""; $("#fDate").value = g.lastPlayed || "";
  }
  updatePreview();
  modal.hidden = false;
  $("#fName").focus();
}
const closeModal = () => { modal.hidden = true; S.editing = null; };

$("#closeBtn").onclick = $("#cancelBtn").onclick = closeModal;
modal.addEventListener("mousedown", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

$("#delBtn").onclick = () => {
  const g = lib.find(x => x.id === S.editing);
  if (!g || !confirm(`Excluir “${g.name}” da biblioteca?`)) return;
  lib = lib.filter(x => x.id !== g.id);
  save(); closeModal(); render();
};

form.onsubmit = e => {
  e.preventDefault();
  const name = $("#fName").value.trim(), cover = $("#fCover").value.trim();
  const unlocked = Math.floor(Number($("#fUnlocked").value) || 0), total = Math.floor(Number($("#fTotal").value) || 0);
  if (!name) return showErr("Informe o nome do jogo.");
  if (cover && !safeUrl(cover)) return showErr("A capa precisa ser um link que comece com http:// ou https://.");
  if (unlocked > total) return showErr(total ? "As conquistas desbloqueadas não podem passar do total." : "Informe o total de conquistas.");

  const old = S.editing === null ? null : lib.find(x => x.id === S.editing);
  const status = $("#fStatus").value, playtime = Number($("#fHours").value) || 0;
  let lastPlayed = $("#fDate").value || null;
  // se o progresso mudou e a data não foi mexida, "último jogado" vira hoje
  const progressed = !old ? status !== "wishlist" : (old.status !== status || old.playtime !== playtime || old.achievementsUnlocked !== unlocked);
  if (progressed && status !== "wishlist" && (!old || lastPlayed === (old.lastPlayed || null))) lastPlayed = today();

  const game = normalize({
    ...(old || {}), id: old ? old.id : uid(), name, cover, status, playtime, lastPlayed,
    steamAppId: $("#fApp").value, achievementsUnlocked: unlocked, achievementsTotal: total, rating: $("#fRating").value
  });
  lib = old ? lib.map(x => x.id === old.id ? game : x) : [...lib, game];
  save(); closeModal(); render();
};

render();

/* =====================================================================
   Preparado para a Steam (ainda não ativo)
   ---------------------------------------------------------------------
   Cada jogo já guarda steamAppId, cover, playtime (horas) e achievementsUnlocked/Total.
   Para importar a biblioteca depois, converta a resposta da Steam Web API para a lista abaixo e chame
   RefSteam.merge(lista): jogos novos entram; os que já existem (mesmo steamAppId) só atualizam
   horas e conquistas — status, nota e capa que você escolheu são preservados.
     • IPlayerService/GetOwnedGames → appid, name, playtime_forever (minutos ÷ 60 = playtime)
     • ISteamUserStats/GetPlayerAchievements → conta as conquistas com achieved = 1
   A chave da API não pode ficar no navegador: use um pequeno proxy/servidor para chamar a Steam.
   ===================================================================== */
window.RefSteam = {
  coverUrl: steamCoverUrl,
  merge(imported) {
    imported.forEach(raw => {
      const g = normalize({ ...raw, source: "steam" });
      const i = g.steamAppId ? lib.findIndex(x => x.steamAppId === g.steamAppId) : -1;
      if (i < 0) { lib.push({ ...g, status: raw.status || "wishlist" }); return; }
      const cur = lib[i];
      lib[i] = { ...cur, playtime: g.playtime, achievementsUnlocked: g.achievementsUnlocked, achievementsTotal: g.achievementsTotal,
        cover: cur.cover || g.cover, source: "steam" };
    });
    save(); render();
  }
};
