/* =========================================================
   data/trainers/hoenn.js — Treinadores de Hoenn
   Um registro por treinador *por jogo* (campo `game`).
   Fonte: Serebii.net (páginas Gym Leaders / Elite Four de cada jogo).

   Formato:
   { id, region, game, category, order, name, specialty, badge?, battle?,
     team: [{ pokemon, level, moves?, item? }], source }
   - `order` = ordem em que o treinador é enfrentado dentro da categoria.
   - `pokemon` é só a referência: tipos e sprite vêm da Pokédex (PokéAPI).
   - Para adicionar Ruby/Sapphire/ORAS: novos registros com game: "ruby-sapphire" etc.
     (e marque ready: true no regions.js). Os de Emerald não são afetados.
   ========================================================= */
window.TRAINER_DATA = window.TRAINER_DATA || {};
window.TRAINER_DATA.hoenn = [
  {
    "id": "roxanne-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "gym-leader",
    "order": 1,
    "name": "Roxanne",
    "specialty": "Rock",
    "badge": "Stone Badge",
    "team": [
      {
        "pokemon": "Geodude",
        "level": 12,
        "moves": [
          "Tackle",
          "Defense Curl",
          "Rock Throw",
          "Rock Tomb"
        ]
      },
      {
        "pokemon": "Geodude",
        "level": 12,
        "moves": [
          "Tackle",
          "Defense Curl",
          "Rock Throw",
          "Rock Tomb"
        ]
      },
      {
        "pokemon": "Nosepass",
        "level": 15,
        "moves": [
          "Block",
          "Harden",
          "Tackle",
          "Rock Tomb"
        ],
        "item": "Oran Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/gym.shtml"
  },
  {
    "id": "brawly-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "gym-leader",
    "order": 2,
    "name": "Brawly",
    "specialty": "Fighting",
    "badge": "Knuckle Badge",
    "team": [
      {
        "pokemon": "Machop",
        "level": 16,
        "moves": [
          "Karate Chop",
          "Low Kick",
          "Seismic Toss",
          "Bulk Up"
        ]
      },
      {
        "pokemon": "Meditite",
        "level": 16,
        "moves": [
          "Focus Punch",
          "Light Screen",
          "Reflect",
          "Bulk Up"
        ]
      },
      {
        "pokemon": "Makuhita",
        "level": 19,
        "moves": [
          "Arm Thrust",
          "Vital Throw",
          "Reversal",
          "Bulk Up"
        ],
        "item": "Sitrus Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/gym.shtml"
  },
  {
    "id": "wattson-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "gym-leader",
    "order": 3,
    "name": "Wattson",
    "specialty": "Electric",
    "badge": "Dynamo Badge",
    "team": [
      {
        "pokemon": "Voltorb",
        "level": 20,
        "moves": [
          "Rollout",
          "Spark",
          "Self-Destruct",
          "Shock Wave"
        ]
      },
      {
        "pokemon": "Electrike",
        "level": 20,
        "moves": [
          "Shock Wave",
          "Leer",
          "Quick Attack",
          "Howl"
        ]
      },
      {
        "pokemon": "Magneton",
        "level": 22,
        "moves": [
          "Supersonic",
          "Shock Wave",
          "Thunder Wave",
          "Sonic Boom"
        ]
      },
      {
        "pokemon": "Manectric",
        "level": 24,
        "moves": [
          "Quick Attack",
          "Thunder Wave",
          "Shock Wave",
          "Howl"
        ],
        "item": "Sitrus Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/gym.shtml"
  },
  {
    "id": "flannery-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "gym-leader",
    "order": 4,
    "name": "Flannery",
    "specialty": "Fire",
    "badge": "Heat Badge",
    "team": [
      {
        "pokemon": "Numel",
        "level": 24,
        "moves": [
          "Overheat",
          "Take Down",
          "Magnitude",
          "Sunny Day"
        ]
      },
      {
        "pokemon": "Slugma",
        "level": 24,
        "moves": [
          "Overheat",
          "Smog",
          "Light Screen",
          "Sunny Day"
        ]
      },
      {
        "pokemon": "Camerupt",
        "level": 26,
        "moves": [
          "Overheat",
          "Tackle",
          "Sunny Day",
          "Attract"
        ]
      },
      {
        "pokemon": "Torkoal",
        "level": 29,
        "moves": [
          "Overheat",
          "Sunny Day",
          "Body Slam",
          "Attract"
        ],
        "item": "White Herb"
      }
    ],
    "source": "https://www.serebii.net/emerald/gym.shtml"
  },
  {
    "id": "norman-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "gym-leader",
    "order": 5,
    "name": "Norman",
    "specialty": "Normal",
    "badge": "Balance Badge",
    "team": [
      {
        "pokemon": "Spinda",
        "level": 27,
        "moves": [
          "Teeter Dance",
          "Psybeam",
          "Facade",
          "Encore"
        ]
      },
      {
        "pokemon": "Vigoroth",
        "level": 27,
        "moves": [
          "Slash",
          "Facade",
          "Encore",
          "Feint Attack"
        ]
      },
      {
        "pokemon": "Linoone",
        "level": 29,
        "moves": [
          "Slash",
          "Belly Drum",
          "Facade",
          "Headbutt"
        ]
      },
      {
        "pokemon": "Slaking",
        "level": 31,
        "moves": [
          "Counter",
          "Yawn",
          "Facade",
          "Feint Attack"
        ],
        "item": "Sitrus Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/gym.shtml"
  },
  {
    "id": "winona-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "gym-leader",
    "order": 6,
    "name": "Winona",
    "specialty": "Flying",
    "badge": "Feather Badge",
    "team": [
      {
        "pokemon": "Swablu",
        "level": 29,
        "moves": [
          "Perish Song",
          "Mirror Move",
          "Safeguard",
          "Aerial Ace"
        ]
      },
      {
        "pokemon": "Tropius",
        "level": 29,
        "moves": [
          "Sunny Day",
          "Aerial Ace",
          "Solar Beam",
          "Synthesis"
        ]
      },
      {
        "pokemon": "Pelipper",
        "level": 30,
        "moves": [
          "Water Gun",
          "Supersonic",
          "Protect",
          "Aerial Ace"
        ]
      },
      {
        "pokemon": "Skarmory",
        "level": 31,
        "moves": [
          "Sand Attack",
          "Fury Attack",
          "Steel Wing",
          "Aerial Ace"
        ]
      },
      {
        "pokemon": "Altaria",
        "level": 33,
        "moves": [
          "Earthquake",
          "Dragon Breath",
          "Dragon Dance",
          "Aerial Ace"
        ],
        "item": "Oran Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/gym.shtml"
  },
  {
    "id": "tate-liza-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "gym-leader",
    "order": 7,
    "name": "Tate & Liza",
    "specialty": "Psychic",
    "badge": "Mind Badge",
    "battle": "double",
    "team": [
      {
        "pokemon": "Claydol",
        "level": 41,
        "moves": [
          "Earthquake",
          "Ancient Power",
          "Psychic",
          "Light Screen"
        ]
      },
      {
        "pokemon": "Xatu",
        "level": 41,
        "moves": [
          "Psychic",
          "Sunny Day",
          "Confuse Ray",
          "Calm Mind"
        ]
      },
      {
        "pokemon": "Lunatone",
        "level": 42,
        "moves": [
          "Light Screen",
          "Psychic",
          "Hypnosis",
          "Calm Mind"
        ],
        "item": "Sitrus Berry"
      },
      {
        "pokemon": "Solrock",
        "level": 42,
        "moves": [
          "Sunny Day",
          "Solar Beam",
          "Psychic",
          "Flamethrower"
        ],
        "item": "Sitrus Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/gym.shtml"
  },
  {
    "id": "juan-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "gym-leader",
    "order": 8,
    "name": "Juan",
    "specialty": "Water",
    "badge": "Rain Badge",
    "team": [
      {
        "pokemon": "Luvdisc",
        "level": 41,
        "moves": [
          "Water Pulse",
          "Attract",
          "Sweet Kiss",
          "Flail"
        ]
      },
      {
        "pokemon": "Whiscash",
        "level": 41,
        "moves": [
          "Rain Dance",
          "Water Pulse",
          "Amnesia",
          "Earthquake"
        ]
      },
      {
        "pokemon": "Sealeo",
        "level": 43,
        "moves": [
          "Encore",
          "Body Slam",
          "Aurora Beam",
          "Water Pulse"
        ]
      },
      {
        "pokemon": "Crawdaunt",
        "level": 43,
        "moves": [
          "Water Pulse",
          "Crabhammer",
          "Taunt",
          "Leer"
        ]
      },
      {
        "pokemon": "Kingdra",
        "level": 46,
        "moves": [
          "Water Pulse",
          "Double Team",
          "Ice Beam",
          "Rest"
        ],
        "item": "Chesto Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/gym.shtml"
  },
  {
    "id": "sidney-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "elite-four",
    "order": 1,
    "name": "Sidney",
    "specialty": "Dark",
    "team": [
      {
        "pokemon": "Mightyena",
        "level": 46,
        "moves": [
          "Roar",
          "Double-Edge",
          "Sand Attack",
          "Crunch"
        ]
      },
      {
        "pokemon": "Shiftry",
        "level": 48,
        "moves": [
          "Torment",
          "Double Team",
          "Swagger",
          "Extrasensory"
        ]
      },
      {
        "pokemon": "Cacturne",
        "level": 46,
        "moves": [
          "Leech Seed",
          "Feint Attack",
          "Needle Arm",
          "Cotton Spore"
        ]
      },
      {
        "pokemon": "Crawdaunt",
        "level": 48,
        "moves": [
          "Surf",
          "Swords Dance",
          "Strength",
          "Facade"
        ]
      },
      {
        "pokemon": "Absol",
        "level": 49,
        "moves": [
          "Aerial Ace",
          "Rock Slide",
          "Swords Dance",
          "Slash"
        ],
        "item": "Sitrus Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/elite.shtml"
  },
  {
    "id": "phoebe-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "elite-four",
    "order": 2,
    "name": "Phoebe",
    "specialty": "Ghost",
    "team": [
      {
        "pokemon": "Dusclops",
        "level": 48,
        "moves": [
          "Shadow Punch",
          "Confuse Ray",
          "Curse",
          "Protect"
        ]
      },
      {
        "pokemon": "Banette",
        "level": 49,
        "moves": [
          "Shadow Ball",
          "Grudge",
          "Will-O-Wisp",
          "Feint Attack"
        ]
      },
      {
        "pokemon": "Sableye",
        "level": 50,
        "moves": [
          "Shadow Ball",
          "Double Team",
          "Night Shade",
          "Feint Attack"
        ]
      },
      {
        "pokemon": "Banette",
        "level": 49,
        "moves": [
          "Shadow Ball",
          "Psychic",
          "Thunderbolt",
          "Facade"
        ]
      },
      {
        "pokemon": "Dusclops",
        "level": 51,
        "moves": [
          "Shadow Ball",
          "Ice Beam",
          "Rock Slide",
          "Earthquake"
        ],
        "item": "Sitrus Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/elite.shtml"
  },
  {
    "id": "glacia-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "elite-four",
    "order": 3,
    "name": "Glacia",
    "specialty": "Ice",
    "team": [
      {
        "pokemon": "Sealeo",
        "level": 50,
        "moves": [
          "Encore",
          "Body Slam",
          "Hail",
          "Ice Ball"
        ]
      },
      {
        "pokemon": "Glalie",
        "level": 50,
        "moves": [
          "Light Screen",
          "Crunch",
          "Icy Wind",
          "Ice Beam"
        ]
      },
      {
        "pokemon": "Sealeo",
        "level": 52,
        "moves": [
          "Attract",
          "Double-Edge",
          "Hail",
          "Blizzard"
        ]
      },
      {
        "pokemon": "Glalie",
        "level": 52,
        "moves": [
          "Shadow Ball",
          "Explosion",
          "Hail",
          "Ice Beam"
        ]
      },
      {
        "pokemon": "Walrein",
        "level": 53,
        "moves": [
          "Surf",
          "Body Slam",
          "Ice Beam",
          "Sheer Cold"
        ],
        "item": "Sitrus Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/elite.shtml"
  },
  {
    "id": "drake-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "elite-four",
    "order": 4,
    "name": "Drake",
    "specialty": "Dragon",
    "team": [
      {
        "pokemon": "Shelgon",
        "level": 52,
        "moves": [
          "Rock Tomb",
          "Dragon Claw",
          "Protect",
          "Double-Edge"
        ]
      },
      {
        "pokemon": "Altaria",
        "level": 54,
        "moves": [
          "Double-Edge",
          "Dragon Breath",
          "Dragon Dance",
          "Aerial Ace"
        ]
      },
      {
        "pokemon": "Kingdra",
        "level": 53,
        "moves": [
          "Smokescreen",
          "Dragon Dance",
          "Surf",
          "Body Slam"
        ]
      },
      {
        "pokemon": "Flygon",
        "level": 53,
        "moves": [
          "Flamethrower",
          "Crunch",
          "Dragon Breath",
          "Earthquake"
        ]
      },
      {
        "pokemon": "Salamence",
        "level": 55,
        "moves": [
          "Flamethrower",
          "Dragon Claw",
          "Rock Slide",
          "Crunch"
        ],
        "item": "Sitrus Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/elite.shtml"
  },
  {
    "id": "wallace-emerald",
    "region": "hoenn",
    "game": "emerald",
    "category": "champion",
    "order": 1,
    "name": "Wallace",
    "specialty": "Water",
    "team": [
      {
        "pokemon": "Wailord",
        "level": 57,
        "moves": [
          "Rain Dance",
          "Water Spout",
          "Double-Edge",
          "Blizzard"
        ]
      },
      {
        "pokemon": "Tentacruel",
        "level": 55,
        "moves": [
          "Toxic",
          "Hydro Pump",
          "Sludge Bomb",
          "Ice Beam"
        ]
      },
      {
        "pokemon": "Ludicolo",
        "level": 56,
        "moves": [
          "Giga Drain",
          "Surf",
          "Leech Seed",
          "Double Team"
        ]
      },
      {
        "pokemon": "Whiscash",
        "level": 56,
        "moves": [
          "Earthquake",
          "Surf",
          "Amnesia",
          "Hyper Beam"
        ]
      },
      {
        "pokemon": "Gyarados",
        "level": 56,
        "moves": [
          "Dragon Dance",
          "Earthquake",
          "Hyper Beam",
          "Surf"
        ]
      },
      {
        "pokemon": "Milotic",
        "level": 58,
        "moves": [
          "Recover",
          "Surf",
          "Ice Beam",
          "Toxic"
        ],
        "item": "Sitrus Berry"
      }
    ],
    "source": "https://www.serebii.net/emerald/elite.shtml"
  }
];
