/* REF-Genius shell — incluído no <head> de todas as páginas dos projetos.
   1) Força o tema escuro em todos os projetos (antes dos scripts deles rodarem).
   2) Injeta a barra lateral compartilhada (Início + 4 jogos). */
(function () {
  // ---- 1. Tema escuro global ----
  var THEME_KEYS = { "theme": "dark", "vdb-theme": "dark", "pokedex:theme": "dark" }; // dota+lol, valorant, pokédex
  try { for (var k in THEME_KEYS) localStorage.setItem(k, THEME_KEYS[k]); } catch (e) {}
  document.documentElement.setAttribute("data-theme", "dark");
  var P = decodeURIComponent(location.pathname), TM = /\/tcg\/(magic|pokemon|lorcana|one-piece|riftbound)\//.exec(P);
  var TCG_ID = { "magic": "magic", "pokemon": "ptcg", "lorcana": "lorcana", "one-piece": "onepiece", "riftbound": "riftbound" };
  var G = /\/dota\//.test(P) ? "dota" : /\/lol\//.test(P) ? "lol" : /\/valorant\//.test(P) ? "valorant" : /\/pokedex\//.test(P) ? "pokemon" : TM ? TCG_ID[TM[1]] : /\/steam\//.test(P) ? "steam" : /\/anime\//.test(P) ? "anime" : /\/beyblade\//.test(P) ? "beyblade" : /\/tcg\//.test(P) ? "tcg" : "";
  if (G) document.documentElement.setAttribute("data-rg", G); // permite à shell.css unificar a paleta por jogo

  // ---- 2. Sidebar (pode ser recolhida; o estado é lembrado entre páginas) ----
  var SIDE_KEY = "rg-side-collapsed";
  try { if (localStorage.getItem(SIDE_KEY) === "1") document.documentElement.classList.add("rg-collapsed"); } catch (e) {}
  var base = document.currentScript.src.replace(/shell\.js.*$/, ""); // raiz do REF-Genius
  var HOME = ["home", "⌂", "Início", "index.html", ""];
  var GAMES = [
    ["dota", "D2", "Dota 2", "dota/index.html", "/dota/"],
    ["lol", "LoL", "League of Legends", "lol/index.html", "/lol/"],
    ["pokemon", "P", "Pokémon", "pokedex/index.html", "/pokedex/"],
    ["valorant", "V", "VALORANT", "valorant/index.html", "/valorant/"]
  ];
  var TCGS = [
    ["magic", "MTG", "Magic", "tcg/magic/index.html", "/tcg/magic/"],
    ["ptcg", "PKM", "Pokémon TCG", "tcg/pokemon/index.html", "/tcg/pokemon/"],
    ["lorcana", "LOR", "Lorcana", "tcg/lorcana/index.html", "/tcg/lorcana/"],
    ["onepiece", "OP", "One Piece", "tcg/one-piece/index.html", "/tcg/one-piece/"],
    ["riftbound", "RB", "Riftbound", "tcg/riftbound/index.html", "/tcg/riftbound/"]
  ];
  var STEAM = [
    ["steam", "ST", "Minha Biblioteca", "steam/index.html", "/steam/"]
  ];
  var ANIME = [
    ["anime", "AN", "Minha Lista", "anime/index.html", "/anime/"]
  ];
  var BEYBLADE = [
    ["beyblade", "BB", "Metal Saga", "beyblade/index.html", "/beyblade/"]
  ];
  var path = decodeURIComponent(location.pathname);

  function build() {
    var b = document.body;
    b.classList.add("rg-shell");
    var item = function (i) {
      var on = i[4] && path.indexOf(i[4]) !== -1;
      return '<a class="rg-item' + (on ? " on" : "") + '" data-g="' + i[0] + '" href="' + base + i[3] + '">' +
             '<span class="rg-ico">' + ((window.RG_ICON && window.RG_ICON(i[0])) || i[1]) + "</span>" + i[2] + "</a>";
    };
    var tcgMenu = /\/tcg\/(index\.html)?$/.test(path);
    var links = item(HOME) +
      '<div class="rg-sec">GAMES</div>' + GAMES.map(item).join("") +
      '<a class="rg-sec rg-sec-link' + (tcgMenu ? " on" : "") + '" href="' + base + 'tcg/index.html">TCG</a>' + TCGS.map(item).join("") +
      '<div class="rg-sec">STEAM</div>' + STEAM.map(item).join("") +
      '<div class="rg-sec">ANIMES</div>' + ANIME.map(item).join("") +
      '<div class="rg-sec">BEYBLADE</div>' + BEYBLADE.map(item).join("");
    var side = document.createElement("aside");
    side.className = "rg-side";
    side.innerHTML = '<a class="rg-brand" href="' + base + 'index.html">REF-Genius</a><nav class="rg-nav">' + links + "</nav>";
    var scrim = document.createElement("div");
    scrim.className = "rg-scrim";
    var burger = document.createElement("button");
    burger.className = "rg-burger";
    burger.setAttribute("aria-label", "Mostrar/esconder menu");
    burger.textContent = "☰";
    var mobile = function () { return window.matchMedia("(max-width:820px)").matches; };
    burger.onclick = function () {
      if (mobile()) { b.classList.toggle("rg-open"); return; }
      var c = document.documentElement.classList.toggle("rg-collapsed");
      try { localStorage.setItem(SIDE_KEY, c ? "1" : "0"); } catch (e) {}
    };
    scrim.onclick = function () { b.classList.remove("rg-open"); };
    b.append(side, scrim, burger);
  }
  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();
