/* =========================================================
   favorites.js — Persistência de favoritos e tema (LocalStorage)
   ========================================================= */

const STORAGE_KEYS = {
  FAVORITES: 'pokedex:favorites',
  THEME: 'pokedex:theme'
};

const Favorites = {
  getAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Erro ao ler favoritos do LocalStorage:', err);
      return [];
    }
  },

  isFavorite(id) {
    return this.getAll().includes(id);
  },

  toggle(id) {
    const favs = this.getAll();
    const idx = favs.indexOf(id);
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push(id);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    } catch (err) {
      console.error('Erro ao salvar favoritos no LocalStorage:', err);
    }
    return favs.includes(id);
  },

  count() {
    return this.getAll().length;
  }
};

const Theme = {
  KEY: STORAGE_KEYS.THEME,

  get() {
    try {
      return localStorage.getItem(this.KEY) || 'light';
    } catch (err) {
      return 'light';
    }
  },

  set(theme) {
    try {
      localStorage.setItem(this.KEY, theme);
    } catch (err) {
      console.error('Erro ao salvar tema:', err);
    }
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggle() {
    const current = this.get();
    const next = current === 'dark' ? 'light' : 'dark';
    this.set(next);
    return next;
  },

  init() {
    document.documentElement.setAttribute('data-theme', this.get());
  }
};

/* Aplica o tema o mais cedo possível para evitar "flash" de tela clara/escura */
Theme.init();
