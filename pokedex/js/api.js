/* =========================================================
   api.js — Camada de comunicação com a PokéAPI
   Responsável por todas as chamadas fetch e cache em memória.
   ========================================================= */

const API_BASE = 'https://pokeapi.co/api/v2';

/* Cache simples em memória (dura enquanto a página estiver aberta) */
const _cache = new Map();

/* Faixas de números da Pokédex nacional por geração
   (usadas para o filtro de geração sem precisar de requisições extras) */
const GENERATION_RANGES = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025]
};

/**
 * Faz um fetch com cache e tratamento de erro padronizado.
 */
async function fetchJSON(url) {
  if (_cache.has(url)) return _cache.get(url);

  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new ApiError('network', 'Falha de conexão ao acessar a PokéAPI.');
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError('not-found', 'Pokémon não encontrado.');
    }
    throw new ApiError('server', 'A PokéAPI retornou um erro.');
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new ApiError('parse', 'Resposta inválida da PokéAPI.');
  }

  _cache.set(url, data);
  return data;
}

class ApiError extends Error {
  constructor(type, message) {
    super(message);
    this.type = type;
  }
}

const PokeAPI = {
  GENERATION_RANGES,

  /** Lista básica (nome + url) de todos os Pokémon da Pokédex nacional. */
  async getMasterList() {
    const cacheKey = 'master-list';
    if (_cache.has(cacheKey)) return _cache.get(cacheKey);
    const data = await fetchJSON(`${API_BASE}/pokemon-species?limit=1300&offset=0`);
    const list = data.results.map((item) => {
      const idMatch = item.url.match(/\/(\d+)\/?$/);
      return { name: item.name, id: idMatch ? parseInt(idMatch[1], 10) : null };
    }).filter(p => p.id && p.id <= 1025);
    _cache.set(cacheKey, list);
    return list;
  },

  /** Dados completos de um Pokémon (peso, sprites, stats, moves, etc). */
  async getPokemon(idOrName) {
    return fetchJSON(`${API_BASE}/pokemon/${idOrName}`);
  },

  /** Dados da espécie (descrição, taxa de captura, habitat, cadeia evolutiva, etc). */
  async getSpecies(idOrName) {
    return fetchJSON(`${API_BASE}/pokemon-species/${idOrName}`);
  },

  /** Cadeia evolutiva a partir da URL fornecida pela espécie. */
  async getEvolutionChain(url) {
    return fetchJSON(url);
  },

  /** Detalhes de um tipo (usado para calcular fraquezas/resistências e para filtro de tipo). */
  async getType(nameOrUrl) {
    const url = nameOrUrl.startsWith('http') ? nameOrUrl : `${API_BASE}/type/${nameOrUrl}`;
    return fetchJSON(url);
  },

  /** Detalhes de uma habilidade (descrição em português/inglês). */
  async getAbility(url) {
    return fetchJSON(url);
  },

  /** Detalhes de um golpe (poder, precisão, PP, descrição). */
  async getMove(url) {
    return fetchJSON(url);
  },

  /** Extrai a descrição em português (fallback inglês) de uma lista flavor_text_entries. */
  getFlavorText(entries, lang = 'pt') {
    if (!entries || !entries.length) return '';
    let entry = entries.find(e => e.language.name === lang);
    if (!entry) entry = entries.find(e => e.language.name === 'en');
    if (!entry) entry = entries[0];
    return entry ? entry.flavor_text.replace(/[\n\f\r]/g, ' ') : '';
  },

  /** Extrai o nome em português (fallback inglês) de uma lista de names. */
  getLocalizedName(names, lang = 'pt') {
    if (!names || !names.length) return null;
    let entry = names.find(n => n.language.name === lang);
    if (!entry) entry = names.find(n => n.language.name === 'pt-BR');
    return entry ? entry.name : null;
  },

  /** Lista de regiões (nome + url). */
  async getRegionList() {
    const data = await fetchJSON(`${API_BASE}/region?limit=50`);
    return data.results;
  },

  /** Detalhes de uma região (locais, geração principal, pokédexes, jogos). */
  async getRegion(nameOrUrl) {
    const url = String(nameOrUrl).startsWith('http') ? nameOrUrl : `${API_BASE}/region/${nameOrUrl}`;
    return fetchJSON(url);
  },

  /** Pokédex regional (lista de espécies com número regional). */
  async getPokedex(name) {
    return fetchJSON(`${API_BASE}/pokedex/${name}`);
  },

  /** URL do sprite de um Pokémon sem precisar de requisição extra à API. */
  spriteUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  },

  /** Converte "generation-iv" em 4. */
  generationNumber(name) {
    if (!name) return null;
    const roman = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9 };
    return roman[name.replace('generation-', '')] || null;
  },

  /** Descobre a geração (1-9) a partir do número da Pokédex nacional. */
  getGenerationFromId(id) {
    for (const gen in GENERATION_RANGES) {
      const [min, max] = GENERATION_RANGES[gen];
      if (id >= min && id <= max) return parseInt(gen, 10);
    }
    return null;
  }
};
