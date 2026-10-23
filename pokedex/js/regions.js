/* =========================================================
   data/trainers/regions.js — Índice leve de regiões e jogos
   Carregado na inicialização. NÃO contém times: cada região
   tem seu próprio arquivo (hoenn.js, kanto.js...) carregado
   somente quando a região é selecionada.

   Para liberar um jogo novo: troque `ready: false` por `true`
   e adicione os treinadores (com game: "<id>") no arquivo da região.
   ========================================================= */
window.TRAINER_REGIONS = [
  { id: 'kanto', name: 'Kanto', gen: 1, colors: ['#ef4444', '#f97316'], games: [
    { id: 'red-blue',      label: 'Red / Blue',        ready: true  },
    { id: 'yellow',        label: 'Yellow',            ready: false },
    { id: 'firered-leafgreen', label: 'FireRed / LeafGreen', ready: false },
    { id: 'lets-go',       label: "Let's Go",          ready: false }
  ]},
  { id: 'johto', name: 'Johto', gen: 2, colors: ['#eab308', '#a16207'], games: [
    { id: 'gold-silver',   label: 'Gold / Silver',     ready: true  },
    { id: 'crystal',       label: 'Crystal',           ready: false },
    { id: 'heartgold-soulsilver', label: 'HeartGold / SoulSilver', ready: false }
  ]},
  { id: 'hoenn', name: 'Hoenn', gen: 3, colors: ['#0ea5e9', '#16a34a'], games: [
    { id: 'ruby-sapphire', label: 'Ruby / Sapphire',   ready: false },
    { id: 'emerald',       label: 'Emerald',           ready: true  },
    { id: 'omega-ruby-alpha-sapphire', label: 'Omega Ruby / Alpha Sapphire', ready: false }
  ]},
  { id: 'sinnoh', name: 'Sinnoh', gen: 4, colors: ['#6366f1', '#0f172a'], games: [
    { id: 'diamond-pearl', label: 'Diamond / Pearl',   ready: false },
    { id: 'platinum',      label: 'Platinum',          ready: true  },
    { id: 'bdsp',          label: 'Brilliant Diamond / Shining Pearl', ready: false }
  ]},
  { id: 'unova', name: 'Unova', gen: 5, colors: ['#334155', '#64748b'], games: [
    { id: 'black-white',   label: 'Black / White',     ready: true  },
    { id: 'black2-white2', label: 'Black 2 / White 2', ready: false }
  ]},
  { id: 'kalos', name: 'Kalos', gen: 6, colors: ['#ec4899', '#3b82f6'], games: [
    { id: 'x-y',           label: 'X / Y',             ready: true  }
  ]},
  { id: 'alola', name: 'Alola', gen: 7, colors: ['#f59e0b', '#14b8a6'], games: [
    { id: 'sun-moon',      label: 'Sun / Moon',        ready: true  },
    { id: 'ultra-sun-ultra-moon', label: 'Ultra Sun / Ultra Moon', ready: false }
  ]},
  { id: 'galar', name: 'Galar', gen: 8, colors: ['#8b5cf6', '#e11d48'], games: [
    { id: 'sword-shield',  label: 'Sword / Shield',    ready: true  }
  ]},
  { id: 'paldea', name: 'Paldea', gen: 9, colors: ['#f43f5e', '#7c3aed'], games: [
    { id: 'scarlet-violet', label: 'Scarlet / Violet', ready: true  }
  ]}
];

/* Categorias, na ordem em que aparecem na interface */
window.TRAINER_CATEGORIES = [
  { id: 'gym-leader', title: 'Gym Leaders', filter: 'Ginásios' },
  { id: 'elite-four', title: 'Elite Four',  filter: 'Elite Four' },
  { id: 'champion',   title: 'Champion',    filter: 'Campeões' }
];
