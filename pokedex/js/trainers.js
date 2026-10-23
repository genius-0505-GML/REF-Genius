/* =========================================================
   trainers.js — Seção Treinadores (Gym Leaders, Elite Four, Campeão)

   Fluxo: Regiões → Região (+ jogo e categoria) → Treinador (modal)
   Rotas (hash):  #<regiao>/<jogo>/<id-do-treinador>
                  ex.: #hoenn/emerald/sidney-emerald

   Dados:
   - data/trainers/regions.js  → índice leve (regiões, jogos, categorias)
   - data/trainers/<regiao>.js → times; carregado SÓ quando a região é aberta
   Pokémon (tipos/sprite) vêm da PokéAPI via PokeAPI.getPokemon (com cache);
   o treinador guarda apenas { pokemon, level, moves?, item? }.
   ========================================================= */

const TrainersPage = {
  regions: window.TRAINER_REGIONS || [],
  categories: window.TRAINER_CATEGORIES || [],
  loaders: new Map(),          // regiao -> Promise (evita carregar duas vezes)
  state: { region: null, game: null, category: 'all' },
  visible: [],                 // treinadores exibidos, na ordem da tela (para anterior/próximo)
  renderedKey: '',
  openedInApp: false,
  lastFocus: null,
  routeToken: 0,
  els: {},

  init() {
    ['themeToggle', 'crumbs', 'heroTitle', 'heroSub', 'regionsView', 'regionCards', 'regionView',
      'regionHeader', 'gameFilters', 'categoryFilters', 'loadingState', 'errorState', 'retryBtn',
      'emptyState', 'trainerSections', 'trainerModal', 'modalBody'
    ].forEach(id => { this.els[id] = document.getElementById(id); });

    this.bindEvents();
    this.route();
  },

  bindEvents() {
    const e = this.els;

    e.themeToggle.textContent = Theme.get() === 'dark' ? '☀️' : '🌙';
    e.themeToggle.addEventListener('click', () => {
      e.themeToggle.textContent = Theme.toggle() === 'dark' ? '☀️' : '🌙';
    });

    window.addEventListener('hashchange', () => this.route());
    e.retryBtn.addEventListener('click', () => { this.loaders.delete(this.state.region); this.route(true); });

    e.regionCards.addEventListener('click', (ev) => {
      const card = ev.target.closest('.region-card');
      if (card) location.hash = card.dataset.region;
    });

    e.gameFilters.addEventListener('click', (ev) => {
      const chip = ev.target.closest('.chip');
      if (!chip || chip.disabled) return;
      location.hash = `${this.state.region}/${chip.dataset.game}`;
    });

    e.categoryFilters.addEventListener('click', (ev) => {
      const chip = ev.target.closest('.chip');
      if (!chip) return;
      this.state.category = chip.dataset.cat;
      this.renderFilters();
      this.renderSections();
    });

    e.trainerSections.addEventListener('click', (ev) => {
      const card = ev.target.closest('.tr-card');
      if (!card) return;
      this.lastFocus = card;
      this.openedInApp = true;
      location.hash = `${this.state.region}/${this.state.game}/${card.dataset.id}`;
    });

    e.trainerModal.addEventListener('click', (ev) => {
      if (ev.target.closest('[data-close]')) return this.closeModal();
      const nav = ev.target.closest('[data-nav]');
      if (nav && !nav.disabled) {
        location.replace(`#${this.state.region}/${this.state.game}/${nav.dataset.nav}`);
      }
    });

    document.addEventListener('keydown', (ev) => {
      if (e.trainerModal.hidden) return;
      if (ev.key === 'Escape') this.closeModal();
      else if (ev.key === 'ArrowLeft') e.trainerModal.querySelector('[data-dir="prev"]:not([disabled])')?.click();
      else if (ev.key === 'ArrowRight') e.trainerModal.querySelector('[data-dir="next"]:not([disabled])')?.click();
    });
  },

  /* ---------- Dados (lazy por região) ---------- */

  /** Carrega data/trainers/<regiao>.js uma única vez. Ex.: loadTrainers('hoenn') */
  loadTrainers(regionId) {
    if (this.loaders.has(regionId)) return this.loaders.get(regionId);
    const load = (src) => new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
      document.head.appendChild(s);
    });
    const p = load(`data/trainers/${regionId}.js`)
      .then(() => [].concat((window.TRAINER_DATA && window.TRAINER_DATA[regionId]) || []));
    this.loaders.set(regionId, p);
    p.catch(() => this.loaders.delete(regionId));
    return p;
  },

  regionById(id) { return this.regions.find(r => r.id === id); },
  readyGames(region) { return region.games.filter(g => g.ready); },
  gameLabel(region, gameId) { return (region.games.find(g => g.id === gameId) || {}).label || gameId; },

  /* ---------- Perfil / imagem do treinador ---------- */

  /** Perfil (sprite, cidade, classe, bio) a partir de data/trainers/profiles.js */
  profile(t) { return (window.TRAINER_PROFILES || {})[window.trainerKey(t.name)] || {}; },

  typeColor(t) { return TYPE_COLORS[(t.specialty || '').toLowerCase()] || '#8b93a7'; },

  /** Avatar gerado (iniciais + cor do tipo) — usado quando a imagem não carrega. */
  avatarFallback(t) {
    const c = this.typeColor(t);
    const words = String(t.name).replace(/&/g, ' ').split(/\s+/).filter(w => /[A-Za-z]/.test(w) && !/^(Lt|Prof|Professor)\.?$/i.test(w));
    const ini = (words.length > 1 ? words[0][0] + words[1][0] : (words[0] || '?').slice(0, 2)).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="#1b1f2e"/></linearGradient></defs><rect width="96" height="96" fill="url(#g)"/><circle cx="48" cy="38" r="15" fill="rgba(255,255,255,.22)"/><path d="M18 96c2-22 14-32 30-32s28 10 30 32z" fill="rgba(255,255,255,.22)"/><text x="48" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="26" fill="#fff">${ini}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  },

  /** HTML do retrato. Se a imagem falhar, troca pelo avatar gerado (sem ícone quebrado). */
  portraitHTML(t, cls) {
    const pr = this.profile(t);
    const fb = this.avatarFallback(t);
    const src = pr.s ? `https://play.pokemonshowdown.com/sprites/trainers/${pr.s}.png` : fb;
    return `<span class="tr-portrait ${cls || ''}" style="--tc:${this.typeColor(t)}"><img src="${src}" data-fb="${esc(fb)}"
      alt="${esc(t.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"
      onerror="if(this.dataset.fb&&this.src!==this.dataset.fb){this.src=this.dataset.fb}else{this.onerror=null}"></span>`;
  },

  /** Título da categoria (Alola não tem ginásios: são Kahunas) */
  catTitle(cat, regionId) {
    if (regionId === 'alola' && cat.id === 'gym-leader') return 'Kahunas · Grand Trials';
    return cat.title;
  },


  typeLabel(t) { return /^mixed$/i.test(t.specialty) ? 'Time variado' : `${t.specialty} Type`; },

  size(t) { return t.team.length; },

  /** Níveis do time (ou null quando não há nível cadastrado). */
  levelInfo(t) {
    const lv = t.team.map(m => m.level).filter(n => typeof n === 'number');
    if (!lv.length) return null;
    const avg = Math.round(lv.reduce((a, b) => a + b, 0) / lv.length);
    return { min: Math.min(...lv), max: Math.max(...lv), avg };
  },
  lvText(lv) { return lv.min === lv.max ? lv.max : `${lv.min}–${lv.max}`; },

  /** Onde o treinador é enfrentado (cidade/local). */
  placeText(t, pr) { return pr.c || ''; },

  sourceNote(t) {
    const src = t.source || '';
    if (/^https?:\/\//.test(src)) return `Referência: <a href="${esc(src)}" target="_blank" rel="noopener">Serebii.net</a>`;
    return src ? 'Times a conferir no <a href="https://www.serebii.net" target="_blank" rel="noopener">Serebii.net</a>' : '';
  },

  /* ---------- Roteamento ---------- */

  async route(force) {
    const token = ++this.routeToken;
    const [regionId, gameParam, trainerId] = decodeURIComponent(location.hash.slice(1)).split('/');
    const region = this.regionById(regionId);

    if (!region) { this.state.region = null; this.closeModal(true); return this.showRegions(); }

    const ready = this.readyGames(region);
    const game = gameParam && (gameParam === 'all' || region.games.some(g => g.id === gameParam))
      ? gameParam : (ready[0] ? ready[0].id : 'all');

    const key = `${region.id}|${game}`;
    const regionChanged = this.state.region !== region.id;
    if (regionChanged) this.state.category = 'all';
    this.state.region = region.id;
    this.state.game = game;

    this.showRegionShell(region);

    if (force || regionChanged || this.renderedKey !== key) {
      this.renderedKey = '';
      this.renderFilters();
      this.els.trainerSections.innerHTML = '';
      this.els.errorState.hidden = true;
      this.els.emptyState.hidden = true;

      if (!ready.length) {
        this.data = [];
      } else {
        this.els.loadingState.hidden = false;
        try {
          this.data = await this.loadTrainers(region.id);
        } catch (err) {
          if (token !== this.routeToken) return;
          this.els.loadingState.hidden = true;
          this.els.errorState.hidden = false;
          return;
        }
        if (token !== this.routeToken) return;     // o usuário já navegou para outro lugar
        this.els.loadingState.hidden = true;
      }
      this.renderedKey = key;
      this.renderHeader(region);
      this.renderSections();
    }

    // Modal (se a URL aponta para um treinador)
    const t = trainerId && this.visible.find(x => x.id === trainerId);
    if (t) this.openModal(t); else this.closeModal(true);
  },

  /* ---------- Tela 1: regiões ---------- */

  showRegions() {
    const e = this.els;
    e.regionView.hidden = true;
    e.regionsView.hidden = false;
    e.heroTitle.parentElement.hidden = false;
    e.crumbs.innerHTML = '<a href="index.html">← Pokédex</a>';
    document.title = 'Pokédex — Treinadores';

    e.regionCards.innerHTML = this.regions.map((r, i) => {
      const ready = this.readyGames(r).length;
      const meta = ready ? `${ready} ${ready > 1 ? 'jogos disponíveis' : 'jogo disponível'}` : 'Em breve';
      return `<button class="region-card${ready ? '' : ' region-card--soon'}" data-region="${r.id}"
        style="--c1:${r.colors[0]};--c2:${r.colors[1]};animation-delay:${i * 30}ms">
        <span class="region-card__gen">${r.gen}</span>
        <span class="region-card__name">${r.name}</span>
        <span class="region-card__meta">${meta}</span>
      </button>`;
    }).join('');
  },

  /* ---------- Tela 2: região ---------- */

  showRegionShell(region) {
    const e = this.els;
    e.regionsView.hidden = true;
    e.regionView.hidden = false;
    e.heroTitle.parentElement.hidden = true;
    e.crumbs.innerHTML = '<a href="#">← Regiões</a>';
    document.title = `Pokédex — Treinadores de ${region.name}`;
  },

  renderHeader(region) {
    const list = this.currentList();
    const n = (cat) => new Set(list.filter(t => t.category === cat).map(t => `${t.game}|${t.order}`)).size;
    const game = this.state.game === 'all' ? 'Todos os jogos' : `Pokémon ${this.gameLabel(region, this.state.game)}`;
    this.els.regionHeader.style.setProperty('--c1', region.colors[0]);
    this.els.regionHeader.style.setProperty('--c2', region.colors[1]);
    this.els.regionHeader.innerHTML = `
      <div>
        <h2 class="region-header__name">${region.name.toUpperCase()}</h2>
        <p class="region-header__sub">${game}</p>
      </div>
      <div class="region-header__stats">
        ${[['gym-leader', region.id === 'alola' && this.state.game === 'sun-moon' ? 'Kahunas' : 'Ginásios', 'Ginásio'],
           ['elite-four', 'Elite Four', 'Elite Four'], ['champion', 'Campeões', 'Campeão']]
          .filter(([cat]) => n(cat) > 0)
          .map(([cat, plural, single]) => `<div><strong>${n(cat)}</strong><span>${n(cat) === 1 && cat !== 'gym-leader' ? single : plural}</span></div>`).join('')}
      </div>`;
  },

  renderFilters() {
    const region = this.regionById(this.state.region);
    if (!region) return;
    const { game, category } = this.state;

    const gameChips = [`<button class="chip${game === 'all' ? ' chip--active' : ''}" data-game="all">Todos</button>`]
      .concat(region.games.map(g => g.ready
        ? `<button class="chip${game === g.id ? ' chip--active' : ''}" data-game="${g.id}">${g.label}</button>`
        : `<button class="chip" data-game="${g.id}" disabled title="Ainda não cadastrado">${g.label}<small>em breve</small></button>`));
    this.els.gameFilters.innerHTML = gameChips.join('');

    this.els.categoryFilters.innerHTML =
      [`<button class="chip${category === 'all' ? ' chip--active' : ''}" data-cat="all">Todos</button>`]
        .concat(this.categories.map(c =>
          `<button class="chip${category === c.id ? ' chip--active' : ''}" data-cat="${c.id}">${c.filter}</button>`)).join('');
  },

  /** Treinadores do jogo selecionado (ou de todos), ordenados por jogo e depois pela ordem de batalha. */
  currentList() {
    const region = this.regionById(this.state.region);
    const gameIdx = (id) => region.games.findIndex(g => g.id === id);
    return (this.data || [])
      .filter(t => this.state.game === 'all' || t.game === this.state.game)
      .sort((a, b) => gameIdx(a.game) - gameIdx(b.game) || a.order - b.order);
  },

  renderSections() {
    const region = this.regionById(this.state.region);
    const list = this.currentList();
    const showGame = this.state.game === 'all' && this.readyGames(region).length > 1;
    this.visible = [];
    const html = [];

    this.categories.forEach(cat => {
      if (this.state.category !== 'all' && this.state.category !== cat.id) return;
      const items = list.filter(t => t.category === cat.id);
      if (!items.length) return;
      this.visible.push(...items);
      html.push(`<section class="tr-section" aria-label="${this.catTitle(cat, region.id)}">
        <h2 class="tr-section__title">${this.catTitle(cat, region.id)}<span class="tr-section__count">${items.length}</span></h2>
        <div class="tr-grid">${items.map((t, i) => this.cardHTML(t, i, showGame, region)).join('')}</div>
      </section>`);
    });

    this.els.trainerSections.innerHTML = html.join('');

    const empty = this.els.emptyState;
    if (!html.length) {
      const ready = this.readyGames(region).length;
      empty.innerHTML = ready
        ? '<p class="state-panel__title">Nenhum treinador nesta combinação de filtros.</p>'
        : `<p class="state-panel__title">Os treinadores de ${region.name} ainda não foram cadastrados.</p>
           <p>Adicione os times em <code>data/trainers/${region.id}.js</code> e marque o jogo como <code>ready: true</code> em <code>data/trainers/regions.js</code>.</p>`;
      empty.hidden = false;
    } else {
      empty.hidden = true;
    }
  },

  roleLabel(t) {
    if (t.category === 'elite-four') return `Elite Four #${t.order}`;
    if (t.category === 'champion') return 'Champion';
    if (t.region === 'alola') return `Kahuna · Ilha ${t.order}`;
    return t.badge ? `<span class="tr-card__badge">${esc(t.badge)}</span>` : 'Gym Leader';
  },

  cardHTML(t, i, showGame, region) {
    const color = this.typeColor(t);
    const num = String(t.order).padStart(2, '0');
    const pr = this.profile(t);
    const lv = this.levelInfo(t);
    const place = this.placeText(t, pr);
    const countText = `${t.team.length} Pokémon${lv ? ` · Lv. ${this.lvText(lv)}` : ''}`;
    return `<button class="tr-card" data-id="${esc(t.id)}" style="--tc:${color};animation-delay:${Math.min(i, 12) * 30}ms">
      ${t.category !== 'champion' ? `<span class="tr-card__order">${num}</span>` : ''}
      ${showGame ? `<span class="tr-card__game">${esc(this.gameLabel(region, t.game))}</span>` : ''}
      ${this.portraitHTML(t, 'tr-portrait--card')}
      <h3 class="tr-card__name">${esc(t.name)}</h3>
      ${pr.cl ? `<span class="tr-card__class">${esc(pr.cl)}</span>` : ''}
      ${t.variant ? `<span class="tr-card__variant">${esc(t.variant)}</span>` : ''}
      <span class="type-badge" style="--type-color:${color}">${esc(this.typeLabel(t))}</span>
      <span class="tr-card__role">${this.roleLabel(t)}</span>
      ${place ? `<span class="tr-card__city">📍 ${esc(place)}</span>` : ''}
      <span class="tr-card__count">${countText}${t.battle === 'double' || t.duo ? ' · <span class="tr-tag">Double</span>' : ''}</span>
    </button>`;
  },

  /* ---------- Modal do treinador ---------- */

  openModal(t) {
    const region = this.regionById(t.region);
    const color = this.typeColor(t);
    const pr = this.profile(t);
    const lv = this.levelInfo(t);
    const place = this.placeText(t, pr);
    const idx = this.visible.findIndex(x => x.id === t.id);
    const prev = this.visible[idx - 1], next = this.visible[idx + 1];

    const role = t.category === 'elite-four' ? `Elite Four #${t.order}`
      : t.category === 'champion' ? 'Champion'
      : t.region === 'alola' ? `Kahuna · Ilha ${t.order}`
      : `Gym Leader #${t.order}`;
    const roleFull = role;

    const sourceNote = this.sourceNote(t);

    this.els.modalBody.innerHTML = `
      <header class="tm-head" style="--tc:${color}">
        <div class="tm-head__ctx">${esc(region.name)}<span>Pokémon ${esc(this.gameLabel(region, t.game))}</span></div>
        ${this.portraitHTML(t, 'tr-portrait--modal')}
        <h2 class="tm-head__name" id="modalName">${esc(t.name)}</h2>
        <div class="tm-head__role">${roleFull}${t.badge ? ' · ' + esc(t.badge) : ''}${pr.cl ? ' · ' + esc(pr.cl) : ''}</div>
        ${place ? `<div class="tm-head__city">📍 ${esc(place)}</div>` : ''}
        ${t.variant ? `<div class="tm-head__variant">${esc(t.variant)}</div>` : ''}
        <div class="tm-head__tags">
          <span class="type-badge type-badge--lg" style="--type-color:${color}">${esc(this.typeLabel(t))}</span>
          ${t.battle === 'double' ? '<span class="tr-tag">Double Battle</span>' : ''}
          ${t.duo ? `<span class="tr-tag">Pode ser batalha dupla com ${esc(t.duo)}</span>` : ''}
          <span class="tr-tag">${t.team.length} Pokémon</span>
          ${lv ? `<span class="tr-tag">Lv. ${this.lvText(lv)} · média ${lv.avg}</span>` : ''}
        </div>
        ${pr.b ? `<p class="tm-head__bio">${esc(pr.b)}</p>` : ''}
        <div class="tm-cover" id="tmCover" aria-label="Tipos do time"></div>
      </header>
      <ol class="tm-team">${t.team.map((m, i) => this.memberHTML(m, i, i === t.team.length - 1 && t.team.length > 1)).join('')}</ol>
      ${sourceNote ? `<p class="tm-source">${sourceNote}</p>` : ''}
      <footer class="tm-nav">
        <button class="btn btn--secondary" data-dir="prev" ${prev ? `data-nav="${esc(prev.id)}"` : 'disabled'}>← ${prev ? esc(prev.name) : 'Anterior'}</button>
        <button class="btn btn--secondary" data-dir="next" ${next ? `data-nav="${esc(next.id)}"` : 'disabled'}>${next ? esc(next.name) : 'Próximo'} →</button>
      </footer>`;

    const wasHidden = this.els.trainerModal.hidden;
    this.els.trainerModal.hidden = false;
    document.body.classList.add('tr-lock');
    if (wasHidden) this.els.trainerModal.querySelector('.tr-modal__dialog').focus();
    this.els.trainerModal.scrollTop = 0;

    // Resolve tipos e sprite de cada Pokémon pela Pokédex (cache em api.js), em paralelo
    const token = this.routeToken;
    Promise.all(t.team.map((m, i) => this.fillMember(t, m, this.els.modalBody.querySelector(`[data-pos="${i}"]`))))
      .then(all => this.renderCoverage(all, token, t));
  },

  /** Resumo de tipos do time (quais tipos aparecem e quantas vezes). */
  renderCoverage(all, token, t) {
    const box = document.getElementById('tmCover');
    if (!box || !box.isConnected || this.routeToken !== token) return;
    const count = {};
    all.forEach(types => (types || []).forEach(n => { count[n] = (count[n] || 0) + 1; }));
    const entries = Object.entries(count).sort((a, b) => b[1] - a[1]);
    if (!entries.length) return;
    box.innerHTML = '<span class="tm-cover__label">Tipos do time</span>' + entries.map(([n, c]) =>
      `<span class="type-badge" style="--type-color:${TYPE_COLORS[n] || '#999'}">${n}${c > 1 ? ` ×${c}` : ''}</span>`).join('');
  },

  memberHTML(m, i, isAce) {
    const extra = [];
    if (m.moves && m.moves.length) extra.push(`<b>Golpes:</b> ${m.moves.map(esc).join(' · ')}`);
    if (m.ability) extra.push(`<b>Habilidade:</b> ${esc(m.ability)}`);
    if (m.item && !/^no item$/i.test(m.item)) extra.push(`<b>Item:</b> ${esc(m.item)}`);
    const tags = [];
    if (isAce) tags.push('<span class="tr-tag tr-tag--ace">Ás</span>');
    if (m.gimmick) tags.push(`<span class="tr-tag tr-tag--gim">${esc(m.gimmick)}</span>`);
    return `<li class="tm-mon" data-pos="${i}" style="animation-delay:${i * 50}ms">
      <span class="tm-mon__pos">${i + 1}</span>
      <div class="tm-mon__img"><div class="skel"></div></div>
      <div>
        <div class="tm-mon__name">${esc(m.pokemon)}${tags.length ? ' ' + tags.join(' ') : ''}</div>
        <div class="tm-mon__types"></div>
        ${extra.length ? `<div class="tm-mon__extra">${extra.join('<br>')}</div>` : ''}
      </div>
      <span class="lv-badge">Lv. ${m.level}</span>
    </li>`;
  },

  /* Formas regionais que a PokéAPI trata como Pokémon separado: `${jogo}:${nome}` → slug */
  FORMS: {
    'sword-shield:weezing': 'weezing-galar',
    'sword-shield:darmanitan': 'darmanitan-galar-standard',
    'sun-moon:persian': 'persian-alola',
    'sun-moon:ninetales': 'ninetales-alola',
    'sun-moon:golem': 'golem-alola'
  },

  /** "Mr. Mime" → "mr-mime", "Nidoran♀" → "nidoran-f". `slug` no dado sobrescreve (formas, etc.). */
  slug(m, t) {
    if (m.slug) return m.slug;
    const base = m.pokemon.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/♀/g, '-f').replace(/♂/g, '-m').replace(/[.'’:]/g, '').trim().replace(/\s+/g, '-');
    return (t && this.FORMS[`${t.game}:${base}`]) || base;
  },

  /** Busca o Pokémon; se o nome tiver forma padrão com sufixo (aegislash, mimikyu, lycanroc...), usa a espécie. */
  async resolvePokemon(m, t) {
    const slug = this.slug(m, t);
    try {
      return await PokeAPI.getPokemon(slug);
    } catch (err) {
      if (err && err.type && err.type !== 'not-found') throw err;
      const sp = await PokeAPI.getSpecies(slug.replace(/-(galar|alola)(-.*)?$/, ''));
      const def = (sp.varieties.find(v => v.is_default) || sp.varieties[0]).pokemon.name;
      return PokeAPI.getPokemon(def);
    }
  },

  /** Preenche imagem/tipos de um Pokémon do time; devolve a lista de tipos (para o resumo). */
  async fillMember(t, m, row) {
    if (!row) return [];
    const img = row.querySelector('.tm-mon__img');
    try {
      const p = await this.resolvePokemon(m, t);
      if (!row.isConnected) return [];                       // modal já foi fechado/trocado
      const src = (p.sprites.other && p.sprites.other['official-artwork'] && p.sprites.other['official-artwork'].front_default)
        || PokeAPI.spriteUrl(p.id);
      img.innerHTML = `<img src="${src}" alt="${esc(m.pokemon)}" loading="lazy" decoding="async"
        onerror="this.onerror=null;this.src='assets/icons/placeholder.svg'">`;
      row.querySelector('.tm-mon__name').innerHTML =
        `<a href="pokemon.html?id=${p.id}" title="Ver na Pokédex">${esc(m.pokemon)}</a>` +
        Array.from(row.querySelectorAll('.tm-mon__name .tr-tag')).map(x => ' ' + x.outerHTML).join('');
      row.querySelector('.tm-mon__types').innerHTML = p.types.map(x =>
        `<span class="type-badge" style="--type-color:${TYPE_COLORS[x.type.name] || '#999'}">${x.type.name}</span>`).join('');
      return p.types.map(x => x.type.name);
    } catch (err) {
      if (!row.isConnected) return [];
      img.innerHTML = '<img src="assets/icons/placeholder.svg" alt="" width="60" height="60">';
      return [];
    }
  },

  closeModal(silent) {
    const modal = this.els.trainerModal;
    if (modal.hidden) return;
    if (!silent) {
      // Se abrimos o modal navegando dentro da página, voltar uma entrada do histórico
      if (this.openedInApp) { this.openedInApp = false; history.back(); return; }
      location.hash = `${this.state.region}/${this.state.game}`;
      return;
    }
    modal.hidden = true;
    document.body.classList.remove('tr-lock');
    if (this.lastFocus && this.lastFocus.isConnected) this.lastFocus.focus();
  }
};

/* Escape de HTML para dados que entram em innerHTML */
function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

document.addEventListener('DOMContentLoaded', () => TrainersPage.init());
