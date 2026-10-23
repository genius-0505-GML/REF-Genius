/* data/trainers/galar.js — Treinadores de Galar (Sword / Shield).
   Galar não tem Elite Four: só 8 Ginásios + Campeão (Leon).
   `variant` = versão do jogo (Sword/Shield) ou time do Leon.
   `gimmick` (opcional) em um Pokémon = Dynamax / Gigantamax. */
window.TRAINER_DATA = window.TRAINER_DATA || {};
window.TRAINER_DATA.galar = [
  {
    "id": "milo-sword-shield",
    "region": "galar",
    "game": "sword-shield",
    "category": "gym-leader",
    "order": 1,
    "name": "Milo",
    "specialty": "Grass",
    "badge": "Grass Badge",
    "team": [
      {
        "pokemon": "Gossifleur",
        "level": 19
      },
      {
        "pokemon": "Eldegoss",
        "level": 20,
        "gimmick": "Dynamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "nessa-sword-shield",
    "region": "galar",
    "game": "sword-shield",
    "category": "gym-leader",
    "order": 2,
    "name": "Nessa",
    "specialty": "Water",
    "badge": "Water Badge",
    "team": [
      {
        "pokemon": "Goldeen",
        "level": 22
      },
      {
        "pokemon": "Arrokuda",
        "level": 23
      },
      {
        "pokemon": "Drednaw",
        "level": 24,
        "gimmick": "Dynamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "kabu-sword-shield",
    "region": "galar",
    "game": "sword-shield",
    "category": "gym-leader",
    "order": 3,
    "name": "Kabu",
    "specialty": "Fire",
    "badge": "Fire Badge",
    "team": [
      {
        "pokemon": "Ninetales",
        "level": 25
      },
      {
        "pokemon": "Arcanine",
        "level": 25
      },
      {
        "pokemon": "Centiskorch",
        "level": 27,
        "gimmick": "Gigantamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "bea-sword-shield",
    "region": "galar",
    "game": "sword-shield",
    "category": "gym-leader",
    "order": 4,
    "name": "Bea",
    "specialty": "Fighting",
    "badge": "Fighting Badge",
    "variant": "Sword",
    "team": [
      {
        "pokemon": "Hitmontop",
        "level": 34
      },
      {
        "pokemon": "Pangoro",
        "level": 34
      },
      {
        "pokemon": "Sirfetch'd",
        "level": 35
      },
      {
        "pokemon": "Machamp",
        "level": 36,
        "gimmick": "Gigantamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "allister-sword-shield",
    "region": "galar",
    "game": "sword-shield",
    "category": "gym-leader",
    "order": 4,
    "name": "Allister",
    "specialty": "Ghost",
    "badge": "Ghost Badge",
    "variant": "Shield",
    "team": [
      {
        "pokemon": "Yamask",
        "level": 34
      },
      {
        "pokemon": "Mimikyu",
        "level": 34
      },
      {
        "pokemon": "Cursola",
        "level": 35
      },
      {
        "pokemon": "Gengar",
        "level": 36,
        "gimmick": "Gigantamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "opal-sword-shield",
    "region": "galar",
    "game": "sword-shield",
    "category": "gym-leader",
    "order": 5,
    "name": "Opal",
    "specialty": "Fairy",
    "badge": "Fairy Badge",
    "team": [
      {
        "pokemon": "Weezing",
        "level": 36
      },
      {
        "pokemon": "Mawile",
        "level": 36
      },
      {
        "pokemon": "Togekiss",
        "level": 37
      },
      {
        "pokemon": "Alcremie",
        "level": 38,
        "gimmick": "Gigantamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "gordie-sword-shield",
    "region": "galar",
    "game": "sword-shield",
    "category": "gym-leader",
    "order": 6,
    "name": "Gordie",
    "specialty": "Rock",
    "badge": "Rock Badge",
    "variant": "Sword",
    "team": [
      {
        "pokemon": "Barbaracle",
        "level": 40
      },
      {
        "pokemon": "Shuckle",
        "level": 40
      },
      {
        "pokemon": "Stonjourner",
        "level": 41
      },
      {
        "pokemon": "Coalossal",
        "level": 42,
        "gimmick": "Gigantamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "melony-sword-shield",
    "region": "galar",
    "game": "sword-shield",
    "category": "gym-leader",
    "order": 6,
    "name": "Melony",
    "specialty": "Ice",
    "badge": "Ice Badge",
    "variant": "Shield",
    "team": [
      {
        "pokemon": "Frosmoth",
        "level": 40
      },
      {
        "pokemon": "Darmanitan",
        "level": 40
      },
      {
        "pokemon": "Eiscue",
        "level": 41
      },
      {
        "pokemon": "Lapras",
        "level": 42,
        "gimmick": "Gigantamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "piers-sword-shield",
    "region": "galar",
    "game": "sword-shield",
    "category": "gym-leader",
    "order": 7,
    "name": "Piers",
    "specialty": "Dark",
    "badge": "Dark Badge",
    "team": [
      {
        "pokemon": "Scrafty",
        "level": 44
      },
      {
        "pokemon": "Malamar",
        "level": 45
      },
      {
        "pokemon": "Skuntank",
        "level": 45
      },
      {
        "pokemon": "Obstagoon",
        "level": 46
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "raihan-sword-shield",
    "region": "galar",
    "game": "sword-shield",
    "category": "gym-leader",
    "order": 8,
    "name": "Raihan",
    "specialty": "Dragon",
    "badge": "Dragon Badge",
    "battle": "double",
    "team": [
      {
        "pokemon": "Gigalith",
        "level": 46
      },
      {
        "pokemon": "Flygon",
        "level": 47
      },
      {
        "pokemon": "Sandaconda",
        "level": 46
      },
      {
        "pokemon": "Duraludon",
        "level": 48,
        "gimmick": "Gigantamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "leon-sword-shield-inteleon",
    "region": "galar",
    "game": "sword-shield",
    "category": "champion",
    "order": 1,
    "name": "Leon",
    "specialty": "Mixed",
    "variant": "Leon com Inteleon e Mr. Rime",
    "team": [
      {
        "pokemon": "Aegislash",
        "level": 62
      },
      {
        "pokemon": "Dragapult",
        "level": 62
      },
      {
        "pokemon": "Haxorus",
        "level": 63
      },
      {
        "pokemon": "Mr. Rime",
        "level": 64
      },
      {
        "pokemon": "Inteleon",
        "level": 64
      },
      {
        "pokemon": "Charizard",
        "level": 65,
        "gimmick": "Gigantamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "leon-sword-shield-rillaboom",
    "region": "galar",
    "game": "sword-shield",
    "category": "champion",
    "order": 1,
    "name": "Leon",
    "specialty": "Mixed",
    "variant": "Leon com Rillaboom e Rhyperior",
    "team": [
      {
        "pokemon": "Aegislash",
        "level": 62
      },
      {
        "pokemon": "Dragapult",
        "level": 62
      },
      {
        "pokemon": "Haxorus",
        "level": 63
      },
      {
        "pokemon": "Rhyperior",
        "level": 64
      },
      {
        "pokemon": "Rillaboom",
        "level": 64
      },
      {
        "pokemon": "Charizard",
        "level": 65,
        "gimmick": "Gigantamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  },
  {
    "id": "leon-sword-shield-cinderace",
    "region": "galar",
    "game": "sword-shield",
    "category": "champion",
    "order": 1,
    "name": "Leon",
    "specialty": "Mixed",
    "variant": "Leon com Cinderace e Seismitoad",
    "team": [
      {
        "pokemon": "Aegislash",
        "level": 62
      },
      {
        "pokemon": "Dragapult",
        "level": 62
      },
      {
        "pokemon": "Haxorus",
        "level": 63
      },
      {
        "pokemon": "Seismitoad",
        "level": 64
      },
      {
        "pokemon": "Cinderace",
        "level": 64
      },
      {
        "pokemon": "Charizard",
        "level": 65,
        "gimmick": "Gigantamax"
      }
    ],
    "source": "Dados fornecidos pelo usuário (Sword/Shield) — conferir com serebii.net"
  }
];
