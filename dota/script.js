const API = "https://api.opendota.com/api";
const CDN = "https://cdn.cloudflare.steamstatic.com";
const NA = '<span class="na">Informação não disponível.</span>';
const $ = id => document.getElementById(id);
const ATTR = { str: "Strength", agi: "Agility", int: "Intelligence", all: "Universal" };

let heroes = [], items = [], heroAbilities = {}, abilities = {};
let attrFilter = "", favs = [];
try { favs = JSON.parse(localStorage.getItem("dota-favs") || "[]"); } catch { favs = []; }

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const val = v => (v === undefined || v === null || v === "" || v === false) ? NA : esc(Array.isArray(v) ? v.join(" / ") : v);
const img = p => p ? (p.startsWith("http") ? p : CDN + p) : "";

/* ---------- Carregamento ---------- */
async function load() {
  $("status").classList.remove("hidden");
  $("status").textContent = "Carregando...";
  try {
    const get = u => fetch(API + u).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
    const [h, ha, ab, it] = await Promise.all([
      get("/heroStats"), get("/constants/hero_abilities"), get("/constants/abilities"), get("/constants/items")
    ]);
    heroes = h.sort((a, b) => a.localized_name.localeCompare(b.localized_name));
    heroAbilities = ha; abilities = ab;
    items = Object.entries(it)
      .filter(([k, v]) => v.dname && !k.startsWith("recipe_") && v.img)
      .map(([k, v]) => ({ key: k, ...v }))
      .sort((a, b) => a.dname.localeCompare(b.dname));
    window.itemMap = it;
    setupFilters(); renderAll();
    $("status").classList.add("hidden");
    $("content").classList.remove("hidden");
  } catch (e) {
    $("status").innerHTML = 'Não foi possível carregar os dados.<br>Tente novamente.<br><button class="btn" id="retry">Tentar novamente</button>';
    $("retry").onclick = load;
  }
}

/* ---------- Filtros ---------- */
function setupFilters() {
  const attrs = [["", "Todos"], ["str", "Strength"], ["agi", "Agility"], ["int", "Intelligence"], ["all", "Universal"]];
  $("attrFilters").innerHTML = attrs.map(([k, l]) => `<button class="chip ${k === attrFilter ? "on" : ""}" data-a="${k}">${l}</button>`).join("");
  const roles = [...new Set(heroes.flatMap(h => h.roles || []))].sort();
  $("roleFilter").innerHTML = '<option value="">Todas as funções</option>' + roles.map(r => `<option>${esc(r)}</option>`).join("");
}
$("attrFilters").onclick = e => {
  if (!e.target.dataset.a && e.target.dataset.a !== "") return;
  attrFilter = e.target.dataset.a;
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.dataset.a === attrFilter));
  renderHeroes();
};
$("roleFilter").onchange = renderHeroes;
$("nameFilter").oninput = renderHeroes;
$("itemFilter").oninput = renderItems;

/* ---------- Renderização ---------- */
function heroCard(h) {
  const fav = favs.includes(h.id);
  return `<article class="card">
    <img class="hero-img" loading="lazy" src="${img(h.img)}" alt="${esc(h.localized_name)}">
    <div class="info"><h4>${esc(h.localized_name)}</h4>
      <span class="attr ${ATTR[h.primary_attr]}">${ATTR[h.primary_attr] || NA}</span>
      <span class="roles">${(h.roles || []).map(esc).join(" / ") || NA}</span>
      <div class="actions"><button class="btn" data-open="${h.id}">Ver detalhes</button>
      <button class="fav" data-fav="${h.id}" aria-label="Favoritar">${fav ? "❤️" : "♡"}</button></div></div></article>`;
}
function itemCard(i) {
  const bonus = (i.attrib || []).map(a => `${esc(a.display || a.key)} ${esc(a.value)}`.replace(/\s+/g, " ")).join("<br>");
  const comps = (i.components || []).map(c => (window.itemMap[c] || {}).dname || c).map(esc).join(", ");
  const desc = itemDesc(i);
  return `<article class="card item-card"><img loading="lazy" src="${img(i.img)}" alt="${esc(i.dname)}">
    <div><h4>${esc(i.dname)}</h4>
    <p>${desc ? esc(desc) : NA}</p>
    <div class="cost">Custo: ${i.cost ? esc(i.cost) + " 🪙" : NA}</div>
    <div class="tags"><b>Atributos/bônus:</b><br>${bonus || NA}</div>
    <div class="tags"><b>Componentes:</b> ${comps || NA}</div></div></article>`;
}
function itemDesc(i) {
  if (i.abilities && i.abilities.length) return i.abilities.map(a => a.description).filter(Boolean)[0] || "";
  return (i.hint && i.hint[0]) || i.lore || "";
}
function renderHeroes() {
  const n = $("nameFilter").value.trim().toLowerCase(), r = $("roleFilter").value;
  const list = heroes.filter(h => (!attrFilter || h.primary_attr === attrFilter) && (!r || (h.roles || []).includes(r)) && (!n || h.localized_name.toLowerCase().includes(n)));
  $("heroGrid").innerHTML = list.map(heroCard).join("") || NA;
}
function renderFavs() {
  const list = heroes.filter(h => favs.includes(h.id));
  $("favGrid").innerHTML = list.map(heroCard).join("") || '<p class="na">Você ainda não favoritou nenhum herói.</p>';
}
function renderItems() {
  const n = $("itemFilter").value.trim().toLowerCase();
  const list = items.filter(i => !n || i.dname.toLowerCase().includes(n));
  $("itemGrid").innerHTML = list.slice(0, 120).map(itemCard).join("") || NA;
}
function renderHome() {
  $("homeGrid").innerHTML = heroes.map(h => `<button class="pchip" data-open="${h.id}"><img loading="lazy" src="${img(h.img)}" alt="">${esc(h.localized_name)}</button>`).join("");
}
function renderAll() { renderHeroes(); renderFavs(); renderItems(); renderTeam(); renderHome(); }

/* ---------- Favoritos e detalhes (delegação de eventos) ---------- */
document.addEventListener("click", e => {
  const f = e.target.closest("[data-fav]"), o = e.target.closest("[data-open]");
  if (f) {
    const id = +f.dataset.fav;
    favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
    try { localStorage.setItem("dota-favs", JSON.stringify(favs)); } catch {}
    renderHeroes(); renderFavs(); if (!$("resultados").classList.contains("hidden")) globalSearch();
  }
  if (o) openHero(+o.dataset.open);
});

function fmtMana(v) { return Array.isArray(v) ? v.join(" / ") : v; }
function abilityCard(name) {
  const a = abilities[name];
  if (!a || !a.dname) return "";
  const type = a.behavior ? (Array.isArray(a.behavior) ? a.behavior.join(", ") : a.behavior) : "";
  return `<div class="ability">${a.img ? `<img loading="lazy" src="${img(a.img)}" alt="">` : ""}
    <h4>${esc(a.dname)}</h4><p>${a.desc ? esc(a.desc) : NA}</p>
    <p><b>Tipo:</b> ${val(type)}</p>
    <p><b>Mana:</b> ${a.mc ? esc(fmtMana(a.mc)) : NA}</p>
    <p><b>Cooldown:</b> ${a.cd ? esc(fmtMana(a.cd)) + "s" : NA}</p></div>`;
}
function openHero(id) {
  const h = heroes.find(x => x.id === id); if (!h) return;
  const st = (l, v) => `<div class="stat"><span>${l}</span><b>${v ?? "—"}</b></div>`;
  const atk = (h.base_attack_min != null && h.base_attack_max != null) ? `${h.base_attack_min}–${h.base_attack_max}` : null;
  let picks = 0, wins = 0, total = 0;
  for (let i = 1; i <= 8; i++) { picks += h[i + "_pick"] || 0; wins += h[i + "_win"] || 0; }
  heroes.forEach(x => { for (let i = 1; i <= 8; i++) total += x[i + "_pick"] || 0; });
  const wr = picks ? (wins / picks * 100).toFixed(1) + "%" : NA;
  const pr = total ? (picks / total * 1000).toFixed(1) + "%" : NA; // 10 jogadores por partida
  const list = ((heroAbilities[h.name] || {}).abilities || []).filter(n => n !== "generic_hidden" && !n.startsWith("special_bonus"));
  const cards = list.map(abilityCard).join("");
  $("modalBody").innerHTML = `<h2>${esc(h.localized_name).toUpperCase()}</h2>
    <p class="roles">Nome original: ${esc(h.name)} · ${val(h.attack_type)}</p>
    <div class="hero-top"><img src="${img(h.img)}" alt="${esc(h.localized_name)}">
    <div><p><b>Atributo principal:</b> <span class="attr ${ATTR[h.primary_attr]}">${ATTR[h.primary_attr] || NA}</span></p>
    <p><b>Funções:</b> ${val(h.roles)}</p><h3>ESTATÍSTICAS</h3>
    <div class="stats">${st("Força", h.base_str)}${st("Agilidade", h.base_agi)}${st("Inteligência", h.base_int)}
    ${st("Ataque", atk)}${st("Armadura", h.base_armor)}${st("Velocidade de movimento", h.move_speed)}</div></div></div>
    <div class="rates"><div class="rate">TAXA DE VITÓRIA<b>${wr}</b><small>partidas públicas</small></div>
    <div class="rate">TAXA DE ESCOLHA<b>${pr}</b><small>partidas públicas</small></div></div>
    <h2 style="margin-top:1.5rem">✨ HABILIDADES</h2><div class="abilities">${cards || NA}</div>`;
  $("modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeModal() { $("modal").classList.add("hidden"); document.body.style.overflow = ""; }
$("closeModal").onclick = closeModal;
$("modal").onclick = e => { if (e.target === $("modal")) closeModal(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ---------- Busca global ---------- */
function globalSearch() {
  const q = $("globalSearch").value.trim().toLowerCase();
  $("resultados").classList.toggle("hidden", !q);
  document.querySelector("main").classList.toggle("searching", !!q);
  $("content").classList.toggle("hidden", !!q || !heroes.length);
  if (!q) return;
  const hs = heroes.filter(h => h.localized_name.toLowerCase().includes(q));
  const is = items.filter(i => i.dname.toLowerCase().includes(q)).slice(0, 40);
  $("resHeroes").innerHTML = hs.map(heroCard).join("") || NA;
  $("resItems").innerHTML = is.map(itemCard).join("") || NA;
}
$("globalSearch").oninput = globalSearch;

/* ---------- Montar time ---------- */
const ROLES = ["Carry (pos. 1)", "Mid (pos. 2)", "Offlane (pos. 3)", "Soft Support (pos. 4)", "Hard Support (pos. 5)"];
const emptyTeam = () => ({ name: "", p: Array(5).fill(null) });
const heroById = id => heroes.find(h => h.id === id);
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
let team = emptyTeam(), teams = [], slot = 0;
try { const t = JSON.parse(localStorage.getItem("dotaTeam")); if (t && Array.isArray(t.p) && t.p.length === 5) team = t; } catch {}
try { teams = JSON.parse(localStorage.getItem("dotaTeams")) || []; } catch {}
$("tName").value = team.name || "";

let pickerInit = false;
const nextEmpty = from => { for (let k = 1; k <= 5; k++) { const i = (from + k) % 5; if (!heroById(team.p[i])) return i; } return from; };
function renderTeam() {
  if (!pickerInit) {
    pickerInit = true;
    $("pkc").innerHTML += Object.entries(ATTR).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
    $("pkq").oninput = $("pkc").onchange = drawPicker;
    const e = team.p.findIndex(id => !heroById(id)); if (e >= 0) slot = e;
  }
  $("tp").innerHTML = ROLES.map((r, i) => { const h = heroById(team.p[i]);
    return `<div class="slot${i === slot ? " on" : ""}"><button class="pk" data-slot="${i}"><small>${r}</small>${h ? `<img src="${img(h.img)}" alt="">${esc(h.localized_name)}` : `<i>+</i>Escolher`}</button>${h ? `<button class="x" data-clear="${i}" aria-label="Remover">✕</button>` : ""}</div>`; }).join("");
  $("tCount").textContent = `${team.p.filter(id => heroById(id)).length}/5 escolhidos`;
  renderSaved(); drawPicker();
}
function renderSaved() {
  $("tSaved").innerHTML = teams.length ? teams.map((t, i) => `<div class="sv"><div class="ic">${t.p.map(id => heroById(id)).filter(Boolean).map(h => `<img src="${img(h.img)}" alt="${esc(h.localized_name)}" title="${esc(h.localized_name)}">`).join("")}</div><b>${esc(t.name)}</b><button class="btn ghost" data-load="${i}">Carregar</button><button class="btn" data-md="${i}">Baixar .md</button><button class="x2" data-del="${i}" aria-label="Excluir">✕</button></div>`).join("") : '<p class="na">Nenhum time salvo ainda. Escolha os heróis e clique em "Salvar time".</p>';
}
function drawPicker() {
  $("pickFor").textContent = "→ " + ROLES[slot];
  const q = $("pkq").value.trim().toLowerCase(), a = $("pkc").value;
  $("pkg").innerHTML = heroes.filter(h => (!q || h.localized_name.toLowerCase().includes(q)) && (!a || h.primary_attr === a)).map(h => `<button class="pchip" data-pick="${h.id}"${team.p.includes(h.id) && team.p[slot] !== h.id ? " disabled" : ""}><img loading="lazy" src="${img(h.img)}" alt="">${esc(h.localized_name)}</button>`).join("") || `<p class="na">${NA}</p>`;
}
function saveCurrent() {
  if (!team.p.some(id => heroById(id))) { $("tCount").textContent = "Escolha ao menos um herói para salvar."; return; }
  const name = team.name.trim() || "Meu time", t = { name, p: [...team.p] }, k = teams.findIndex(x => x.name.toLowerCase() === name.toLowerCase());
  if (k >= 0) teams[k] = t; else teams.unshift(t);
  store("dotaTeams", teams); renderSaved();
  $("tCount").textContent = "Time salvo ✔"; setTimeout(renderTeam, 1800);
}
function exportMd(t) {
  const n = t.name.trim() || "Meu time";
  const md = `# ${n}\n\n` + ROLES.map((r, i) => { const h = heroById(t.p[i]); return `- **${r}:** ${h ? h.localized_name : "não escolhido"}`; }).join("\n") + "\n\n_Gerado no Dota 2 Database_\n";
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
  a.download = (n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "time") + ".md";
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-slot],[data-clear],[data-pick],[data-load],[data-md],[data-del]"); if (!t) return;
  const d = t.dataset;
  if (d.slot !== undefined) { slot = +d.slot; renderTeam(); }
  else if (d.clear !== undefined) { team.p[+d.clear] = null; slot = +d.clear; store("dotaTeam", team); renderTeam(); }
  else if (d.pick !== undefined) { team.p[slot] = +d.pick; slot = nextEmpty(slot); store("dotaTeam", team); renderTeam(); }
  else if (d.load !== undefined) { const s = teams[+d.load]; team = { name: s.name, p: [...s.p] }; $("tName").value = s.name; store("dotaTeam", team); renderTeam(); $("time").scrollIntoView(); }
  else if (d.md !== undefined) exportMd(teams[+d.md]);
  else if (d.del !== undefined) { teams.splice(+d.del, 1); store("dotaTeams", teams); renderSaved(); }
});
$("tName").oninput = e => { team.name = e.target.value; store("dotaTeam", team); };
$("tSave").onclick = saveCurrent;
$("tMd").onclick = () => exportMd(team);
$("tClear").onclick = () => { team = emptyTeam(); $("tName").value = ""; store("dotaTeam", team); renderTeam(); };

/* ---------- Tema e menu ---------- */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  $("themeBtn").textContent = t === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  try { localStorage.setItem("theme", t); } catch {}
}
$("themeBtn").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
let saved = "dark"; try { saved = localStorage.getItem("theme") || "dark"; } catch {}
setTheme(saved);

$("burger").onclick = () => $("nav").classList.toggle("open");
$("nav").onclick = e => {
  if (e.target.tagName !== "A") return;
  $("nav").classList.remove("open");
  $("globalSearch").value = ""; globalSearch();
};

/* ---------- Abas ---------- */
const VIEWS = ["home", "herois", "time", "favoritos", "itens"];
function show(v) {
  if (!VIEWS.includes(v)) v = "home";
  VIEWS.forEach(x => $(x).classList.toggle("on", x === v));
  document.querySelectorAll("nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === v));
  $("nav").classList.remove("open");
  scrollTo(0, 0);
}
document.addEventListener("click", e => {
  const a = e.target.closest("[data-nav]"); if (!a) return;
  e.preventDefault(); $("globalSearch").value = ""; globalSearch();
  history.replaceState(null, "", "#" + a.dataset.nav); show(a.dataset.nav);
});
window.addEventListener("hashchange", () => show(location.hash.slice(1)));
show(location.hash.slice(1));

load();
