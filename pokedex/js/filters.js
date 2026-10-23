/* =========================================================
   filters.js — Lógica de filtros (tipo, geração) e ordenação
   ========================================================= */

const TYPE_COLORS = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD'
};

const ALL_TYPES = Object.keys(TYPE_COLORS);

const Filters = {
  state: {
    search: '',
    type: 'all',
    generation: 'all',
    sort: 'number'
  },

  /** Cache das listas de pokémon por tipo (nome -> [ids]) */
  _typeListCache: new Map(),

  async getPokemonIdsByType(typeName) {
    if (typeName === 'all') return null;
    if (this._typeListCache.has(typeName)) return this._typeListCache.get(typeName);
    const data = await PokeAPI.getType(typeName);
    const ids = data.pokemon
      .map(p => {
        const match = p.pokemon.url.match(/\/(\d+)\/?$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(id => id && id <= 1025);
    const set = new Set(ids);
    this._typeListCache.set(typeName, set);
    return set;
  },

  /**
   * Aplica busca, tipo e geração sobre a lista mestre (apenas id/nome).
   * Retorna a lista filtrada (sem ordenar por stats ainda).
   */
  async applyBasicFilters(masterList) {
    let list = masterList;

    const { search, type, generation } = this.state;

    if (generation !== 'all') {
      const [min, max] = PokeAPI.GENERATION_RANGES[generation];
      list = list.filter(p => p.id >= min && p.id <= max);
    }

    if (type !== 'all') {
      const idSet = await this.getPokemonIdsByType(type);
      list = list.filter(p => idSet.has(p.id));
    }

    if (search) {
      const term = search.trim().toLowerCase();
      if (/^\d+$/.test(term)) {
        list = list.filter(p => String(p.id) === term || String(p.id).padStart(3, '0') === term);
      } else {
        list = list.filter(p => p.name.includes(term));
      }
    }

    return list;
  },

  needsFullData() {
    return this.state.sort !== 'number' && this.state.sort !== 'name';
  },

  sortBasic(list) {
    const sorted = [...list];
    if (this.state.sort === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => a.id - b.id);
    }
    return sorted;
  },

  sortByStat(fullDataList, statKey) {
    return [...fullDataList].sort((a, b) => {
      const statA = a.stats.find(s => s.stat.name === statKey)?.base_stat || 0;
      const statB = b.stats.find(s => s.stat.name === statKey)?.base_stat || 0;
      return statB - statA;
    });
  },

  /**
   * Calcula fraquezas/resistências/imunidades a partir dos dados
   * de damage_relations de cada tipo do Pokémon (sem valores fixos).
   */
  async calculateTypeEffectiveness(typeNames) {
    const multipliers = {};
    ALL_TYPES.forEach(t => { multipliers[t] = 1; });

    for (const typeName of typeNames) {
      const typeData = await PokeAPI.getType(typeName);
      const relations = typeData.damage_relations;

      relations.double_damage_from.forEach(t => { multipliers[t.name] *= 2; });
      relations.half_damage_from.forEach(t => { multipliers[t.name] *= 0.5; });
      relations.no_damage_from.forEach(t => { multipliers[t.name] *= 0; });
    }

    const weaknesses = [];
    const resistances = [];
    const immunities = [];

    Object.entries(multipliers).forEach(([type, mult]) => {
      if (mult === 0) immunities.push({ type, mult });
      else if (mult > 1) weaknesses.push({ type, mult });
      else if (mult < 1) resistances.push({ type, mult });
    });

    weaknesses.sort((a, b) => b.mult - a.mult);
    resistances.sort((a, b) => a.mult - b.mult);

    return { weaknesses, resistances, immunities };
  }
};
