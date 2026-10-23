/* =========================================================
   search.js — Busca com debounce
   ========================================================= */

/**
 * Cria uma versão "debounced" de uma função: só executa
 * depois que o usuário parar de digitar por `delay` ms.
 */
function debounce(fn, delay = 350) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const Search = {
  init(inputEl, onSearch) {
    const debounced = debounce((value) => onSearch(value.trim().toLowerCase()), 350);
    inputEl.addEventListener('input', (e) => debounced(e.target.value));
  }
};
