/* REF-Genius · BEYBLADE — Metal Saga (Metal Fusion · Metal Masters · Metal Fury)
   ------------------------------------------------------------------
   • Os dados ficam em data/*.js (um arquivo por saga). Um Blader é UM registro por saga (mesmo `id` nas 3),
     com a lista das Beyblades que ele usa naquela saga.
   • Imagens: se `image`/`bladerImage` tiver uma URL no dado, ela é usada. Se for null, a página busca a imagem
     principal da página da wiki (campo `wiki`) na API pública da Beyblade Wiki (Fandom) e guarda o resultado
     no localStorage. Sem imagem encontrada (ou sem rede) aparece o placeholder local.
   • "Não confirmados": entradas marcadas com confirmed:false ficam escondidas até ligar o checkbox. */

const PROFILE_KEY = "refgenius-profile";   // mesmo perfil da home (aqui só LÊ o avatar)
const IMG_CACHE_KEY = "bb-img-v1";
const IMG_TTL = 7 * 24 * 3600 * 1000;      // reconsulta a wiki depois de 7 dias
const WIKI_API = "https://beyblade.fandom.com/api.php";
const PLACEHOLDER = "placeholder.svg";

const SAGAS = [
  { key: "fusion",  label: "METAL FUSION",  tab: "Metal Fusion",  data: metalFusion },
  { key: "masters", label: "METAL MASTERS", tab: "Metal Masters", data: metalMasters },
  { key: "fury",    label: "METAL FURY",    tab: "Metal Fury",    data: metalFury }
];

const $ = (sel, root = document) => root.querySelector(sel);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const plain = s => String(s).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const initials = name => String(name).split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
const safeUrl = u => (/^https?:\/\//i.test(u || "") ? u : "");
const asList = w => (Array.isArray(w) ? w : w ? [w] : []);
const normTitle = t => String(t).replace(/_/g, " ").trim();

const state = { saga: "all", q: "", unconf: false, pick: {} };   // pick: "saga|id" -> índice da Beyblade exibida

/* ---------- Perfil: só LÊ o avatar salvo na home ---------- */
(function initAvatar() {
  let p = null;
  try { p = JSON.parse(localStorage.getItem(PROFILE_KEY)); } catch {}
  const el = $("#stAvatar .av");
  if (!el || !p || !p.image) return;
  const img = new Image();
  img.alt = p.character || "";
  img.onerror = () => { img.remove(); el.textContent = (p.character || "?")[0]; };
  img.src = p.image;
  el.textContent = "";
  el.classList.add("has");
  el.appendChild(img);
})();

/* ---------- Imagens (API da Beyblade Wiki + cache) ---------- */
const imgMap = {};   // título normalizado -> URL ("" = a wiki não tem imagem para esse título)
(function loadCache() {
  try {
    const c = JSON.parse(localStorage.getItem(IMG_CACHE_KEY)) || {};
    const now = Date.now();
    for (const [t, v] of Object.entries(c)) if (v && now - v.t < IMG_TTL) imgMap[t] = v.u;
  } catch {}
})();
function saveCache() {
  try {
    const now = Date.now(), out = {};
    for (const [t, u] of Object.entries(imgMap)) out[t] = { u, t: now };
    localStorage.setItem(IMG_CACHE_KEY, JSON.stringify(out));
  } catch {}
}

function allTitles() {
  const set = new Set();
  for (const s of SAGAS) for (const b of s.data) {
    if (!b.bladerImage) asList(b.wiki).forEach(t => set.add(normTitle(t)));
    for (const y of b.beyblades) if (!y.image) asList(y.wiki).forEach(t => set.add(normTitle(t)));
  }
  return [...set];
}

async function fetchBatch(titles) {
  const url = `${WIKI_API}?action=query&format=json&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=600&titles=${encodeURIComponent(titles.join("|"))}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status);
  const q = (await r.json()).query || {};
  // from -> to (normalização e redirecionamentos)
  const hop = {};
  (q.normalized || []).forEach(n => { hop[n.from] = n.to; });
  const red = {};
  (q.redirects || []).forEach(n => { red[n.from] = n.to; });
  const byTitle = {};
  Object.values(q.pages || {}).forEach(p => { byTitle[p.title] = p.thumbnail ? safeUrl(p.thumbnail.source) : ""; });
  for (const t of titles) {
    let cur = hop[t] || t;
    cur = red[cur] || cur;
    imgMap[t] = byTitle[cur] || "";
  }
}

async function resolveImages() {
  const pending = allTitles().filter(t => !(t in imgMap));
  if (!pending.length) return;
  const batches = [];
  for (let i = 0; i < pending.length; i += 40) batches.push(pending.slice(i, i + 40));
  let changed = false;
  await Promise.all(batches.map(async b => {
    try { await fetchBatch(b); changed = true; } catch { /* sem rede / bloqueado: segue com o placeholder */ }
  }));
  if (changed) { saveCache(); render(); if (!$("#modal").hidden) renderModal(); }
}

function imageFor(explicit, wiki) {
  const u = safeUrl(explicit);
  if (u) return u;
  for (const t of asList(wiki)) { const v = imgMap[normTitle(t)]; if (v) return v; }
  return "";
}
const bladerImg = b => imageFor(b.bladerImage, b.wiki);
const beyImg = y => imageFor(y.image, y.wiki);

/* ---------- Dados derivados ---------- */
const visibleBeys = b => b.beyblades.filter(y => state.unconf || y.confirmed !== false);

function matches(b) {
  const q = plain(state.q.trim());
  if (!q) return true;
  const hay = [b.blader, b.aka, b.team, ...b.beyblades.map(y => y.name)].filter(Boolean).map(plain).join(" | ");
  return q.split(/\s+/).every(w => hay.includes(w));
}

function sagaEntries(s) {
  return s.data.filter(b => visibleBeys(b).length && matches(b));
}

/* ---------- Render ---------- */
function bladerPortrait(b) {
  const u = bladerImg(b);
  return u ? `<img loading="lazy" alt="${esc(b.blader)}" src="${esc(u)}">` : esc(initials(b.blader));
}
function beyTag(y, cls = "") {
  const u = beyImg(y);
  return `<img class="${u ? cls : (cls + " ph").trim()}" loading="lazy" alt="${esc(y.name)}" src="${esc(u || PLACEHOLDER)}">`;
}

function cardHtml(s, b) {
  const beys = visibleBeys(b);
  const key = `${s.key}|${b.id}`;
  const i = Math.min(state.pick[key] || 0, beys.length - 1);
  const y = beys[i];
  const unconf = y.confirmed === false;
  const picker = beys.length > 1
    ? `<div class="bb-pick" aria-label="Beyblades de ${esc(b.blader)}">${beys.map((o, n) =>
        `<button type="button" class="${n === i ? "on" : ""}" data-n="${n}" title="${esc(o.name)}" aria-label="${esc(o.name)}">${beyTag(o)}</button>`).join("")}</div>`
    : "";
  return `<div class="bb-card${unconf ? " unconf" : ""}" role="button" tabindex="0" data-saga="${s.key}" data-id="${esc(b.id)}" aria-label="${esc(b.blader)} — ${esc(y.name)}">
    <div class="bb-bey">${beyTag(y)}${picker}<div class="bb-portrait">${bladerPortrait(b)}</div></div>
    <div class="bb-body">
      <div class="bb-name">${esc(b.blader)}</div>
      <div class="bb-bname">${esc(y.name)}</div>
      <div class="bb-meta">
        <span class="bb-chip">${esc(s.tab)}</span>
        ${b.team ? `<span class="bb-chip">${esc(b.team)}</span>` : ""}
        ${beys.length > 1 ? `<span class="bb-chip more">${beys.length} Beyblades</span>` : ""}
        ${unconf ? `<span class="bb-chip warn">não confirmado</span>` : ""}
      </div>
    </div>
  </div>`;
}

function renderTabs() {
  const tabs = [["all", "Todas"], ...SAGAS.map(s => [s.key, s.tab])];
  $("#tabs").innerHTML = tabs.map(([k, label]) => {
    const n = k === "all" ? new Set(SAGAS.flatMap(s => sagaEntries(s).map(b => b.id))).size : sagaEntries(SAGAS.find(s => s.key === k)).length;
    return `<button class="st-tab${state.saga === k ? " on" : ""}" type="button" role="tab" aria-selected="${state.saga === k}" data-f="${k}">${esc(label)}<em>${n}</em></button>`;
  }).join("");
}

function render() {
  renderTabs();
  const shown = SAGAS.filter(s => state.saga === "all" || state.saga === s.key);
  let html = "", bladers = new Set(), beys = 0;
  for (const s of shown) {
    const list = sagaEntries(s);
    if (!list.length) continue;
    list.forEach(b => { bladers.add(b.id); beys += visibleBeys(b).length; });
    html += `<section class="bb-saga" aria-label="${esc(s.label)}">
      <div class="bb-saga-h"><h2>${esc(s.label)}</h2><span>${list.length} Blader${list.length > 1 ? "s" : ""}</span></div>
      <div class="bb-grid">${list.map(b => cardHtml(s, b)).join("")}</div>
    </section>`;
  }
  $("#sagas").innerHTML = html || `<p class="bb-empty">Nenhum Blader encontrado.</p>`;
  $("#count").innerHTML = `<b>${bladers.size}</b> Bladers · <b>${beys}</b> Beyblades`;
}

/* ---------- Modal: todas as Beyblades do Blader, em todas as sagas ---------- */
let modalId = null;
function openModal(id) { modalId = id; renderModal(); $("#modal").hidden = false; $("#closeBtn").focus(); }
function closeModal() { $("#modal").hidden = true; modalId = null; }

function renderModal() {
  if (!modalId) return;
  const rows = SAGAS.map(s => ({ s, b: s.data.find(x => x.id === modalId) })).filter(r => r.b && visibleBeys(r.b).length);
  if (!rows.length) return closeModal();
  const first = rows[0].b;
  const aka = [...new Set(rows.map(r => r.b.aka).filter(Boolean))];
  $("#mName").textContent = first.blader;
  $("#mAka").textContent = aka.length ? `também: ${aka.join(", ")}` : "";
  const pu = rows.map(r => bladerImg(r.b)).find(Boolean);
  $("#mPortrait").innerHTML = pu ? `<img alt="${esc(first.blader)}" src="${esc(pu)}">` : esc(initials(first.blader));
  $("#mBody").innerHTML = rows.map(({ s, b }) => `
    <div class="bb-ms">
      <h3>${esc(s.label)}${b.team ? `<em>${esc(b.team)}</em>` : ""}</h3>
      <div class="bb-mrow">${visibleBeys(b).map(y => `
        <div class="bb-mb${y.confirmed === false ? " unconf" : ""}">
          <div class="bb-bey">${beyTag(y)}</div>
          <p>${esc(y.name)}
            ${y.note ? `<small${y.confirmed === false ? ' class="warn"' : ""}>${esc(y.note)}</small>` : ""}
            ${y.confirmed === false && !y.note ? `<small class="warn">não confirmado</small>` : ""}</p>
        </div>`).join("")}
      </div>
    </div>`).join("");
}

/* ---------- Eventos ---------- */
$("#tabs").addEventListener("click", e => {
  const t = e.target.closest(".st-tab");
  if (t) { state.saga = t.dataset.f; render(); }
});
$("#q").addEventListener("input", e => { state.q = e.target.value; render(); });
$("#unconf").addEventListener("change", e => { state.unconf = e.target.checked; render(); if (!$("#modal").hidden) renderModal(); });

$("#sagas").addEventListener("click", e => {
  const card = e.target.closest(".bb-card");
  if (!card) return;
  const pick = e.target.closest(".bb-pick button");
  if (pick) {                                   // troca a Beyblade exibida no card, sem abrir o modal
    e.stopPropagation();
    state.pick[`${card.dataset.saga}|${card.dataset.id}`] = +pick.dataset.n;
    const s = SAGAS.find(x => x.key === card.dataset.saga);
    const b = s.data.find(x => x.id === card.dataset.id);
    const tmp = document.createElement("div");
    tmp.innerHTML = cardHtml(s, b);
    card.replaceWith(tmp.firstElementChild);
    return;
  }
  openModal(card.dataset.id);
});
$("#sagas").addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("bb-card")) {
    e.preventDefault();
    openModal(e.target.dataset.id);
  }
});
$("#closeBtn").onclick = closeModal;
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#modal").hidden) closeModal(); });

render();
resolveImages();
