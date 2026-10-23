/* =========================================================
   app.js — Inicialização e orquestração da página inicial
   ========================================================= */

const PAGE_SIZE = 24;
const CONCURRENCY = 8;

const App = {
  masterList: [],
  filteredList: [],   // lista básica {id,name} após filtros
  fullDataCache: new Map(), // id -> dados completos do /pokemon/{id}
  offset: 0,
  showingFavorites: false,
  els: {},

  async init() {
    this.cacheDom();
    this.bindStaticEvents();
    this.renderTypeChips();
    this.renderGenChips();
    this.updateFavCount();

    window.addEventListener('hashchange', () => this.route());
    this.route();
  },

  /* ---------- Views: home (grade de ícones) | list (filtros + cards) ---------- */
  route() {
    const h = location.hash.slice(1);
    if (h === 'pokemon' || h === 'favoritos') {
      this.showingFavorites = h === 'favoritos';
      this.fromHome = false;
      this.setView('list');
      this.setActiveNav(h === 'favoritos' ? 'favorites' : 'pokemon');
      this.refilterAndRender();
    } else {
      this.setView('home');
      this.setActiveNav('home');
    }
  },

  setView(view) {
    this.view = view;
    this.els.homeView.hidden = view !== 'home';
    this.els.listView.hidden = view !== 'list';
    if (view === 'home') this.ensureHome();
    window.scrollTo(0, 0);
  },

  async ensureHome() {
    if (this.homeReady) return;
    const g = this.els.homeGrid;
    g.innerHTML = '<p class="home-msg">Carregando...</p>';
    try {
      if (!this.masterList.length) this.masterList = await PokeAPI.getMasterList();
      g.innerHTML = this.masterList.map(p =>
        `<a class="pchip" href="pokemon.html?id=${p.id}" title="${capitalize(p.name)}">` +
        `<img loading="lazy" src="${PokeAPI.spriteUrl(p.id)}" alt="" onerror="this.onerror=null;this.src='assets/icons/placeholder.svg'">` +
        `<small>#${String(p.id).padStart(3, '0')}</small>${capitalize(p.name)}</a>`).join('');
      this.homeReady = true;
    } catch (err) {
      console.error(err);
      g.innerHTML = '<p class="home-msg">Não foi possível carregar os Pokémon.<br><button class="btn btn--secondary" id="homeRetry">Tentar novamente</button></p>';
      document.getElementById('homeRetry').onclick = () => this.ensureHome();
    }
  },

  cacheDom() {
    this.els.grid = document.getElementById('grid');
    this.els.loadMoreBtn = document.getElementById('loadMoreBtn');
    this.els.loadingState = document.getElementById('loadingState');
    this.els.emptyState = document.getElementById('emptyState');
    this.els.errorState = document.getElementById('errorState');
    this.els.resultsInfo = document.getElementById('resultsInfo');
    this.els.retryBtn = document.getElementById('retryBtn');
    this.els.searchInput = document.getElementById('searchInput');
    this.els.sortSelect = document.getElementById('sortSelect');
    this.els.typeFilters = document.getElementById('typeFilters');
    this.els.genFilters = document.getElementById('genFilters');
    this.els.themeToggle = document.getElementById('themeToggle');
    this.els.navFavorites = document.getElementById('navFavorites');
    this.els.favCount = document.getElementById('favCount');
    this.els.homeView = document.getElementById('homeView');
    this.els.listView = document.getElementById('listView');
    this.els.homeGrid = document.getElementById('homeGrid');
  },

  bindStaticEvents() {
    Search.init(this.els.searchInput, (term) => {
      Filters.state.search = term;
      this.showingFavorites = false;
      if (term && this.view === 'home') {
        this.fromHome = true;
        history.replaceState(null, '', '#pokemon');
        this.setView('list');
      } else if (!term && this.fromHome) {
        this.fromHome = false;
        history.replaceState(null, '', '#home');
        this.setView('home');
        this.setActiveNav('home');
        return;
      }
      this.setActiveNav('pokemon');
      this.refilterAndRender();
    });

    this.els.sortSelect.addEventListener('change', (e) => {
      Filters.state.sort = e.target.value;
      this.refilterAndRender();
    });

    this.els.retryBtn.addEventListener('click', () => this.refilterAndRender());

    this.els.loadMoreBtn.addEventListener('click', () => this.renderNextPage());

    this.els.themeToggle.addEventListener('click', () => {
      const t = Theme.toggle();
      this.els.themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
    });
    this.els.themeToggle.textContent = Theme.get() === 'dark' ? '☀️' : '🌙';

    this.els.navFavorites.addEventListener('click', () => {
      if (location.hash === '#favoritos') this.route(); else location.hash = '#favoritos';
    });
  },

  setActiveNav(which) {
    document.querySelectorAll('.nav__link').forEach(el => el.classList.remove('nav__link--active'));
    const el = document.querySelector(`.nav__link[data-view="${which}"]`);
    if (el) el.classList.add('nav__link--active');
  },

  renderTypeChips() {
    ALL_TYPES.forEach(type => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.dataset.type = type;
      btn.textContent = capitalize(type);
      btn.style.setProperty('--chip-color', TYPE_COLORS[type]);
      btn.addEventListener('click', () => {
        Filters.state.type = type;
        this.setActiveChip(this.els.typeFilters, btn);
        this.showingFavorites = false;
        this.refilterAndRender();
      });
      this.els.typeFilters.appendChild(btn);
    });
    this.els.typeFilters.querySelector('[data-type="all"]').addEventListener('click', (e) => {
      Filters.state.type = 'all';
      this.setActiveChip(this.els.typeFilters, e.target);
      this.refilterAndRender();
    });
  },

  renderGenChips() {
    const romans = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX' };
    Object.keys(PokeAPI.GENERATION_RANGES).forEach(gen => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.dataset.gen = gen;
      btn.textContent = romans[gen];
      btn.addEventListener('click', () => {
        Filters.state.generation = gen;
        this.setActiveChip(this.els.genFilters, btn);
        this.showingFavorites = false;
        this.refilterAndRender();
      });
      this.els.genFilters.appendChild(btn);
    });
    this.els.genFilters.querySelector('[data-gen="all"]').addEventListener('click', (e) => {
      Filters.state.generation = 'all';
      this.setActiveChip(this.els.genFilters, e.target);
      this.refilterAndRender();
    });
  },

  setActiveChip(container, activeBtn) {
    container.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
    activeBtn.classList.add('chip--active');
  },

  async refilterAndRender() {
    this.showState('loading');
    this.offset = 0;
    this.els.grid.innerHTML = '';

    try {
      if (!this.masterList.length) this.masterList = await PokeAPI.getMasterList();
      let base = this.showingFavorites
        ? this.masterList.filter(p => Favorites.isFavorite(p.id))
        : await Filters.applyBasicFilters(this.masterList);

      base = Filters.sortBasic(base);

      if (Filters.needsFullData()) {
        this.showState('loading');
        const fullData = await this.fetchAllFullData(base.map(p => p.id));
        const sorted = Filters.sortByStat(fullData, Filters.state.sort);
        this.filteredList = sorted.map(p => ({ id: p.id, name: p.name }));
        sorted.forEach(p => this.fullDataCache.set(p.id, p));
      } else {
        this.filteredList = base;
      }

      if (this.filteredList.length === 0) {
        this.showState('empty');
        return;
      }

      this.els.resultsInfo.hidden = false;
      this.els.resultsInfo.textContent = `${this.filteredList.length} Pokémon encontrado(s)`;
      this.showState('success');
      await this.renderNextPage();
    } catch (err) {
      console.error(err);
      this.showState('error');
    }
  },

  async fetchAllFullData(ids) {
    const results = [];
    for (let i = 0; i < ids.length; i += CONCURRENCY) {
      const chunk = ids.slice(i, i + CONCURRENCY);
      const chunkResults = await Promise.all(chunk.map(id =>
        this.fullDataCache.has(id) ? this.fullDataCache.get(id) : PokeAPI.getPokemon(id)
      ));
      results.push(...chunkResults);
    }
    return results;
  },

  async renderNextPage() {
    const slice = this.filteredList.slice(this.offset, this.offset + PAGE_SIZE);
    if (slice.length === 0) {
      this.els.loadMoreBtn.hidden = true;
      return;
    }

    this.els.loadMoreBtn.hidden = true;
    this.els.loadMoreBtn.textContent = 'Carregando...';

    const chunks = [];
    for (let i = 0; i < slice.length; i += CONCURRENCY) {
      chunks.push(slice.slice(i, i + CONCURRENCY));
    }

    for (const chunk of chunks) {
      const dataList = await Promise.all(chunk.map(async (p) => {
        if (this.fullDataCache.has(p.id)) return this.fullDataCache.get(p.id);
        try {
          const data = await PokeAPI.getPokemon(p.id);
          this.fullDataCache.set(p.id, data);
          return data;
        } catch (err) {
          return null;
        }
      }));
      dataList.filter(Boolean).forEach(data => this.els.grid.appendChild(this.buildCard(data)));
    }

    this.offset += slice.length;
    this.els.loadMoreBtn.textContent = 'Carregar mais';
    this.els.loadMoreBtn.hidden = this.offset >= this.filteredList.length;
  },

  buildCard(pokemon) {
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0;

    const isFav = Favorites.isFavorite(pokemon.id);
    const img = pokemon.sprites?.other?.['official-artwork']?.front_default
      || pokemon.sprites?.front_default
      || 'assets/icons/placeholder.svg';

    card.innerHTML = `
      <div class="card__top">
        <span class="card__number">#${String(pokemon.id).padStart(3, '0')}</span>
        <button class="card__fav ${isFav ? 'card__fav--active' : ''}" aria-label="Favoritar">${isFav ? '♥' : '♡'}</button>
      </div>
      <h3 class="card__name">${capitalize(pokemon.name)}</h3>
      <div class="card__image-wrap">
        <img class="card__image" src="${img}" alt="${pokemon.name}" loading="lazy"
             onerror="this.onerror=null;this.src='${pokemon.sprites?.front_default || 'assets/icons/placeholder.svg'}';">
      </div>
      <div class="card__types">
        ${pokemon.types.map(t => `<span class="type-badge" style="--type-color:${TYPE_COLORS[t.type.name] || '#999'}">${capitalize(t.type.name)}</span>`).join('')}
      </div>
    `;

    card.querySelector('.card__fav').addEventListener('click', (e) => {
      e.stopPropagation();
      const nowFav = Favorites.toggle(pokemon.id);
      e.currentTarget.textContent = nowFav ? '♥' : '♡';
      e.currentTarget.classList.toggle('card__fav--active', nowFav);
      this.updateFavCount();
      if (this.showingFavorites && !nowFav) card.remove();
    });

    const goToDetails = () => { window.location.href = `pokemon.html?id=${pokemon.id}`; };
    card.addEventListener('click', goToDetails);
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter') goToDetails(); });

    return card;
  },

  updateFavCount() {
    this.els.favCount.textContent = Favorites.count();
  },

  showState(state) {
    this.els.loadingState.hidden = state !== 'loading';
    this.els.emptyState.hidden = state !== 'empty';
    this.els.errorState.hidden = state !== 'error';
    this.els.grid.hidden = state !== 'success';
    if (state !== 'success') {
      this.els.resultsInfo.hidden = true;
      this.els.loadMoreBtn.hidden = true;
    }
  }
};

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ') : '';
}

document.addEventListener('DOMContentLoaded', () => App.init());
