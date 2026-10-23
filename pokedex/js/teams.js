/* =========================================================
   teams.js — Montagem de times (até 6 Pokémon), análise e persistência
   ========================================================= */

const TEAM_MAX = 6;
const PICKER_PAGE = 36;

const STAT_KEYS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
const STAT_LABELS = {
  'hp': 'HP', 'attack': 'Ataque', 'defense': 'Defesa',
  'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', 'speed': 'Velocidade'
};

/* ---------- Persistência (LocalStorage) ---------- */
const TeamStore = {
  KEY: 'pokedex:teams',

  uid() {
    return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },

  createTeam(name) {
    return { id: this.uid(), name, members: [] };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      const data = raw ? JSON.parse(raw) : null;
      if (data && Array.isArray(data.teams) && data.teams.length) {
        data.teams.forEach(t => {
          t.members = (Array.isArray(t.members) ? t.members : [])
            .filter(Number.isInteger)
            .slice(0, TEAM_MAX);
        });
        if (!data.teams.some(t => t.id === data.activeId)) data.activeId = data.teams[0].id;
        return data;
      }
    } catch (err) {
      console.error('Erro ao ler times do LocalStorage:', err);
    }
    const first = this.createTeam('Meu time');
    return { teams: [first], activeId: first.id };
  },

  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Erro ao salvar times no LocalStorage:', err);
    }
  }
};

/* ---------- Página ---------- */
const TeamsPage = {
  data: null,
  masterList: [],
  nameMap: new Map(),
  dataCache: new Map(),   // id -> dados completos do /pokemon/{id}
  filters: { search: '', type: 'all', gen: 'all', favOnly: false },
  pickerList: [],
  pickerOffset: 0,
  refreshToken: 0,
  pickerToken: 0,
  toastTimer: null,
  els: {},

  async init() {
    this.cacheDom();
    this.data = TeamStore.load();
    this.bindEvents();
    this.fillFilterOptions();
    this.renderTeamBar();
    this.refresh();
    await this.loadPicker();
  },

  cacheDom() {
    const ids = ['themeToggle', 'teamSelect', 'teamCount', 'newTeamBtn', 'renameTeamBtn', 'copyTeamBtn',
      'clearTeamBtn', 'deleteTeamBtn', 'slots', 'analysis', 'analysisWarnings', 'avgStats', 'typeTable',
      'pickerSearch', 'pickerType', 'pickerGen', 'pickerFav', 'pickerInfo', 'pickerGrid', 'pickerLoading',
      'pickerEmpty', 'pickerError', 'pickerRetry', 'pickerMore', 'toast'];
    ids.forEach(id => { this.els[id] = document.getElementById(id); });
  },

  bindEvents() {
    const e = this.els;

    e.themeToggle.textContent = Theme.get() === 'dark' ? '☀️' : '🌙';
    e.themeToggle.addEventListener('click', () => {
      e.themeToggle.textContent = Theme.toggle() === 'dark' ? '☀️' : '🌙';
    });

    e.teamSelect.addEventListener('change', () => {
      this.data.activeId = e.teamSelect.value;
      this.persist();
      this.refresh();
    });
    e.newTeamBtn.addEventListener('click', () => this.newTeam());
    e.renameTeamBtn.addEventListener('click', () => this.renameTeam());
    e.copyTeamBtn.addEventListener('click', () => this.copyTeam());
    e.clearTeamBtn.addEventListener('click', () => this.clearTeam());
    e.deleteTeamBtn.addEventListener('click', () => this.deleteTeam());

    /* Slots: remover ou ir ao seletor */
    e.slots.addEventListener('click', (ev) => {
      const remove = ev.target.closest('[data-remove]');
      if (remove) {
        this.removeMember(parseInt(remove.dataset.remove, 10));
        return;
      }
      if (ev.target.closest('.slot--empty')) {
        document.getElementById('picker').scrollIntoView({ behavior: 'smooth', block: 'start' });
        e.pickerSearch.focus({ preventScroll: true });
      }
    });

    /* Seletor */
    e.pickerGrid.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.pick');
      if (btn) this.togglePick(parseInt(btn.dataset.id, 10));
    });

    e.pickerSearch.addEventListener('input', debounce((ev) => {
      this.filters.search = ev.target.value.trim().toLowerCase();
      this.applyPickerFilters();
    }, 300));
    e.pickerType.addEventListener('change', (ev) => { this.filters.type = ev.target.value; this.applyPickerFilters(); });
    e.pickerGen.addEventListener('change', (ev) => { this.filters.gen = ev.target.value; this.applyPickerFilters(); });
    e.pickerFav.addEventListener('change', (ev) => { this.filters.favOnly = ev.target.checked; this.applyPickerFilters(); });
    e.pickerMore.addEventListener('click', () => this.renderPickerPage());
    e.pickerRetry.addEventListener('click', () => this.loadPicker());
  },

  fillFilterOptions() {
    ALL_TYPES.forEach(type => {
      const opt = document.createElement('option');
      opt.value = type;
      opt.textContent = capitalize(type);
      this.els.pickerType.appendChild(opt);
    });
    const romans = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX' };
    Object.keys(PokeAPI.GENERATION_RANGES).forEach(gen => {
      const opt = document.createElement('option');
      opt.value = gen;
      opt.textContent = `Geração ${romans[gen]}`;
      this.els.pickerGen.appendChild(opt);
    });
  },

  /* ---------- Times ---------- */
  activeTeam() {
    return this.data.teams.find(t => t.id === this.data.activeId);
  },

  persist() {
    TeamStore.save(this.data);
  },

  renderTeamBar() {
    const sel = this.els.teamSelect;
    sel.innerHTML = '';
    this.data.teams.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.name;
      sel.appendChild(opt);
    });
    sel.value = this.data.activeId;
  },

  newTeam() {
    const name = (prompt('Nome do novo time:', `Time ${this.data.teams.length + 1}`) || '').trim();
    if (!name) return;
    const team = TeamStore.createTeam(name.slice(0, 40));
    this.data.teams.push(team);
    this.data.activeId = team.id;
    this.persist();
    this.renderTeamBar();
    this.refresh();
  },

  renameTeam() {
    const team = this.activeTeam();
    const name = (prompt('Novo nome do time:', team.name) || '').trim();
    if (!name) return;
    team.name = name.slice(0, 40);
    this.persist();
    this.renderTeamBar();
  },

  clearTeam() {
    const team = this.activeTeam();
    if (!team.members.length) return;
    if (!confirm(`Remover todos os Pokémon de "${team.name}"?`)) return;
    team.members = [];
    this.persist();
    this.refresh();
  },

  deleteTeam() {
    const team = this.activeTeam();
    if (!confirm(`Excluir o time "${team.name}"?`)) return;
    this.data.teams = this.data.teams.filter(t => t.id !== team.id);
    if (!this.data.teams.length) this.data.teams.push(TeamStore.createTeam('Meu time'));
    this.data.activeId = this.data.teams[0].id;
    this.persist();
    this.renderTeamBar();
    this.refresh();
  },

  async copyTeam() {
    const team = this.activeTeam();
    if (!team.members.length) {
      this.toast('O time está vazio.');
      return;
    }
    const names = team.members.map(id => capitalize(this.pokemonName(id)));
    const text = `${team.name}: ${names.join(', ')}`;
    try {
      await navigator.clipboard.writeText(text);
      this.toast('Time copiado!');
    } catch (err) {
      this.toast(text);
    }
  },

  addMember(id) {
    const team = this.activeTeam();
    if (team.members.includes(id)) return;
    if (team.members.length >= TEAM_MAX) {
      this.toast(`O time já tem ${TEAM_MAX} Pokémon.`);
      return;
    }
    team.members.push(id);
    this.persist();
    this.refresh();
  },

  removeMember(id) {
    const team = this.activeTeam();
    team.members = team.members.filter(m => m !== id);
    this.persist();
    this.refresh();
  },

  togglePick(id) {
    if (this.activeTeam().members.includes(id)) this.removeMember(id);
    else this.addMember(id);
  },

  pokemonName(id) {
    return this.dataCache.get(id)?.name || this.nameMap.get(id) || `#${id}`;
  },

  /* ---------- Renderização do time ---------- */
  async refresh() {
    const token = ++this.refreshToken;
    const team = this.activeTeam();

    this.els.teamCount.textContent = `${team.members.length}/${TEAM_MAX}`;
    this.renderSlots();
    this.renderPickerMarks();

    if (!team.members.length) {
      this.els.analysis.hidden = true;
      return;
    }

    try {
      const datas = await Promise.all(team.members.map(id => this.getData(id)));
      if (token !== this.refreshToken) return;
      this.renderSlots(); // agora com tipos e nomes completos

      const effs = await Promise.all(
        datas.map(d => Filters.calculateTypeEffectiveness(d.types.map(t => t.type.name)))
      );
      if (token !== this.refreshToken) return;
      this.renderAnalysis(datas, effs);
    } catch (err) {
      console.error(err);
      if (token !== this.refreshToken) return;
      this.els.analysis.hidden = false;
      this.els.analysisWarnings.innerHTML =
        '<div class="warning warning--danger">Não foi possível carregar os dados para a análise.</div>';
      this.els.avgStats.innerHTML = '';
      this.els.typeTable.innerHTML = '';
    }
  },

  async getData(id) {
    if (this.dataCache.has(id)) return this.dataCache.get(id);
    const data = await PokeAPI.getPokemon(id);
    this.dataCache.set(id, data);
    return data;
  },

  renderSlots() {
    const team = this.activeTeam();
    const html = [];

    for (let i = 0; i < TEAM_MAX; i++) {
      const id = team.members[i];
      if (id === undefined) {
        html.push(`
          <article class="slot slot--empty" tabindex="0" role="button" aria-label="Adicionar Pokémon">
            <span class="slot__plus">+</span>
            <span class="muted">Vaga ${i + 1}</span>
          </article>`);
        continue;
      }

      const data = this.dataCache.get(id);
      const img = data?.sprites?.other?.['official-artwork']?.front_default
        || data?.sprites?.front_default
        || PokeAPI.spriteUrl(id);
      const types = data
        ? data.types.map(t => `<span class="type-badge" style="--type-color:${TYPE_COLORS[t.type.name] || '#999'}">${capitalize(t.type.name)}</span>`).join('')
        : '<span class="muted small">...</span>';

      html.push(`
        <article class="slot slot--filled">
          <button class="slot__remove" data-remove="${id}" aria-label="Remover ${this.pokemonName(id)} do time">✕</button>
          <span class="card__number">#${String(id).padStart(3, '0')}</span>
          <img class="slot__img" src="${img}" alt="${this.pokemonName(id)}"
               onerror="this.onerror=null;this.src='assets/icons/placeholder.svg';">
          <a class="slot__name" href="pokemon.html?id=${id}">${capitalize(this.pokemonName(id))}</a>
          <div class="card__types">${types}</div>
        </article>`);
    }

    this.els.slots.innerHTML = html.join('');
  },

  renderAnalysis(datas, effs) {
    this.els.analysis.hidden = false;

    /* Média dos stats */
    const rows = STAT_KEYS.map(key => {
      const values = datas.map(d => d.stats.find(s => s.stat.name === key)?.base_stat || 0);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return { key, avg };
    });
    const total = rows.reduce((a, r) => a + r.avg, 0);

    this.els.avgStats.innerHTML = rows.map(r => `
      <div class="avg-stat">
        <span class="avg-stat__label">${STAT_LABELS[r.key]}</span>
        <div class="avg-stat__bar"><div class="avg-stat__fill" style="width:${Math.min(100, (r.avg / 150) * 100)}%"></div></div>
        <span class="avg-stat__value">${Math.round(r.avg)}</span>
      </div>`).join('') + `
      <div class="avg-total">Total médio por Pokémon: <strong>${Math.round(total)}</strong></div>`;

    /* Fraquezas / resistências por tipo */
    const summary = {};
    ALL_TYPES.forEach(t => { summary[t] = { weak: 0, resist: 0 }; });
    effs.forEach(eff => {
      eff.weaknesses.forEach(w => { summary[w.type].weak++; });
      eff.resistances.forEach(r => { summary[r.type].resist++; });
      eff.immunities.forEach(i => { summary[i.type].resist++; });
    });

    this.els.typeTable.innerHTML = ALL_TYPES.map(type => {
      const s = summary[type];
      let cls = '';
      if (s.weak >= 3 || (s.weak >= 2 && s.weak > s.resist)) cls = 'type-tile--bad';
      else if (s.resist > s.weak) cls = 'type-tile--good';
      return `
        <div class="type-tile ${cls}">
          <span class="type-badge" style="--type-color:${TYPE_COLORS[type]}">${capitalize(type)}</span>
          <span class="type-tile__row" title="Pokémon fracos a este tipo">Fracos <strong>${s.weak}</strong></span>
          <span class="type-tile__row" title="Pokémon que resistem ou são imunes">Resistem <strong>${s.resist}</strong></span>
        </div>`;
    }).join('');

    /* Alertas */
    const warnings = [];
    const critical = ALL_TYPES.filter(t => summary[t].weak >= 3);
    if (critical.length) {
      warnings.push({
        cls: 'danger',
        text: `Fraqueza em comum: ${critical.map(t => `${capitalize(t)} (${summary[t].weak})`).join(', ')}.`
      });
    }
    const uncovered = ALL_TYPES.filter(t => summary[t].weak >= 1 && summary[t].resist === 0);
    if (uncovered.length) {
      warnings.push({
        cls: 'warn',
        text: `Sem resistência a: ${uncovered.map(capitalize).join(', ')}.`
      });
    }
    if (!warnings.length) {
      warnings.push({ cls: 'ok', text: 'Nenhum problema defensivo evidente neste time.' });
    }
    if (datas.length < TEAM_MAX) {
      warnings.push({ cls: 'info', text: `Faltam ${TEAM_MAX - datas.length} vaga(s) para completar o time.` });
    }

    this.els.analysisWarnings.innerHTML = warnings
      .map(w => `<div class="warning warning--${w.cls}">${w.text}</div>`).join('');
  },

  /* ---------- Seletor ---------- */
  async loadPicker() {
    this.showPickerState('loading');
    try {
      this.masterList = await PokeAPI.getMasterList();
      this.nameMap = new Map(this.masterList.map(p => [p.id, p.name]));
      this.renderSlots(); // atualiza nomes caso ainda estivessem como "#id"
      await this.applyPickerFilters();
    } catch (err) {
      console.error(err);
      this.showPickerState('error');
    }
  },

  async applyPickerFilters() {
    if (!this.masterList.length) return;
    const token = ++this.pickerToken;
    const { search, type, gen, favOnly } = this.filters;

    try {
      let list = this.masterList;

      if (gen !== 'all') {
        const [min, max] = PokeAPI.GENERATION_RANGES[gen];
        list = list.filter(p => p.id >= min && p.id <= max);
      }

      if (type !== 'all') {
        this.showPickerState('loading');
        const idSet = await Filters.getPokemonIdsByType(type);
        if (token !== this.pickerToken) return;
        list = list.filter(p => idSet.has(p.id));
      }

      if (favOnly) {
        const favs = new Set(Favorites.getAll());
        list = list.filter(p => favs.has(p.id));
      }

      if (search) {
        if (/^\d+$/.test(search)) {
          list = list.filter(p => String(p.id) === search || String(p.id).padStart(3, '0') === search);
        } else {
          list = list.filter(p => p.name.includes(search));
        }
      }

      this.pickerList = [...list].sort((a, b) => a.id - b.id);
      this.pickerOffset = 0;
      this.els.pickerGrid.innerHTML = '';

      if (!this.pickerList.length) {
        this.showPickerState('empty');
        return;
      }

      this.showPickerState('success');
      this.els.pickerInfo.textContent = `${this.pickerList.length} Pokémon — clique para adicionar ou remover do time`;
      this.renderPickerPage();
    } catch (err) {
      console.error(err);
      if (token === this.pickerToken) this.showPickerState('error');
    }
  },

  renderPickerPage() {
    const team = this.activeTeam();
    const slice = this.pickerList.slice(this.pickerOffset, this.pickerOffset + PICKER_PAGE);

    const html = slice.map(p => {
      const inTeam = team.members.includes(p.id);
      return `
        <button class="pick ${inTeam ? 'pick--in' : ''}" data-id="${p.id}" aria-pressed="${inTeam}">
          <img src="${PokeAPI.spriteUrl(p.id)}" alt="" loading="lazy"
               onerror="this.onerror=null;this.src='assets/icons/placeholder.svg';">
          <span class="pick__num">#${String(p.id).padStart(3, '0')}</span>
          <span class="pick__name">${capitalize(p.name)}</span>
          <span class="pick__check" aria-hidden="true">✓</span>
        </button>`;
    }).join('');

    this.els.pickerGrid.insertAdjacentHTML('beforeend', html);
    this.pickerOffset += slice.length;
    this.els.pickerMore.hidden = this.pickerOffset >= this.pickerList.length;
  },

  renderPickerMarks() {
    const members = new Set(this.activeTeam().members);
    this.els.pickerGrid.querySelectorAll('.pick').forEach(btn => {
      const inTeam = members.has(parseInt(btn.dataset.id, 10));
      btn.classList.toggle('pick--in', inTeam);
      btn.setAttribute('aria-pressed', String(inTeam));
    });
  },

  showPickerState(state) {
    const e = this.els;
    e.pickerLoading.hidden = state !== 'loading';
    e.pickerEmpty.hidden = state !== 'empty';
    e.pickerError.hidden = state !== 'error';
    e.pickerGrid.hidden = state !== 'success';
    if (state !== 'success') {
      e.pickerInfo.textContent = '';
      e.pickerMore.hidden = true;
    }
  },

  toast(message) {
    const el = this.els.toast;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { el.hidden = true; }, 2500);
  }
};

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ') : '';
}

document.addEventListener('DOMContentLoaded', () => TeamsPage.init());
