/* REF-Genius · ANIMES — minha lista
   ------------------------------------------------------------------
   • Tudo é local: os animes ficam no localStorage (chave ref-genius-animes).
     Na 1ª abertura a lista começa com os exemplos de SEED (sem capas: cole o link da capa ao editar).
   • Status: planned (quero assistir) · watching · completed · paused · dropped.
   • totalEpisodes: null = sem total conhecido (em lançamento).
   • Futura API: veja o bloco "Preparado para uma API" no fim do arquivo. */

const STORAGE_KEY = "ref-genius-animes";
const PROFILE_KEY = "refgenius-profile";     // mesmo perfil da home (não existe outro sistema)
const PAGE_SIZE = 60;                        // cards renderizados por vez (as capas ainda carregam em lazy loading)
const NAME_MAX = 120;

const STATUS = {
  planned:   { label: "Quero assistir", icon: "○" },
  watching:  { label: "Assistindo",     icon: "◐" },
  completed: { label: "Assistido",      icon: "✓" },
  paused:    { label: "Pausado",        icon: "⏸" },
  dropped:   { label: "Dropped",        icon: "❌" }
};
const FILTERS = [["all", "Todos"], ["planned", "Quero assistir"], ["watching", "Assistindo"], ["completed", "Assistidos"], ["paused", "Pausados"], ["dropped", "Dropped"]];

/* Exemplos da 1ª abertura (notas e datas são ilustrativas — edite ou apague). */
const SEED = [
  { id: 1, title: "Jujutsu Kaisen", status: "watching", currentEpisode: 18, totalEpisodes: 24, seasons: 2, rating: 9.5, lastWatched: "2026-09-29" },
  { id: 2, title: "Frieren", status: "watching", currentEpisode: 21, totalEpisodes: 28, seasons: 1, rating: 9, lastWatched: "2026-09-30" },
  { id: 3, title: "One Piece", status: "watching", currentEpisode: 1132, totalEpisodes: null, seasons: 1, rating: 9, lastWatched: "2026-10-01" },
  { id: 4, title: "Naruto", status: "completed", currentEpisode: 220, totalEpisodes: 220, seasons: 1, rating: 8.5, lastWatched: "2026-03-12" },
  { id: 5, title: "Naruto Shippuden", status: "completed", currentEpisode: 500, totalEpisodes: 500, seasons: 1, rating: 9, lastWatched: "2026-06-20" },
  { id: 6, title: "Vinland Saga", status: "paused", currentEpisode: 12, totalEpisodes: 24, seasons: 2, rating: 9, lastWatched: "2026-07-08" },
  { id: 7, title: "Death Note", status: "planned", currentEpisode: 0, totalEpisodes: 37, seasons: 1, rating: null, lastWatched: null },
  { id: 8, title: "Boruto", status: "dropped", currentEpisode: 30, totalEpisodes: 293, seasons: 1, rating: 5, lastWatched: "2025-11-02" }
];

const $ = (sel, root = document) => root.querySelector(sel);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const plain = s => String(s).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const fmtNum = n => Number(n).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const safeUrl = u => /^https?:\/\//i.test(u) || /^data:image\//i.test(u) ? u : "";
const initials = name => String(name).split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";

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

/* ---------- Modelo do anime ---------- */
const AIRING = ["airing", "finished", "upcoming"];

function normalize(a) {
  const int = v => { v = Number(v); return Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0; };
  const hasTotal = a.totalEpisodes !== null && a.totalEpisodes !== undefined && a.totalEpisodes !== "";
  const total = hasTotal ? (int(a.totalEpisodes) || null) : null;          // null = total desconhecido
  let current = int(a.currentEpisode);
  if (total && current > total) current = total;
  let rating = a.rating === null || a.rating === undefined || a.rating === "" ? null : Number(a.rating);
  rating = Number.isFinite(rating) ? Math.min(10, Math.max(0, rating)) : null;
  const year = int(a.year);
  return {
    id: a.id ?? uid(),
    title: String(a.title ?? a.name ?? "").trim().slice(0, NAME_MAX) || "Sem título",
    cover: String(a.cover || "").trim(),
    status: STATUS[a.status] ? a.status : "planned",
    currentEpisode: current,
    totalEpisodes: total,
    seasons: int(a.seasons) || 1,
    rating,
    lastWatched: a.lastWatched || null,
    // campos para a futura API (ficam vazios no cadastro manual)
    synopsis: String(a.synopsis || ""),
    genres: Array.isArray(a.genres) ? a.genres.map(String) : [],
    year: year || null,
    airingStatus: AIRING.includes(a.airingStatus) ? a.airingStatus : null,
    externalId: a.externalId || null,                                       // ex.: { provider: "mal", id: 40748 }
    source: a.source || "manual"
  };
}

const pct = a => !a.totalEpisodes ? 0 : Math.min(100, Math.floor(a.currentEpisode / a.totalEpisodes * 100));
const coverOf = a => safeUrl(a.cover);

/* ---------- Armazenamento (localStorage) ---------- */
let lib = load();
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const arr = JSON.parse(raw); if (Array.isArray(arr)) return arr.map(normalize); }
  } catch {}
  const seed = SEED.map(a => normalize({ ...a, source: "manual" }));
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch {}
  return seed;
}
const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lib)); } catch {} };

/* ---------- Estado da tela ---------- */
const S = { filter: "all", q: "", sort: "name", limit: PAGE_SIZE, editing: null };

const byName = (a, b) => a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" });
const SORTS = {
  name: byName,
  progress: (a, b) => pct(b) - pct(a) || byName(a, b),
  rating: (a, b) => (b.rating ?? -1) - (a.rating ?? -1) || byName(a, b),
  lastWatched: (a, b) => (b.lastWatched || "").localeCompare(a.lastWatched || "") || byName(a, b)
};
const matches = (a, f) => f === "all" || a.status === f;

function visible() {
  const q = plain(S.q.trim());
  return lib.filter(a => matches(a, S.filter) && (!q || plain(a.title).includes(q))).sort(SORTS[S.sort]);
}

/* ---------- Render ---------- */
function renderNow() {
  const box = $("#now"), list = lib.filter(a => a.status === "watching").sort(SORTS.lastWatched);
  box.hidden = !list.length;
  if (!list.length) { box.innerHTML = ""; return; }
  box.innerHTML = `<h2>🎬 ASSISTINDO AGORA</h2><div class="an-list">${list.map(a =>
    `<button class="an-row" type="button" data-id="${esc(a.id)}"><span class="an-t">${esc(a.title)}</span><span class="an-ep">Ep. ${a.currentEpisode}/${a.totalEpisodes ?? "…"}</span></button>`).join("")}</div>`;
}

function renderTabs() {
  $("#tabs").innerHTML = FILTERS.map(([f, label]) =>
    `<button class="st-tab${S.filter === f ? " on" : ""}" type="button" role="tab" aria-selected="${S.filter === f}" data-f="${f}">${esc(label)}<em>${lib.filter(a => matches(a, f)).length}</em></button>`).join("");
}

function cardHTML(a) {
  const s = STATUS[a.status], p = pct(a), cover = coverOf(a), total = a.totalEpisodes;
  const img = cover ? `<img loading="lazy" decoding="async" alt="" src="${esc(cover)}" data-name="${esc(a.title)}">`
                    : `<div class="st-ph" aria-hidden="true">${esc(initials(a.title))}</div>`;
  const prog = total
    ? `<div class="st-eps">${a.currentEpisode} / ${total} episódios</div><div class="st-prog"><div class="st-bar${p === 100 ? " full" : ""}"><i style="width:${p}%"></i></div><b>${p}%</b></div>`
    : `<div class="st-eps">${a.currentEpisode ? `Episódio ${a.currentEpisode}` : "Nenhum episódio assistido"}</div><div class="st-note">Em lançamento</div>`;
  const foot = [a.rating !== null ? `<span class="rt">⭐ ${fmtNum(a.rating)}</span>` : "", a.seasons > 1 ? `<span>Temporadas: ${a.seasons}</span>` : ""].filter(Boolean);
  return `<article class="st-card${a.status === "completed" ? " done" : ""}${a.status === "dropped" ? " dropped" : ""}" data-id="${esc(a.id)}" tabindex="0" role="button" aria-label="Abrir ${esc(a.title)}">
    <div class="st-cover">${img}</div>
    <div class="st-body">
      <h3 class="st-name">${esc(a.title)}</h3>
      <div class="st-status s-${a.status}">${s.icon} ${s.label}</div>
      ${prog}
      ${foot.length ? `<div class="st-foot">${foot.join("")}</div>` : ""}
    </div>
  </article>`;
}

function renderGrid() {
  const list = visible(), shown = list.slice(0, S.limit);   // só os cards necessários; "Mostrar mais" libera o resto
  $("#grid").innerHTML = shown.length ? shown.map(cardHTML).join("")
    : `<div class="st-empty">${lib.length ? "Nenhum anime encontrado com esse filtro." : "Sua lista está vazia. Clique em “+ Adicionar anime” para começar."}</div>`;
  const rest = list.length - shown.length;
  $("#more").innerHTML = rest > 0 ? `<button class="st-btn st-ghost" type="button" id="moreBtn">Mostrar mais (${rest})</button>` : "";
}

const render = () => { renderNow(); renderTabs(); renderGrid(); };

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
$("#now").onclick = e => { const r = e.target.closest("[data-id]"); if (r) openModal(r.dataset.id); };
$("#addBtn").onclick = () => openModal(null);

/* ---------- Modal: adicionar / editar ---------- */
const modal = $("#modal"), form = $("#form");
const showErr = msg => { const el = $("#fErr"); el.textContent = msg || ""; el.hidden = !msg; };

function updatePreview() {
  const cur = Math.max(0, Math.floor(Number($("#fCur").value) || 0)), tot = Math.floor(Number($("#fTotal").value) || 0);
  const p = tot > 0 ? Math.min(100, Math.floor(cur / tot * 100)) : 0;
  $("#mBar").style.width = p + "%";
  $("#mBar").parentElement.classList.toggle("full", tot > 0 && cur >= tot);
  $("#mPct").textContent = tot > 0 ? p + "%" : "—";
}
form.addEventListener("input", e => { if (e.target.id === "fCur" || e.target.id === "fTotal") updatePreview(); });

function openModal(id) {
  const a = id === null ? null : lib.find(x => String(x.id) === String(id));
  S.editing = a ? a.id : null;
  form.reset(); showErr("");
  $("#mTitle").textContent = a ? "EDITAR ANIME" : "ADICIONAR ANIME";
  $("#delBtn").hidden = !a;
  if (a) {
    $("#fName").value = a.title; $("#fCover").value = a.cover; $("#fStatus").value = a.status;
    $("#fCur").value = a.currentEpisode; $("#fTotal").value = a.totalEpisodes ?? ""; $("#fSeasons").value = a.seasons;
    $("#fRating").value = a.rating ?? ""; $("#fDate").value = a.lastWatched || "";
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
  const a = lib.find(x => x.id === S.editing);
  if (!a || !confirm(`Excluir “${a.title}” da lista?`)) return;
  lib = lib.filter(x => x.id !== a.id);
  save(); closeModal(); render();
};

form.onsubmit = e => {
  e.preventDefault();
  const title = $("#fName").value.trim(), cover = $("#fCover").value.trim();
  let cur = Math.floor(Number($("#fCur").value) || 0), status = $("#fStatus").value;
  const totalStr = $("#fTotal").value.trim(), total = totalStr === "" ? null : Math.floor(Number(totalStr));
  const seasons = $("#fSeasons").value.trim() === "" ? 1 : Math.floor(Number($("#fSeasons").value));
  const ratingStr = $("#fRating").value.trim(), rating = ratingStr === "" ? null : Number(ratingStr);

  if (!title) return showErr("Informe o nome do anime.");
  if (cover && !safeUrl(cover)) return showErr("A capa precisa ser um link que comece com http:// ou https://.");
  if (cur < 0) return showErr("O episódio atual não pode ser negativo.");
  if (total !== null && (!Number.isFinite(total) || total < 1)) return showErr("O total de episódios precisa ser maior que zero (ou deixe vazio se ainda está em lançamento).");
  if (total && cur > total) return showErr("O episódio atual não pode passar do total de episódios.");
  if (!Number.isFinite(seasons) || seasons < 1) return showErr("O número de temporadas precisa ser 1 ou mais.");
  if (rating !== null && (!Number.isFinite(rating) || rating < 0 || rating > 10)) return showErr("A nota vai de 0 a 10.");

  const old = S.editing === null ? null : lib.find(x => x.id === S.editing);
  if (status === "completed" && total && (!old || old.status !== "completed")) cur = total;   // marcou como assistido: completa os episódios
  if (status === "watching" && total && cur >= total) status = "completed";                   // chegou ao último episódio: vira assistido

  let lastWatched = $("#fDate").value || null;
  // se o progresso mudou e a data não foi mexida, "último assistido" vira hoje
  const progressed = !old ? status !== "planned" : (old.status !== status || old.currentEpisode !== cur);
  if (progressed && status !== "planned" && (!old || lastWatched === (old.lastWatched || null))) lastWatched = today();

  const anime = normalize({
    ...(old || {}), id: old ? old.id : uid(), title, cover, status, lastWatched,
    currentEpisode: cur, totalEpisodes: total, seasons, rating
  });
  lib = old ? lib.map(x => x.id === old.id ? anime : x) : [...lib, anime];
  save(); closeModal(); render();
};

render();

/* =====================================================================
   Preparado para uma API (ainda não ativo)
   ---------------------------------------------------------------------
   Cada anime já tem espaço para: synopsis, genres, year, airingStatus ("airing" | "finished" | "upcoming"),
   externalId ({ provider, id }), além de title, cover, totalEpisodes e seasons.
   Para buscar dados automaticamente depois:
     1) implemente RefAnime.api.search(texto) chamando a API escolhida;
     2) converta cada resultado com um adaptador (abaixo há um exemplo para a Jikan/MyAnimeList, sem chave,
        escrito a partir da documentação e ainda NÃO testado);
     3) chame RefAnime.add(anime) — o status e o progresso continuam sendo seus.
   Observação: APIs de catálogo normalmente não informam "temporadas" por título; mantenha esse campo manual.
   Se a lista ficar enorme, renderGrid() já fatia por S.limit: troque o botão "Mostrar mais" por um
   IntersectionObserver (infinite scroll) ou por virtualização sem mexer no resto.
   ===================================================================== */
window.RefAnime = {
  api: {
    // GET https://api.jikan.moe/v4/anime?q=<texto>&limit=10  →  { data: [ ... ] }
    async search(text) { throw new Error("Busca por API ainda não implementada"); },
    fromJikan(it) {
      return {
        title: it.title_english || it.title,
        cover: it.images?.jpg?.large_image_url || "",
        synopsis: it.synopsis || "",
        totalEpisodes: it.episodes ?? null,
        genres: (it.genres || []).map(g => g.name),
        year: it.year ?? it.aired?.prop?.from?.year ?? null,
        airingStatus: it.status === "Currently Airing" ? "airing" : it.status === "Not yet aired" ? "upcoming" : "finished",
        externalId: { provider: "mal", id: it.mal_id }
      };
    }
  },
  add(data) {
    const a = normalize({ status: "planned", ...data, source: "api" });
    const dup = a.externalId && lib.find(x => x.externalId && x.externalId.provider === a.externalId.provider && x.externalId.id === a.externalId.id);
    if (dup) return dup;                                   // já está na lista
    lib.push(a); save(); render();
    return a;
  }
};
