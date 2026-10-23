const API = "https://valorant-api.com/v1";
const NA = "Informação não disponível.";
const CATS = [["Sidearm", "SIDEARMS"], ["SMG", "SMGS"], ["Shotgun", "SHOTGUNS"], ["Rifle", "RIFLES"], ["Sniper", "SNIPER RIFLES"], ["Heavy", "MACHINE GUNS"]];
const SLOTS = [["Passive", "PASSIVA"], ["Grenade", "C"], ["Ability1", "Q"], ["Ability2", "E"], ["Ultimate", "X - ULTIMATE"]];

let agents = [], weapons = [], abilities = [], maps = [];
let roleFilter = "Todos", catFilter = "Todas";
let favs = JSON.parse(localStorage.getItem("vdb-favs") || '{"agents":[],"weapons":[]}');

const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const val = v => (v === null || v === undefined || v === "") ? NA : esc(v);
const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const img = (src, alt, cls = "") => src ? `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy">` : `<span class="muted">${NA}</span>`;
const saveFavs = () => localStorage.setItem("vdb-favs", JSON.stringify(favs));
const isFav = (t, id) => favs[t].includes(id);
const MAX_TEAM = 5;
let teams = JSON.parse(localStorage.getItem("vdb-teams") || "[]");
let draft = { id: null, name: "", agents: [], maps: [] };
const saveTeams = () => localStorage.setItem("vdb-teams", JSON.stringify(teams));

/* ---------- Tema ---------- */
function setTheme(t) {
  document.body.classList.toggle("light", t === "light");
  $("themeBtn").textContent = t === "light" ? "🌙 Dark Mode" : "☀️ Light Mode";
  localStorage.setItem("vdb-theme", t);
}
$("themeBtn").onclick = () => setTheme(document.body.classList.contains("light") ? "dark" : "light");
setTheme(localStorage.getItem("vdb-theme") || "dark");

/* ---------- Navegação ---------- */
function go(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("hidden", v.id !== view));
  document.querySelectorAll("nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === view));
  $("nav").classList.remove("open");
  if (view === "favs") renderFavs();
  if (view === "teams") renderTeams();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
document.addEventListener("click", e => {
  const n = e.target.closest("[data-nav]");
  if (n) { e.preventDefault(); if (n.dataset.nav !== "search") $("globalSearch").value = ""; go(n.dataset.nav); }
});
$("menuBtn").onclick = () => $("nav").classList.toggle("open");

/* ---------- Dados ---------- */
async function load() {
  ["homeGrid", "agentGrid", "abilityGrid", "weaponGrid"].forEach(id => $(id).innerHTML = '<div class="msg">Carregando...</div>');
  try {
    const [a, w, m] = await Promise.all([
      fetch(`${API}/agents?isPlayableCharacter=true&language=pt-BR`).then(r => { if (!r.ok) throw 0; return r.json(); }),
      fetch(`${API}/weapons?language=pt-BR`).then(r => { if (!r.ok) throw 0; return r.json(); }),
      fetch(`${API}/maps?language=pt-BR`).then(r => { if (!r.ok) throw 0; return r.json(); })
    ]);
    agents = a.data.sort((x, y) => x.displayName.localeCompare(y.displayName));
    weapons = w.data.filter(x => x.weaponStats && x.shopData); // exclui a faca (sem stats)
    maps = m.data.filter(x => x.tacticalDescription).sort((x, y) => x.displayName.localeCompare(y.displayName)); // só mapas competitivos (exclui Treino etc.)
    abilities = agents.flatMap(ag => (ag.abilities || []).filter(ab => ab.displayName).map(ab => ({ ...ab, agent: ag })));
    initUI();
  } catch (e) {
    ["homeGrid", "agentGrid", "abilityGrid", "weaponGrid"].forEach(id =>
      $(id).innerHTML = '<div class="msg err">Não foi possível carregar os dados.<br>Tente novamente.<br><br><button class="btn" onclick="load()">Tentar novamente</button></div>');
  }
}

function initUI() {
  const roles = ["Todos", ...new Set(agents.map(a => a.role && a.role.displayName).filter(Boolean))];
  $("roleFilters").innerHTML = roles.map(r => `<button class="chip ${r === roleFilter ? "active" : ""}" data-role="${esc(r)}">${esc(r)}</button>`).join("");
  $("catFilters").innerHTML = [["Todas", "Todas"], ...CATS].map(([k, l]) => `<button class="chip ${k === catFilter ? "active" : ""}" data-cat="${k}">${l}</button>`).join("");
  const opts = weapons.map(w => `<option value="${w.uuid}">${esc(w.displayName)}</option>`).join("");
  $("cmpA").innerHTML = opts; $("cmpB").innerHTML = opts;
  const vandal = weapons.findIndex(w => w.displayName === "Vandal"), phantom = weapons.findIndex(w => w.displayName === "Phantom");
  $("cmpA").selectedIndex = Math.max(vandal, 0); $("cmpB").selectedIndex = Math.max(phantom, 1);
  renderHome(); renderAgents(); renderAbilities(); renderWeapons(); renderCompare(); renderTeams();
}

/* ---------- Cards ---------- */
const heartBtn = (t, id) => `<button class="heart" data-fav="${t}" data-id="${id}" aria-label="Favoritar">${isFav(t, id) ? "❤️" : "♡"}</button>`;

function agentCard(a) {
  return `<article class="card"><div class="img">${img(a.fullPortrait || a.displayIcon, a.displayName)}</div>
  <div class="info"><h3>${esc(a.displayName)}</h3><span class="muted">${val(a.role && a.role.displayName)}</span>
  <div class="actions"><button class="btn" data-agent="${a.uuid}">Ver detalhes</button>${heartBtn("agents", a.uuid)}</div></div></article>`;
}
function weaponCard(w) {
  const s = w.weaponStats, cat = catName(w);
  return `<article class="card w-card"><div class="img">${img(w.displayIcon, w.displayName)}</div>
  <div class="info"><h3>${esc(w.displayName)}</h3><span class="muted">${esc(cat)}</span>
  <span class="muted">Preço: ${val(w.shopData && w.shopData.cost)}</span>
  <span class="muted">Dano: ${dmgShort(s)}</span>
  <span class="muted">Fire Rate: ${val(s && s.fireRate)}</span>
  <span class="muted">Magazine: ${val(s && s.magazineSize)}</span>
  <div class="actions"><button class="btn" data-weapon="${w.uuid}">Ver detalhes</button>${heartBtn("weapons", w.uuid)}</div></div></article>`;
}
const catKey = w => (w.category || "").split("::")[1] || "";
const catName = w => (CATS.find(c => c[0] === catKey(w)) || [0, NA])[1];
const dmgShort = s => {
  const r = s && s.damageRanges && s.damageRanges[0];
  return r ? `${r.headDamage ?? "?"} / ${r.bodyDamage ?? "?"} / ${r.legDamage ?? "?"}` : NA;
};
const abilityCard = ab => `<article class="card ab-card" data-agent="${ab.agent.uuid}">${img(ab.displayIcon, ab.displayName)}
  <div><h3>${esc(ab.displayName)}</h3><span class="muted">${esc(ab.agent.displayName)}</span><p>${val(ab.description)}</p></div></article>`;

/* ---------- Renders ---------- */
function renderHome() {
  $("homeGrid").innerHTML = agents.map(a => `<button class="pchip" data-agent="${a.uuid}" title="${esc(a.displayName)}">${img(a.displayIcon || a.fullPortrait, a.displayName)}${esc(a.displayName)}</button>`).join("");
}
function renderAgents() {
  const q = norm($("agentSearch").value);
  const list = agents.filter(a => (roleFilter === "Todos" || (a.role && a.role.displayName) === roleFilter) && norm(a.displayName).includes(q));
  $("agentGrid").innerHTML = list.length ? list.map(agentCard).join("") : `<div class="msg">${NA}</div>`;
}
function renderAbilities() {
  const q = norm($("abilitySearch").value);
  const list = abilities.filter(ab => norm(ab.displayName).includes(q) || norm(ab.agent.displayName).includes(q));
  $("abilityGrid").innerHTML = list.length ? list.map(abilityCard).join("") : `<div class="msg">${NA}</div>`;
}
function renderWeapons() {
  const q = norm($("weaponSearch").value);
  let html = "";
  CATS.forEach(([k, label]) => {
    if (catFilter !== "Todas" && catFilter !== k) return;
    const list = weapons.filter(w => catKey(w) === k && norm(w.displayName).includes(q));
    if (list.length) html += `<h3 class="cat-title">${label}</h3><div class="grid">${list.map(weaponCard).join("")}</div>`;
  });
  $("weaponGrid").innerHTML = html || `<div class="msg">${NA}</div>`;
}
function renderFavs() {
  const fa = agents.filter(a => isFav("agents", a.uuid)), fw = weapons.filter(w => isFav("weapons", w.uuid));
  let html = "";
  if (fa.length) html += `<h3 class="cat-title">AGENTES</h3><div class="grid">${fa.map(agentCard).join("")}</div>`;
  if (fw.length) html += `<h3 class="cat-title">ARMAS</h3><div class="grid">${fw.map(weaponCard).join("")}</div>`;
  $("favContent").innerHTML = html || '<div class="msg">Você ainda não favoritou nada.</div>';
}

/* ---------- Detalhes ---------- */
function openModal(html) { $("modalContent").innerHTML = html; $("modal").classList.remove("hidden"); document.body.style.overflow = "hidden"; }
function closeModal() { $("modal").classList.add("hidden"); document.body.style.overflow = ""; }
$("closeModal").onclick = closeModal;
$("modal").onclick = e => { if (e.target.id === "modal") closeModal(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function showAgent(id) {
  const a = agents.find(x => x.uuid === id); if (!a) return;
  const abs = SLOTS.map(([slot, label]) => {
    const ab = (a.abilities || []).find(x => x.slot === slot);
    if (!ab) return "";
    return `<div class="ab-item">${img(ab.displayIcon, ab.displayName)}<div><span class="key">${label}</span><h3>${val(ab.displayName)}</h3><p class="muted">${val(ab.description)}</p></div></div>`;
  }).join("");
  openModal(`<div class="detail-head">${img(a.fullPortrait || a.displayIcon, a.displayName, "big")}
    <div><h2>${esc(a.displayName)}</h2>
    <div class="role">${a.role ? img(a.role.displayIcon, "") + esc(a.role.displayName) : NA}</div>
    <p class="muted">${val(a.description)}</p><br>${heartBtn("agents", a.uuid)}</div></div>
    <h3 class="cat-title">HABILIDADES</h3><div class="ab-list">${abs || NA}</div>`);
}

const PEN = { Low: "Baixa", Medium: "Média", High: "Alta" };
function showWeapon(id) {
  const w = weapons.find(x => x.uuid === id); if (!w) return;
  const s = w.weaponStats || {};
  const rows = (s.damageRanges || []).map(r => `<tr><td>${r.rangeStartMeters}-${r.rangeEndMeters}m</td><td>${val(r.headDamage)}</td><td>${val(r.bodyDamage)}</td><td>${val(r.legDamage)}</td></tr>`).join("");
  const pen = s.wallPenetration ? (PEN[s.wallPenetration.split("::")[1].replace("Display", "")] || s.wallPenetration.split("::")[1]) : null;
  const alt = s.altFireType ? s.altFireType.split("::")[1] : null;
  const st = (l, v) => `<div class="stat"><b>${l}</b>${val(v)}</div>`;
  openModal(`<div class="detail-head">${img(w.displayIcon, w.displayName, "big")}
    <div><h2>${esc(w.displayName)}</h2><div class="role">${esc(catName(w))}</div><br>${heartBtn("weapons", w.uuid)}</div></div>
    <div class="stats">${st("Preço", w.shopData && w.shopData.cost)}${st("Fire Rate", s.fireRate)}${st("Magazine", s.magazineSize)}
    ${st("Equip Time", s.equipTimeSeconds)}${st("Reload Time", s.reloadTimeSeconds)}${st("Run Speed", s.runSpeedMultiplier)}
    ${st("Zoom", s.adsStats && s.adsStats.zoomMultiplier)}${st("Wall Penetration", pen)}
    ${st("Primary Fire", s.fireMode ? s.fireMode.split("::")[1] : "Padrão")}${st("Alternate Fire", alt)}</div>
    <h3 class="cat-title">DANO</h3>
    <div class="table-wrap"><table><tr><th>Distância</th><th>Head</th><th>Body</th><th>Leg</th></tr>${rows || `<tr><td colspan="4">${NA}</td></tr>`}</table></div>`);
}

/* ---------- Comparação ---------- */
function renderCompare() {
  const a = weapons.find(w => w.uuid === $("cmpA").value), b = weapons.find(w => w.uuid === $("cmpB").value);
  if (!a || !b) return;
  const dmg = w => (w.weaponStats.damageRanges || []).map(r => `${r.rangeStartMeters}-${r.rangeEndMeters}m: ${r.headDamage}/${r.bodyDamage}/${r.legDamage}`).join("<br>") || NA;
  const rows = [
    ["Categoria", w => catName(w)], ["Preço", w => val(w.shopData.cost)], ["Dano (Head/Body/Leg)", dmg],
    ["Fire Rate", w => val(w.weaponStats.fireRate)], ["Magazine", w => val(w.weaponStats.magazineSize)],
    ["Reload Time", w => val(w.weaponStats.reloadTimeSeconds)], ["Equip Time", w => val(w.weaponStats.equipTimeSeconds)]
  ];
  $("cmpResult").innerHTML = `<table><tr><th></th><th>${esc(a.displayName)}</th><th>${esc(b.displayName)}</th></tr>
    ${rows.map(([l, f]) => `<tr><td><b>${l}</b></td><td>${f(a)}</td><td>${f(b)}</td></tr>`).join("")}</table>`;
}

/* ---------- Busca global ---------- */
function globalSearch() {
  const q = norm($("globalSearch").value.trim());
  if (!q) { go("home"); return; }
  go("search");
  const A = agents.filter(a => norm(a.displayName).includes(q));
  const B = abilities.filter(x => norm(x.displayName).includes(q));
  const W = weapons.filter(w => norm(w.displayName).includes(q));
  let html = "";
  if (A.length) html += `<h3 class="cat-title">AGENTES</h3><div class="grid">${A.map(agentCard).join("")}</div>`;
  if (B.length) html += `<h3 class="cat-title">HABILIDADES</h3><div class="grid ab-grid">${B.map(abilityCard).join("")}</div>`;
  if (W.length) html += `<h3 class="cat-title">ARMAS</h3><div class="grid">${W.map(weaponCard).join("")}</div>`;
  $("searchResults").innerHTML = html || `<div class="msg">${NA}</div>`;
}

/* ---------- Eventos ---------- */
$("globalSearch").oninput = globalSearch;
$("agentSearch").oninput = renderAgents;
$("abilitySearch").oninput = renderAbilities;
$("weaponSearch").oninput = renderWeapons;
$("cmpA").onchange = $("cmpB").onchange = renderCompare;

document.addEventListener("click", e => {
  const t = e.target;
  const role = t.closest("[data-role]");
  if (role) {
    roleFilter = role.dataset.role;
    document.querySelectorAll("[data-role]").forEach(c => c.classList.toggle("active", c === role));
    return renderAgents();
  }
  const cat = t.closest("[data-cat]");
  if (cat) {
    catFilter = cat.dataset.cat;
    document.querySelectorAll("[data-cat]").forEach(c => c.classList.toggle("active", c === cat));
    return renderWeapons();
  }
  const fav = t.closest("[data-fav]");
  if (fav) {
    const { fav: type, id } = fav.dataset, list = favs[type];
    favs[type] = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
    saveFavs();
    document.querySelectorAll(`[data-fav="${type}"][data-id="${id}"]`).forEach(b => b.textContent = isFav(type, id) ? "❤️" : "♡");
    if (!$("favs").classList.contains("hidden")) renderFavs();
    return;
  }
  const ag = t.closest("[data-agent]");
  if (ag) return showAgent(ag.dataset.agent);
  const wp = t.closest("[data-weapon]");
  if (wp) return showWeapon(wp.dataset.weapon);
});

/* ---------- Times ---------- */
const roleOf = a => (a.role && a.role.displayName) || "Sem função";
const slugify = s => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "time";
const teamMsg = (t, cls = "") => { const m = $("teamMsg"); m.textContent = t; m.className = "muted " + cls; };

function renderTeams() {
  if (!agents.length) return;
  renderDraft();
  renderSavedTeams();
}

function renderDraft() {
  $("teamName").value !== draft.name && ($("teamName").value = draft.name);
  $("editBadge").classList.toggle("hidden", !draft.id);
  $("agentCount").textContent = `(${draft.agents.length}/${MAX_TEAM})`;
  $("mapCount").textContent = `(${draft.maps.length})`;

  // slots
  $("teamSlots").innerHTML = Array.from({ length: MAX_TEAM }, (_, i) => {
    const a = agents.find(x => x.uuid === draft.agents[i]);
    return a
      ? `<div class="slot filled" data-pick-agent="${a.uuid}" title="Remover ${esc(a.displayName)}"><span class="x">✕</span>${img(a.displayIcon, a.displayName)}<b>${esc(a.displayName)}</b><span>${esc(roleOf(a))}</span></div>`
      : `<div class="slot"><span>Vaga ${i + 1}</span></div>`;
  }).join("");

  // composição por função
  const count = {};
  draft.agents.forEach(id => { const a = agents.find(x => x.uuid === id); if (a) count[roleOf(a)] = (count[roleOf(a)] || 0) + 1; });
  $("teamRoles").innerHTML = Object.entries(count).map(([r, n]) => `<span class="chip active">${esc(r)} ×${n}</span>`).join("");

  // picker de agentes
  const q = norm($("pickAgentSearch").value);
  const full = draft.agents.length >= MAX_TEAM;
  $("pickAgents").innerHTML = agents.filter(a => norm(a.displayName).includes(q)).map(a => {
    const sel = draft.agents.includes(a.uuid);
    return `<div class="pick ${sel ? "sel" : ""} ${full && !sel ? "off" : ""}" data-pick-agent="${a.uuid}">${img(a.displayIcon, a.displayName)}<span>${esc(a.displayName)}</span></div>`;
  }).join("") || `<div class="msg">${NA}</div>`;

  // picker de mapas
  $("pickMaps").innerHTML = maps.map(m => {
    const sel = draft.maps.includes(m.uuid);
    return `<div class="pick map ${sel ? "sel" : ""}" data-pick-map="${m.uuid}">${img(m.listViewIcon || m.splash, m.displayName)}<span>${esc(m.displayName)}</span></div>`;
  }).join("") || `<div class="msg">${NA}</div>`;
}

function toggleDraft(type, id) {
  const list = draft[type];
  if (list.includes(id)) draft[type] = list.filter(x => x !== id);
  else if (type === "agents" && list.length >= MAX_TEAM) return teamMsg(`Um time tem no máximo ${MAX_TEAM} agentes.`, "err");
  else draft[type] = [...list, id];
  teamMsg("");
  renderDraft();
}

function teamToMd(t) {
  const ags = t.agents.map(id => agents.find(a => a.uuid === id)).filter(Boolean);
  const mps = t.maps.map(id => maps.find(m => m.uuid === id)).filter(Boolean);
  const date = new Date(t.updated || Date.now()).toLocaleDateString("pt-BR");
  return [
    `# ${t.name}`, "",
    `> Time criado no VALORANT Database em ${date}`, "",
    `## Agentes (${ags.length}/${MAX_TEAM})`, "",
    "| # | Agente | Função |", "|---|--------|--------|",
    ...ags.map((a, i) => `| ${i + 1} | ${a.displayName} | ${roleOf(a)} |`), "",
    `## Mapas (${mps.length})`, "",
    ...(mps.length ? mps.map(m => `- ${m.displayName}`) : ["_Nenhum mapa selecionado._"]), ""
  ].join("\n");
}

function download(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function saveDraft() {
  const name = $("teamName").value.trim();
  if (!name) return teamMsg("Dê um nome ao time.", "err");
  if (!draft.agents.length) return teamMsg("Selecione pelo menos 1 agente.", "err");
  if (!draft.maps.length) return teamMsg("Selecione pelo menos 1 mapa.", "err");
  const team = { id: draft.id || "t" + Date.now(), name, agents: [...draft.agents], maps: [...draft.maps], updated: Date.now() };
  const i = teams.findIndex(t => t.id === team.id);
  if (i >= 0) teams[i] = team; else teams.unshift(team);
  saveTeams();
  resetDraft();
  renderSavedTeams();
  teamMsg(`Time "${name}" salvo no site ✔ (use "Exportar .md" nos times salvos quando precisar)`, "ok");
}

function resetDraft() {
  draft = { id: null, name: "", agents: [], maps: [] };
  $("teamName").value = "";
  renderDraft();
}

function renderSavedTeams() {
  $("savedTeams").innerHTML = teams.length ? teams.map(t => {
    const ags = t.agents.map(id => agents.find(a => a.uuid === id)).filter(Boolean);
    const mps = t.maps.map(id => maps.find(m => m.uuid === id)).filter(Boolean);
    return `<article class="card team-card"><h3>${esc(t.name)}</h3>
      <div class="team-icons">${ags.map(a => img(a.displayIcon, a.displayName)).join("")}</div>
      <span class="muted">${ags.map(a => esc(a.displayName)).join(", ")}</span>
      <div class="team-icons">${mps.map(m => img(m.listViewIcon || m.splash, m.displayName, "mp")).join("")}</div>
      <span class="muted">${mps.map(m => esc(m.displayName)).join(", ") || NA}</span>
      <div class="btns">
        <button class="btn" data-team-dl="${t.id}">⬇ Exportar .md</button>
        <button class="btn ghost" data-team-edit="${t.id}">Editar</button>
        <button class="btn ghost danger" data-team-del="${t.id}">Excluir</button>
      </div></article>`;
  }).join("") : '<div class="msg">Nenhum time salvo ainda.</div>';
}

$("teamName").oninput = e => { draft.name = e.target.value; };
$("pickAgentSearch").oninput = renderDraft;
$("saveTeam").onclick = saveDraft;
$("clearTeam").onclick = () => { resetDraft(); teamMsg(""); };

document.addEventListener("click", e => {
  const t = e.target;
  const pa = t.closest("[data-pick-agent]"); if (pa) return toggleDraft("agents", pa.dataset.pickAgent);
  const pm = t.closest("[data-pick-map]"); if (pm) return toggleDraft("maps", pm.dataset.pickMap);
  const dl = t.closest("[data-team-dl]");
  if (dl) { const tm = teams.find(x => x.id === dl.dataset.teamDl); if (tm) download(slugify(tm.name) + ".md", teamToMd(tm)); return; }
  const ed = t.closest("[data-team-edit]");
  if (ed) {
    const tm = teams.find(x => x.id === ed.dataset.teamEdit); if (!tm) return;
    draft = { id: tm.id, name: tm.name, agents: [...tm.agents], maps: [...tm.maps] };
    renderDraft(); teamMsg(`Editando "${tm.name}". Salve para atualizar.`);
    window.scrollTo({ top: 0, behavior: "smooth" }); return;
  }
  const del = t.closest("[data-team-del]");
  if (del) {
    const tm = teams.find(x => x.id === del.dataset.teamDel);
    if (tm && confirm(`Excluir o time "${tm.name}"?`)) {
      teams = teams.filter(x => x.id !== tm.id); saveTeams();
      if (draft.id === tm.id) resetDraft();
      renderSavedTeams();
    }
  }
});

const VIEWS = ["home", "agents", "abilities", "weapons", "teams", "favs"];
const hashView = () => { const h = location.hash.slice(1); return VIEWS.includes(h) ? h : null; };
addEventListener("hashchange", () => { const h = hashView(); if (h) go(h); });
Promise.resolve(load()).finally(() => { const h = hashView(); if (h) go(h); });
