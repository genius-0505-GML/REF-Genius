/* REF-Genius — menu central + perfil
   Para adicionar um novo jogo ao seletor de perfil, basta incluir uma entrada em SOURCES.
   Cada loader retorna: [{ name, image }] */

const KEY = "refgenius-profile";

const $ = id => document.getElementById(id);
const cache = {};          // jogo -> lista de personagens
let saved = null;          // profile salvo: { game, character, image }
let draft = null;          // seleção pendente (antes de Salvar)
let tab = "dota";

try { saved = JSON.parse(localStorage.getItem(KEY)); } catch {}

/* ---------- Avatar ---------- */
function paintAvatar(el, p) {
  el.innerHTML = "";
  el.classList.toggle("has", !!p);
  if (p) el.dataset.game = p.game; else delete el.dataset.game;
  if (!p) { el.textContent = "◉"; return; }
  const img = new Image();
  img.alt = p.character;
  img.onerror = () => { img.remove(); el.textContent = p.character[0]; };
  img.src = p.image;
  el.appendChild(img);
}

/* ---------- Sidebar mobile ---------- */
$("burger").onclick = () => {
  if (matchMedia("(max-width:820px)").matches) return document.body.classList.toggle("menu-open");
  const c = document.documentElement.classList.toggle("rg-collapsed");
  try { localStorage.setItem("rg-side-collapsed", c ? "1" : "0"); } catch {}
};
$("scrim").onclick = () => document.body.classList.remove("menu-open");

/* ---------- Modal de perfil ---------- */
const modal = $("modal");

function openModal() {
  draft = saved ? { ...saved } : null;
  tab = saved ? saved.game : "dota";
  renderTabs(); renderPreview(); loadTab();
  modal.hidden = false;
}
function closeModal() { modal.hidden = true; }

$("profileBtn").onclick = openModal;
$("closeModal").onclick = closeModal;
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function renderTabs() {
  $("tabs").innerHTML = Object.entries(SOURCES).map(([k, s]) =>
    `<button class="tab ${k === tab ? "on" : ""}" data-game="${k}">${s.label}</button>`).join("");
  $("tabs").querySelectorAll(".tab").forEach(b => b.onclick = () => {
    tab = b.dataset.game; $("search").value = ""; renderTabs(); loadTab();
  });
}

function renderPreview() {
  paintAvatar($("previewAvatar"), draft);
  $("previewName").textContent = draft ? `${draft.character} · ${SOURCES[draft.game].label}` : "Nenhum personagem";
  $("saveBtn").disabled = !draft;
}

async function loadTab() {
  const box = $("chars");
  box.dataset.game = tab;
  if (!cache[tab]) {
    box.innerHTML = `<p class="msg">Carregando...</p>`;
    try { cache[tab] = await SOURCES[tab].load(); }
    catch {
      box.innerHTML = `<p class="msg">Não foi possível carregar.<br><button class="tab" id="retry">Tentar novamente</button></p>`;
      $("retry").onclick = loadTab;
      return;
    }
  }
  renderChars();
}

function renderChars() {
  const q = $("search").value.trim().toLowerCase();
  const list = (cache[tab] || []).filter(c => c.name.toLowerCase().includes(q));
  const box = $("chars");
  if (!list.length) { box.innerHTML = `<p class="msg">Nada encontrado.</p>`; return; }
  box.innerHTML = "";
  list.forEach(c => {
    const b = document.createElement("button");
    b.className = "ch" + (draft && draft.game === tab && draft.character === c.name ? " sel" : "");
    b.dataset.game = tab;
    b.title = c.name;
    b.innerHTML = `<img loading="lazy" alt="${c.name}" src="${c.image}">`;
    b.onclick = () => {
      draft = { game: tab, character: c.name, image: c.image };
      box.querySelectorAll(".ch.sel").forEach(x => x.classList.remove("sel"));
      b.classList.add("sel");
      renderPreview();
    };
    box.appendChild(b);
  });
}
$("search").oninput = renderChars;

$("saveBtn").onclick = () => {
  if (!draft) return;
  saved = draft;
  try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch {}
  paintAvatar($("topAvatar"), saved);
if (location.hash === "#perfil") openModal();
  closeModal();
};
$("clearBtn").onclick = () => {
  saved = draft = null;
  try { localStorage.removeItem(KEY); } catch {}
  paintAvatar($("topAvatar"), null);
  renderPreview(); renderChars();
};

paintAvatar($("topAvatar"), saved);
if (location.hash === "#perfil") openModal();
