/* =========================================================
   pokemon.js — Lógica da página de detalhes de um Pokémon
   ========================================================= */

const GEN_NAMES = {
  1: 'Geração I', 2: 'Geração II', 3: 'Geração III', 4: 'Geração IV', 5: 'Geração V',
  6: 'Geração VI', 7: 'Geração VII', 8: 'Geração VIII', 9: 'Geração IX'
};

const GROWTH_RATE_PT = {
  slow: 'Lenta', medium: 'Média', fast: 'Rápida',
  'medium-slow': 'Média-lenta', 'slow-then-very-fast': 'Lenta então muito rápida',
  'fast-then-very-slow': 'Rápida então muito lenta'
};

const MOVE_METHOD_PT = { 'level-up': 'Level Up', machine: 'Machine', egg: 'Egg', tutor: 'Tutor' };

const PokemonPage = {
  data: null,
  species: null,
  spriteVariant: 'normal',
  movesByMethod: {},
  currentMoveMethod: 'level-up',

  async init() {
    Theme.init();
    document.getElementById('themeToggle').addEventListener('click', () => {
      const t = Theme.toggle();
      document.getElementById('themeToggle').textContent = t === 'dark' ? '☀️' : '🌙';
    });
    document.getElementById('themeToggle').textContent = Theme.get() === 'dark' ? '☀️' : '🌙';

    const id = this.getIdFromUrl();
    if (!id) { this.showError(); return; }

    await this.load(id);
    this.bindTabs();
  },

  getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  },

  async load(id) {
    document.getElementById('loadingState').hidden = false;
    document.getElementById('errorState').hidden = true;
    document.getElementById('detailContent').hidden = true;
    window.scrollTo(0, 0);

    try {
      const [pokemon, species] = await Promise.all([
        PokeAPI.getPokemon(id),
        PokeAPI.getSpecies(id)
      ]);
      this.data = pokemon;
      this.species = species;

      this.renderHero();
      this.renderAbout();
      this.renderStats();
      this.renderAbilities();
      this.renderMoves();
      this.renderEvolution();
      this.renderLocations();

      document.getElementById('loadingState').hidden = true;
      document.getElementById('detailContent').hidden = false;
    } catch (err) {
      console.error(err);
      this.showError();
    }
  },

  showError() {
    document.getElementById('loadingState').hidden = true;
    document.getElementById('detailContent').hidden = true;
    document.getElementById('errorState').hidden = false;
  },

  /* ---------- HERO ---------- */
  renderHero() {
    const p = this.data;
    document.title = `${capitalize(p.name)} — Pokédex`;
    document.getElementById('detailNumber').textContent = `#${String(p.id).padStart(3, '0')}`;
    document.getElementById('detailName').textContent = capitalize(p.name);

    document.getElementById('detailTypes').innerHTML = p.types.map(t =>
      `<span class="type-badge type-badge--lg" style="--type-color:${TYPE_COLORS[t.type.name]}">${capitalize(t.type.name)}</span>`
    ).join('');

    this.updateHeroImage();

    const favBtn = document.getElementById('favBtn');
    const setFavUI = () => {
      const isFav = Favorites.isFavorite(p.id);
      favBtn.textContent = isFav ? '♥' : '♡';
      favBtn.classList.toggle('fav-btn-large--active', isFav);
    };
    setFavUI();
    favBtn.onclick = () => { Favorites.toggle(p.id); setFavUI(); };

    document.querySelectorAll('.sprite-toggle__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sprite-toggle__btn').forEach(b => b.classList.remove('sprite-toggle__btn--active'));
        btn.classList.add('sprite-toggle__btn--active');
        this.spriteVariant = btn.dataset.variant;
        this.updateHeroImage();
      });
    });

    const cryBtn = document.getElementById('cryBtn');
    const cryAudio = document.getElementById('cryAudio');
    const cryUrl = p.cries?.latest || p.cries?.legacy;
    if (!cryUrl) {
      cryBtn.disabled = true;
      cryBtn.title = 'Cry indisponível para este Pokémon';
    } else {
      cryBtn.addEventListener('click', () => {
        cryAudio.src = cryUrl;
        cryAudio.play().catch(() => {});
      });
    }

    document.getElementById('prevBtn').onclick = () => { if (p.id > 1) window.location.href = `pokemon.html?id=${p.id - 1}`; };
    document.getElementById('nextBtn').onclick = () => { window.location.href = `pokemon.html?id=${p.id + 1}`; };
  },

  updateHeroImage() {
    const p = this.data;
    const img = document.getElementById('detailImage');
    const artwork = p.sprites?.other?.['official-artwork'] || {};
    let src = this.spriteVariant === 'shiny'
      ? (artwork.front_shiny || p.sprites?.front_shiny || artwork.front_default)
      : (artwork.front_default || p.sprites?.front_default);
    if (!src) src = 'assets/icons/placeholder.svg';
    img.src = src;
    img.alt = p.name;
    img.onerror = () => { img.onerror = null; img.src = p.sprites?.front_default || 'assets/icons/placeholder.svg'; };
  },

  /* ---------- ABOUT ---------- */
  renderAbout() {
    const p = this.data, s = this.species;
    const ptName = PokeAPI.getLocalizedName(s.names, 'pt') || PokeAPI.getLocalizedName(s.names, 'pt-BR');
    const gen = PokeAPI.getGenerationFromId(p.id);

    const infoItems = [
      ['Pokédex Number', `#${String(p.id).padStart(3, '0')}`],
      ['Nome', ptName ? `${capitalize(p.name)} (${ptName})` : capitalize(p.name)],
      ['Tipos', p.types.map(t => capitalize(t.type.name)).join(', ')],
      ['Altura', `${(p.height / 10).toFixed(1)} m`],
      ['Peso', `${(p.weight / 10).toFixed(1)} kg`],
      ['Base Experience', p.base_experience ?? '—'],
      ['Geração', GEN_NAMES[gen] || '—'],
      ['Habitat', s.habitat ? capitalize(s.habitat.name) : 'Desconhecido']
    ];
    document.getElementById('basicInfoGrid').innerHTML = infoItems.map(buildInfoItem).join('');

    const flavor = PokeAPI.getFlavorText(s.flavor_text_entries, 'pt');
    document.getElementById('flavorText').textContent = flavor || 'Descrição não disponível.';

    const evYield = p.stats
      .filter(st => st.effort > 0)
      .map(st => `${st.effort} ${statNamePt(st.stat.name)}`)
      .join(', ') || 'Nenhum';

    const trainingItems = [
      ['Base Experience', p.base_experience ?? '—'],
      ['Catch Rate', s.capture_rate ?? '—'],
      ['Growth Rate', GROWTH_RATE_PT[s.growth_rate?.name] || capitalize(s.growth_rate?.name || '')],
      ['EV Yield', evYield]
    ];
    document.getElementById('trainingGrid').innerHTML = trainingItems.map(buildInfoItem).join('');

    const genderText = s.gender_rate === -1
      ? 'Sem gênero'
      : `${(100 - s.gender_rate * 12.5).toFixed(1)}% ♂ / ${(s.gender_rate * 12.5).toFixed(1)}% ♀`;

    const breedingItems = [
      ['Egg Groups', s.egg_groups.map(g => capitalize(g.name)).join(', ') || '—'],
      ['Gender Rate', genderText],
      ['Egg Cycle', s.hatch_counter != null ? `${s.hatch_counter} ciclos` : '—']
    ];
    document.getElementById('breedingGrid').innerHTML = breedingItems.map(buildInfoItem).join('');
  },

  /* ---------- STATS ---------- */
  renderStats() {
    const p = this.data;
    const maxStat = 255;
    const rows = p.stats.map(s => {
      const pct = Math.min(100, (s.base_stat / maxStat) * 100);
      return `
        <div class="stat-row">
          <span class="stat-row__label">${statNamePt(s.stat.name)}</span>
          <div class="stat-row__track"><div class="stat-row__fill" style="width:${pct}%"></div></div>
          <span class="stat-row__value">${s.base_stat}</span>
        </div>`;
    }).join('');
    const total = p.stats.reduce((sum, s) => sum + s.base_stat, 0);
    document.getElementById('statsBars').innerHTML = rows + `
      <div class="stat-row stat-row--total">
        <span class="stat-row__label">Total</span>
        <div class="stat-row__track"></div>
        <span class="stat-row__value">${total}</span>
      </div>`;

    this.renderEffectiveness();
  },

  async renderEffectiveness() {
    const container = document.getElementById('effectiveness');
    container.innerHTML = '<p class="muted">Calculando...</p>';
    try {
      const typeNames = this.data.types.map(t => t.type.name);
      const { weaknesses, resistances, immunities } = await Filters.calculateTypeEffectiveness(typeNames);

      const buildGroup = (title, items) => {
        if (!items.length) return '';
        return `<div class="effectiveness-col">
          <h4>${title}</h4>
          ${items.map(i => `<div class="eff-item"><span class="type-badge" style="--type-color:${TYPE_COLORS[i.type]}">${capitalize(i.type)}</span><span class="eff-mult">×${i.mult}</span></div>`).join('')}
        </div>`;
      };

      container.innerHTML =
        buildGroup('Fraquezas', weaknesses) +
        buildGroup('Resistências', resistances) +
        buildGroup('Imunidades', immunities);

      if (!weaknesses.length && !resistances.length && !immunities.length) {
        container.innerHTML = '<p class="muted">Nenhuma relação de tipo especial.</p>';
      }
    } catch (err) {
      container.innerHTML = '<p class="muted">Não foi possível calcular a efetividade de tipos.</p>';
    }
  },

  /* ---------- ABILITIES ---------- */
  async renderAbilities() {
    const container = document.getElementById('abilitiesList');
    container.innerHTML = '<p class="muted">Carregando habilidades...</p>';

    const items = await Promise.all(this.data.abilities.map(async (a) => {
      let description = '';
      try {
        const abilityData = await PokeAPI.getAbility(a.ability.url);
        description = PokeAPI.getFlavorText(abilityData.flavor_text_entries, 'pt');
      } catch (err) {
        description = 'Descrição indisponível.';
      }
      return { name: a.ability.name, hidden: a.is_hidden, description };
    }));

    container.innerHTML = items.map(item => `
      <div class="ability-card">
        <h4>⚡ ${capitalize(item.name)} ${item.hidden ? '<span class="hidden-tag">Hidden Ability</span>' : ''}</h4>
        <p>${item.description || 'Descrição indisponível.'}</p>
      </div>
    `).join('');
  },

  /* ---------- MOVES ---------- */
  renderMoves() {
    const byMethod = {};
    this.data.moves.forEach(m => {
      const methods = new Set(m.version_group_details.map(v => v.move_learn_method.name));
      methods.forEach(method => {
        if (!byMethod[method]) byMethod[method] = [];
        const detail = m.version_group_details.find(v => v.move_learn_method.name === method);
        byMethod[method].push({
          name: m.move.name,
          url: m.move.url,
          level: detail?.level_learned_at || 0
        });
      });
    });
    Object.keys(byMethod).forEach(method => {
      byMethod[method].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    });
    this.movesByMethod = byMethod;

    const methodChips = document.getElementById('moveMethodChips');
    const availableMethods = Object.keys(MOVE_METHOD_PT).filter(m => byMethod[m]?.length);
    methodChips.innerHTML = availableMethods.map((m, i) =>
      `<button class="chip ${i === 0 ? 'chip--active' : ''}" data-method="${m}">${MOVE_METHOD_PT[m]}</button>`
    ).join('');

    methodChips.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        methodChips.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
        chip.classList.add('chip--active');
        this.currentMoveMethod = chip.dataset.method;
        this.renderMovesList();
      });
    });

    this.currentMoveMethod = availableMethods[0] || 'level-up';
    this.renderMovesList();
  },

  renderMovesList() {
    const container = document.getElementById('movesList');
    const moves = this.movesByMethod[this.currentMoveMethod] || [];
    if (!moves.length) {
      container.innerHTML = '<p class="muted">Nenhum golpe encontrado para este método.</p>';
      return;
    }
    container.innerHTML = moves.map((m, idx) => `
      <div class="move-item" data-idx="${idx}">
        <div class="move-item__header">
          <span class="move-item__name">${capitalize(m.name)}</span>
          ${m.level > 0 ? `<span class="move-item__level">Lv. ${m.level}</span>` : ''}
          <span class="move-item__chevron">▾</span>
        </div>
        <div class="move-item__details" hidden><p class="muted">Carregando detalhes...</p></div>
      </div>
    `).join('');

    container.querySelectorAll('.move-item').forEach((el, idx) => {
      el.querySelector('.move-item__header').addEventListener('click', async () => {
        const details = el.querySelector('.move-item__details');
        const wasHidden = details.hidden;
        el.classList.toggle('move-item--open', wasHidden);
        details.hidden = !wasHidden;
        if (wasHidden && !details.dataset.loaded) {
          details.dataset.loaded = '1';
          try {
            const moveData = await PokeAPI.getMove(moves[idx].url);
            const desc = PokeAPI.getFlavorText(moveData.flavor_text_entries, 'pt');
            details.innerHTML = `
              <div class="move-detail-grid">
                <span><strong>Tipo:</strong> ${capitalize(moveData.type.name)}</span>
                <span><strong>Categoria:</strong> ${capitalize(moveData.damage_class.name)}</span>
                <span><strong>Power:</strong> ${moveData.power ?? '—'}</span>
                <span><strong>Accuracy:</strong> ${moveData.accuracy ?? '—'}</span>
                <span><strong>PP:</strong> ${moveData.pp ?? '—'}</span>
              </div>
              <p class="move-detail-desc">${desc || 'Descrição indisponível.'}</p>
            `;
          } catch (err) {
            details.innerHTML = '<p class="muted">Não foi possível carregar os detalhes do golpe.</p>';
          }
        }
      });
    });
  },

  /* ---------- EVOLUTION ---------- */
  async renderEvolution() {
    const container = document.getElementById('evolutionChain');
    container.innerHTML = '<p class="muted">Carregando cadeia evolutiva...</p>';
    try {
      if (!this.species.evolution_chain) {
        container.innerHTML = '<p class="muted">Cadeia evolutiva indisponível.</p>';
        return;
      }
      const chain = await PokeAPI.getEvolutionChain(this.species.evolution_chain.url);
      const nodes = await this.flattenChain(chain.chain);
      container.innerHTML = this.renderEvolutionTree(nodes);
    } catch (err) {
      console.error(err);
      container.innerHTML = '<p class="muted">Não foi possível carregar a cadeia evolutiva.</p>';
    }
  },

  async flattenChain(node, parentSprite = null) {
    const idMatch = node.species.url.match(/\/(\d+)\/?$/);
    const id = idMatch ? parseInt(idMatch[1], 10) : null;
    let sprite = 'assets/icons/placeholder.svg';
    try {
      const pData = await PokeAPI.getPokemon(id);
      sprite = pData.sprites?.other?.['official-artwork']?.front_default || pData.sprites?.front_default || sprite;
    } catch (err) { /* mantém placeholder */ }

    const evolutionDetail = node.evolution_details?.[0];
    const trigger = evolutionDetail ? describeEvolutionTrigger(evolutionDetail) : null;

    const current = { id, name: node.species.name, sprite, trigger };
    const children = await Promise.all((node.evolves_to || []).map(child => this.flattenChain(child)));
    return { ...current, children };
  },

  renderEvolutionTree(node) {
    const nodeHtml = `
      <a href="pokemon.html?id=${node.id}" class="evo-node">
        <img src="${node.sprite}" alt="${node.name}" loading="lazy">
        <span>${capitalize(node.name)}</span>
      </a>`;

    if (!node.children || node.children.length === 0) {
      return `<div class="evo-branch">${nodeHtml}</div>`;
    }

    const childrenHtml = node.children.map(child => `
      <div class="evo-step">
        <span class="evo-arrow">→<br><small>${child.trigger || ''}</small></span>
        ${this.renderEvolutionTree(child)}
      </div>
    `).join('');

    return `<div class="evo-branch">${nodeHtml}<div class="evo-children">${childrenHtml}</div></div>`;
  },

  /* ---------- LOCATIONS ---------- */
  async renderLocations() {
    const container = document.getElementById('locationsList');
    container.innerHTML = '<p class="muted">Carregando localizações...</p>';
    try {
      const encountersUrl = this.data.location_area_encounters;
      if (!encountersUrl) {
        container.innerHTML = '<p class="muted">Nenhuma localização disponível.</p>';
        return;
      }
      const encounters = await PokeAPI.getEvolutionChain(encountersUrl); // reaproveita fetchJSON genérico
      if (!encounters.length) {
        container.innerHTML = '<p class="muted">Este Pokémon não é encontrado na natureza (obtido por evolução, ovo ou eventos).</p>';
        return;
      }
      const names = [...new Set(encounters.map(e => capitalize(e.location_area.name.replace(/-/g, ' '))))];
      container.innerHTML = `<ul class="locations-ul">${names.map(n => `<li>${n}</li>`).join('')}</ul>`;
    } catch (err) {
      container.innerHTML = '<p class="muted">Não foi possível carregar as localizações.</p>';
    }
  },

  /* ---------- TABS ---------- */
  bindTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('tab-panel--active'));
        tab.classList.add('tab--active');
        document.getElementById(`panel-${tab.dataset.tab}`).classList.add('tab-panel--active');
      });
    });
  }
};

function buildInfoItem([label, value]) {
  return `<div class="info-item"><span class="info-item__label">${label}</span><span class="info-item__value">${value}</span></div>`;
}

function statNamePt(name) {
  const map = { hp: 'HP', attack: 'Attack', defense: 'Defense', 'special-attack': 'Special Attack', 'special-defense': 'Special Defense', speed: 'Speed' };
  return map[name] || capitalize(name);
}

function describeEvolutionTrigger(detail) {
  if (detail.min_level) return `Lv. ${detail.min_level}`;
  if (detail.item) return capitalize(detail.item.name.replace(/-/g, ' '));
  if (detail.trigger?.name === 'trade') return 'Troca';
  if (detail.min_happiness) return `Felicidade ${detail.min_happiness}+`;
  if (detail.trigger?.name) return capitalize(detail.trigger.name.replace(/-/g, ' '));
  return '';
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ') : '';
}

document.addEventListener('DOMContentLoaded', () => PokemonPage.init());
