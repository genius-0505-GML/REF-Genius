/* =========================================================
   data/trainers/profiles.js — Perfil de cada treinador (igual em todos os jogos)
   Chave = nome em minúsculas, sem acento, com "-" no lugar de espaços/pontos
   (ex.: "Lt. Surge" → "lt-surge", "Tate & Liza" → "tate-liza").

   Campos:
   - s  : id do sprite do treinador no Pokémon Showdown
          (https://play.pokemonshowdown.com/sprites/trainers/<s>.png)
   - c  : cidade do ginásio / ilha / local onde é enfrentado
   - cl : classe/profissão (opcional)
   - b  : bio curta em português
   Se a imagem não carregar, a interface gera um avatar com as iniciais.
   ========================================================= */
window.TRAINER_PROFILES = {
  /* ---------- Kanto ---------- */
  'brock':    { s: 'brock',    c: 'Pewter City',     cl: 'Líder de Pedra',      b: 'Líder do primeiro ginásio de Kanto. Sonha em ser criador de Pokémon e conduz o ginásio para sustentar a família. Seu time é lento e resistente: Água, Planta e Lutador resolvem a batalha.' },
  'misty':    { s: 'misty',    c: 'Cerulean City',   cl: 'Sereia Sensacional',  b: 'Líder de Cerulean City, comanda o ginásio aquático com as irmãs. Starmie é seu Pokémon mais forte. Elétrico e Planta são a saída mais segura contra o time de Água.' },
  'lt-surge': { s: 'ltsurge',  c: 'Vermilion City',  cl: 'Americano Relâmpago', b: 'Ex-militar que usa Pokémon elétricos com a mesma disciplina de um campo de batalha. O ginásio tem um quebra-cabeça de lixeiras com interruptores; Terra anula todo o time.' },
  'erika':    { s: 'erika',    c: 'Celadon City',    cl: 'Líder de Planta',     b: 'Calma e elegante, mistura as aulas de arranjo floral com o ginásio. Seus Pokémon de Planta/Veneno são fracos a Fogo, Voador, Gelo e Psíquico.' },
  'koga':     { s: 'koga',     c: 'Fuchsia City',    cl: 'Mestre Ninja',        b: 'Ninja que prioriza veneno, truques e golpes de status. Em Kanto lidera o ginásio de Fuchsia; em Johto sobe para o Elite Four.' },
  'sabrina':  { s: 'sabrina',  c: 'Saffron City',    cl: 'Mestra Psíquica',     b: 'Domina Saffron City e seu ginásio de teletransportes. Seu Alakazam é o ápice do time; Fantasma, Inseto e Sombrio exploram as fraquezas do tipo.' },
  'blaine':   { s: 'blaine',   c: 'Cinnabar Island', cl: 'Mestre do Fogo',      b: 'Líder veterano do ginásio de Cinnabar, uma ilha vulcânica. Seu time é de Fogo, fraco a Água, Terra e Pedra.' },
  'giovanni': { s: 'giovanni', c: 'Viridian City',   cl: 'Chefe da Equipe Rocket', b: 'Chefe da Equipe Rocket e líder do último ginásio de Kanto. Seu time de Terra tem muitos Pokémon duplos Terra/Pedra ou Terra/Veneno.' },
  'lorelei':  { s: 'lorelei',  c: 'Indigo Plateau',  cl: 'Elite Four',          b: 'Primeira do Elite Four de Kanto. Mistura Gelo e Água, e boa parte do time é fraca a Elétrico e Lutador.' },
  'bruno':    { s: 'bruno',    c: 'Indigo Plateau',  cl: 'Elite Four',          b: 'Lutador focado em força física. Onix e Machamp seguram o time; ataques de Água, Terra e Psíquico funcionam bem.' },
  'agatha':   { s: 'agatha',   c: 'Indigo Plateau',  cl: 'Elite Four',          b: 'Veterana do Elite Four e amiga do Prof. Oak. Usa a linha de Gastly (Fantasma/Veneno) e Pokémon que causam status.' },
  'lance':    { s: 'lance',    c: 'Indigo Plateau',  cl: 'Mestre de Dragões',   b: 'Último do Elite Four de Kanto e Campeão de Johto. Ele treina a família de Dragonair e Dragonite; Gelo e Dragão são os caminhos mais seguros.' },
  'blue':     { s: 'blue',     c: 'Indigo Plateau',  cl: 'Rival / Campeão',     b: 'Rival do jogador e neto do Prof. Oak. Chega à Liga antes e se torna Campeão. O inicial dele sempre é o que leva vantagem sobre o seu.' },

  /* ---------- Johto ---------- */
  'falkner':  { s: 'falkner',  c: 'Violet City',     cl: 'Mestre de Voadores',  b: 'Primeiro Líder de Johto. Defende o ginásio de Violet City com Pokémon voadores simples.' },
  'bugsy':    { s: 'bugsy',    c: 'Azalea Town',     cl: 'Pesquisador de Insetos', b: 'Jovem pesquisador que se dedica aos Pokémon de Inseto. Fogo, Voador e Pedra são muito eficazes.' },
  'whitney':  { s: 'whitney',  c: 'Goldenrod City',  cl: 'Garota Normal',       b: 'Famosa por derrotar iniciantes com o Miltank e o golpe Rollout. Lutador ajuda, mas cuidado com a resistência dele.' },
  'morty':    { s: 'morty',    c: 'Ecruteak City',   cl: 'Místico',             b: 'Pesquisador da lenda das Torres de Ecruteak. Treina Pokémon Fantasma e tenta ver o Pokémon lendário.' },
  'chuck':    { s: 'chuck',    c: 'Cianwood City',   cl: 'Mestre de Karatê',    b: 'Treina sob uma cachoeira. Primeape e Poliwrath são fisicamente fortes; Psíquico e Voador ajudam.' },
  'jasmine':  { s: 'jasmine',  c: 'Olivine City',    cl: 'Garota de Aço',       b: 'Tímida e gentil, dedica-se aos Pokémon de Aço. Fogo, Lutador e Terra são os melhores contra o time.' },
  'pryce':    { s: 'pryce',    c: 'Mahogany Town',   cl: 'Veterano do Gelo',    b: 'Líder experiente, treina Pokémon de Gelo há décadas. Fogo, Lutador e Pedra são vantajosos.' },
  'clair':    { s: 'clair',    c: 'Blackthorn City', cl: 'Mestra Dragão',       b: 'Prima de Lance e orgulhosa do ginásio de Dragões. Gelo e Dragão são as melhores opções.' },
  'will':     { s: 'will',     c: 'Indigo Plateau',  cl: 'Elite Four',          b: 'Primeiro do Elite Four de Johto. Usa Pokémon psíquicos e especializados em status.' },
  'karen':    { s: 'karen',    c: 'Indigo Plateau',  cl: 'Elite Four',          b: 'Última do Elite Four de Johto, especialista em tipo Sombrio. Acredita em tratar bem o Pokémon que se ama.' },

  /* ---------- Hoenn ---------- */
  'roxanne':  { s: 'roxanne',  c: 'Rustboro City',   cl: 'Professora / Líder',  b: 'Líder de Rustboro que divide o tempo entre o ginásio e a escola, onde é professora. Usa Pokémon de Pedra.' },
  'brawly':   { s: 'brawly',   c: 'Dewford Town',    cl: 'Surfista / Lutador',  b: 'Líder de Dewford Town, uma ilha cercada por ondas. Treina Pokémon Lutadores com fibra de surfista.' },
  'wattson':  { s: 'wattson',  c: 'Mauville City',   cl: 'Mestre Elétrico',     b: 'Líder animado e simpático. O ginásio de Mauville tem portas elétricas; Terra é a solução.' },
  'flannery': { s: 'flannery', c: 'Lavaridge Town',  cl: 'Líder de Fogo',       b: 'Líder novata, que assumiu o ginásio de Lavaridge Town após o avô. Seu time é de Fogo, com Torkoal como ás.' },
  'norman':   { s: 'norman',   c: 'Petalburg City',  cl: 'Líder de Normal',     b: 'Pai do protagonista. Lidera o ginásio de Petalburg com Pokémon Normais de ataque físico e alta resistência.' },
  'winona':   { s: 'winona',   c: 'Fortree City',    cl: 'Mestra Voadora',      b: 'Líder do ginásio de Fortree, uma vila nas copas das árvores. Altaria é seu Pokémon principal.' },
  'tate-liza':{ s: 'tateandliza', c: 'Mossdeep City', cl: 'Gêmeos Psíquicos',   b: 'Dupla de irmãos gêmeos que lutam juntos em batalhas duplas. Eles combinam Pokémon do Sol e da Lua.' },
  'juan':     { s: 'juan',     c: 'Sootopolis City', cl: 'Mestre de Água',      b: 'Líder de Sootopolis no Emerald. Elegante e discípulo de Wallace, treina Pokémon aquáticos refinados.' },
  'sidney':   { s: 'sidney',   c: 'Ever Grande City', cl: 'Elite Four',         b: 'Primeiro do Elite Four de Hoenn. Rebelde, usa um time de Sombrio que ataca com força.' },
  'phoebe':   { s: 'phoebe',   c: 'Ever Grande City', cl: 'Elite Four',         b: 'Treinou em uma montanha com os espíritos dos Pokémon Fantasma. Dusclops e Banette são seu forte.' },
  'glacia':   { s: 'glacia',   c: 'Ever Grande City', cl: 'Elite Four',         b: 'Busca desafiantes fortes para enfrentar. Seu time é inteiro de Gelo, com Walrein como ás.' },
  'drake':    { s: 'drake',    c: 'Ever Grande City', cl: 'Elite Four',         b: 'Capitão veterano e mestre de Dragões. Salamence é seu ás e a maior ameaça do time.' },
  'wallace':  { s: 'wallace',  c: 'Ever Grande City', cl: 'Campeão',            b: 'Ex-líder de Sootopolis e atual Campeão de Hoenn no Emerald. Valoriza a beleza dos Pokémon, e seu Milotic é a estrela.' },

  /* ---------- Sinnoh ---------- */
  'roark':    { s: 'roark',    c: 'Oreburgh City',   cl: 'Mineiro / Líder',     b: 'Líder do ginásio de Oreburgh, cidade de mineração. Usa capacete e ama fósseis; Cranidos é o ás.' },
  'gardenia': { s: 'gardenia', c: 'Eterna City',     cl: 'Líder de Planta',     b: 'Líder do ginásio de Eterna. Carinhosa com Pokémon de Planta, é a segunda líder de Sinnoh.' },
  'fantina':  { s: 'fantina',  c: 'Hearthome City',  cl: 'Rainha dos Concursos', b: 'Atriz e Líder de Hearthome City, famosa nos concursos Pokémon. Seu time é Fantasma.' },
  'maylene':  { s: 'maylene',  c: 'Veilstone City',  cl: 'Lutadora',            b: 'Líder séria e disciplinada que treina Pokémon Lutadores. Lucario é seu Pokémon mais forte.' },
  'crasher-wake': { s: 'crasherwake', c: 'Pastoria City', cl: 'Lutador Mascarado', b: 'Luchador que usa máscara e lidera o ginásio de Pastoria City. Gyarados é o grande destaque.' },
  'byron':    { s: 'byron',    c: 'Canalave City',   cl: 'Líder de Aço',        b: 'Pai de Roark e Líder do ginásio de Canalave City. Usa um time de Aço de grande defesa.' },
  'candice':  { s: 'candice',  c: 'Snowpoint City',  cl: 'Garota do Gelo',      b: 'Líder do ginásio de Snowpoint City. Entusiasmada e determinada, usa um time de Gelo.' },
  'volkner':  { s: 'volkner',  c: 'Sunyshore City',  cl: 'Mestre Elétrico',     b: 'O último Líder de Sinnoh. Entediado com a falta de desafios, espera enfrentar oponentes fortes.' },
  'aaron':    { s: 'aaron',    c: 'Pokémon League',  cl: 'Elite Four',          b: 'Primeiro do Elite Four de Sinnoh. Especialista em Pokémon Inseto, com um time ofensivo e rápido.' },
  'bertha':   { s: 'bertha',   c: 'Pokémon League',  cl: 'Elite Four',          b: 'Senhora gentil que lidera um time de Terra. Rhyperior e Hippowdon dominam o campo.' },
  'flint':    { s: 'flint',    c: 'Pokémon League',  cl: 'Elite Four',          b: 'Treinador de Fogo, vibrante e energético. Infernape e Magmortar são perigosos.' },
  'lucian':   { s: 'lucian',   c: 'Pokémon League',  cl: 'Elite Four',          b: 'Escritor que lê livros enquanto espera desafiantes. Seu time é de Psíquico e Gallade se destaca.' },
  'cynthia':  { s: 'cynthia',  c: 'Pokémon League',  cl: 'Campeã',              b: 'Campeã de Sinnoh e uma das treinadoras mais fortes da franquia. Seu Garchomp é lendário.' },

  /* ---------- Unova ---------- */
  'chili':    { s: 'chili',    c: 'Striaton City',   cl: 'Trio de Striaton',    b: 'Um dos três irmãos do ginásio de Striaton. Enfrenta o jogador que escolheu Snivy, com Pokémon de Fogo.' },
  'cress':    { s: 'cress',    c: 'Striaton City',   cl: 'Trio de Striaton',    b: 'Um dos três irmãos do ginásio de Striaton. Enfrenta o jogador que escolheu Tepig, com Pokémon de Água.' },
  'cilan':    { s: 'cilan',    c: 'Striaton City',   cl: 'Trio de Striaton',    b: 'Um dos três irmãos do ginásio de Striaton. Enfrenta o jogador que escolheu Oshawott, com Pokémon de Planta.' },
  'lenora':   { s: 'lenora',   c: 'Nacrene City',    cl: 'Diretora do Museu',   b: 'Pesquisadora e diretora do museu de Nacrene. Lidera o ginásio e usa Pokémon Normais.' },
  'burgh':    { s: 'burgh',    c: 'Castelia City',   cl: 'Artista',             b: 'Artista que se inspira nos Pokémon Inseto. Seu ginásio é uma obra de arte.' },
  'elesa':    { s: 'elesa',    c: 'Nimbasa City',    cl: 'Modelo',              b: 'Modelo famosa e Líder de Nimbasa City. Seu ginásio é um show de luzes elétricas.' },
  'clay':     { s: 'clay',     c: 'Driftveil City',  cl: 'Chefe de Mineração',  b: 'Dono de mineradora, líder do ginásio de Driftveil. Seu time de Terra é pesado, com Excadrill como ás.' },
  'skyla':    { s: 'skyla',    c: 'Mistralton City', cl: 'Piloto',              b: 'Pilota de avião e Líder de Mistralton. O ginásio fica em um aeroporto, e ela só pensa em voar.' },
  'brycen':   { s: 'brycen',   c: 'Icirrus City',    cl: 'Ator',        b: 'Ator famoso que lidera o ginásio em meio ao gelo. Seu time é de Gelo, e Fogo ou Lutador funcionam bem.' },
  'drayden':  { s: 'drayden',  c: 'Opelucid City',   cl: 'Prefeito',            b: 'Prefeito de Opelucid City e líder do ginásio no Black. Seus Dragões atacam com muita força.' },
  'iris':     { s: 'iris',     c: 'Opelucid City',   cl: 'Mestre de Dragões',   b: 'Jovem apaixonada por Dragões que lidera o ginásio de Opelucid City no White.' },
  'shauntal': { s: 'shauntal', c: 'Pokémon League',  cl: 'Elite Four',          b: 'Escritora que se inspira nas batalhas para novos romances. Usa um time de Fantasma.' },
  'grimsley': { s: 'grimsley', c: 'Pokémon League',  cl: 'Elite Four',          b: 'Apostador que arrisca tudo nas batalhas. Seu time é de Sombrio.' },
  'caitlin':  { s: 'caitlin',  c: 'Pokémon League',  cl: 'Elite Four',          b: 'Calma e misteriosa, lidera um time de Psíquico no Elite Four de Unova.' },
  'marshal':  { s: 'marshal',  c: 'Pokémon League',  cl: 'Elite Four',          b: 'Mestre de artes marciais que treina Pokémon Lutadores e valoriza a disciplina.' },
  'alder':    { s: 'alder',    c: 'Pokémon League',  cl: 'Campeão',             b: 'Campeão de Unova em Black/White. É um treinador veterano com um time variado e níveis altos.' },

  /* ---------- Kalos ---------- */
  'viola':    { s: 'viola',    c: 'Santalune City',  cl: 'Fotógrafa',           b: 'Fotógrafa e líder do primeiro ginásio de Kalos. Usa Pokémon de Inseto.' },
  'grant':    { s: 'grant',    c: 'Cyllage City',    cl: 'Escalador',           b: 'Escalador que adora Pokémon fósseis. Treina Pedra no ginásio de Cyllage.' },
  'korrina':  { s: 'korrina',  c: 'Shalour City',    cl: 'Lutadora',            b: 'Lutadora enérgica que patina pela cidade. Treina Pokémon Lutadores e ensina Mega Evolução.' },
  'ramos':    { s: 'ramos',    c: 'Coumarine City',  cl: 'Jardineiro',          b: 'Jardineiro idoso que lidera o ginásio de Planta em Coumarine City.' },
  'clemont':  { s: 'clemont',  c: 'Lumiose City',    cl: 'Inventor',            b: 'Inventor e Líder de Lumiose City. Seu ginásio é cheio de máquinas elétricas.' },
  'valerie':  { s: 'valerie',  c: 'Laverre City',    cl: 'Estilista',           b: 'Estilista delicada que treina Pokémon de Fada, o tipo mais novo da série na época.' },
  'olympia':  { s: 'olympia',  c: 'Anistar City',    cl: 'Vidente',             b: 'Vidente que usa poderes psíquicos e prevê o futuro. Lidera o ginásio de Anistar.' },
  'wulfric':  { s: 'wulfric',  c: 'Snowbelle City',  cl: 'Mestre de Gelo',      b: 'Último Líder de Kalos. Vive em uma cidade nevada e treina Pokémon de Gelo.' },
  'malva':    { s: 'malva',    c: 'Pokémon League',  cl: 'Elite Four',          b: 'Jornalista e Elite Four de Kalos, especialista em Fogo. Tem ligação com a Equipe Flare.' },
  'wikstrom': { s: 'wikstrom', c: 'Pokémon League',  cl: 'Elite Four',          b: 'Cavaleiro que se orgulha da honra. Seu time é de Aço e Aegislash é o ás.' },
  'drasna':   { s: 'drasna',   c: 'Pokémon League',  cl: 'Elite Four',          b: 'Simpática e gentil, ama contar histórias de Dragões. Lidera o time de Dragão.' },
  'siebold':  { s: 'siebold',  c: 'Pokémon League',  cl: 'Elite Four',          b: 'Chef de cozinha que valoriza a combinação de sabores. Usa um time de Água.' },
  'diantha':  { s: 'diantha',  c: 'Pokémon League',  cl: 'Campeã',              b: 'Atriz famosa e Campeã de Kalos. Usa Mega Gardevoir como carta final.' },

  /* ---------- Alola ---------- */
  'hala':     { s: 'hala',     c: 'Ilha Melemele',   cl: 'Kahuna de Lutador',   b: 'Kahuna da ilha Melemele e avô de Hau. É forte, bondoso e conduz a primeira Grand Trial do jogador.' },
  'olivia':   { s: 'olivia',   c: 'Ilha Akala',      cl: 'Kahuna de Pedra',     b: 'Kahuna da ilha Akala. Especialista em Pedra, usa o Lycanroc como carta principal.' },
  'nanu':     { s: 'nanu',     c: 'Ilha Ula\'ula',   cl: 'Kahuna de Sombrio',   b: 'Kahuna da ilha Ula\'ula. Casual e sarcástico, treina Pokémon Sombrios.' },
  'hapu':     { s: 'hapu',     c: 'Ilha Poni',       cl: 'Kahuna de Terra',     b: 'Kahuna da ilha Poni. Cuida da própria ilha e usa um time de Terra.' },
  'acerola':  { s: 'acerola',  c: 'Mount Lanakila',  cl: 'Elite Four',          b: 'A mais jovem do Elite Four de Alola. Especialista em Pokémon Fantasma.' },
  'kahili':   { s: 'kahili',   c: 'Mount Lanakila',  cl: 'Elite Four',          b: 'Golfista profissional e Elite Four de Alola. Treina Pokémon Voadores.' },
  'professor-kukui': { s: 'kukui', c: 'Mount Lanakila', cl: 'Professor / Campeão', b: 'Professor Pokémon especialista em golpes. Fundou a Liga de Alola e é o desafiante final do jogador.' },

  /* ---------- Galar ---------- */
  'milo':     { s: 'milo',     c: 'Turffield',       cl: 'Fazendeiro',          b: 'Fazendeiro e Líder de Turffield. Usa Planta e o primeiro Dynamax que o jogador enfrenta.' },
  'nessa':    { s: 'nessa',    c: 'Hulbury',         cl: 'Modelo / Pescadora',  b: 'Modelo e Líder de Hulbury. Time de Água, Drednaw é seu Pokémon principal.' },
  'kabu':     { s: 'kabu',     c: 'Motostoke',       cl: 'Veterano de Fogo',    b: 'Líder veterano de Motostoke, conhecido pelo treino duro. Usa um time de Fogo.' },
  'bea':      { s: 'bea',      c: 'Stow-on-Side',    cl: 'Lutadora',            b: 'Lutadora séria que lidera o ginásio em Sword. Machamp Gigantamax é o ás.' },
  'allister': { s: 'allister', c: 'Stow-on-Side',    cl: 'Líder de Fantasma',   b: 'Jovem tímido que lidera o ginásio em Shield. Seu Gengar Gigantamax é o ás.' },
  'opal':     { s: 'opal',     c: 'Ballonlea',       cl: 'Mestra de Fada',      b: 'A líder mais velha de Galar e muito simpática. Ela usa um time de Fada com Alcremie no final.' },
  'gordie':   { s: 'gordie',   c: 'Circhester',      cl: 'Líder de Pedra',      b: 'Filho de Melony e Líder de Pedra em Sword. Seu Coalossal Gigantamax é o ás.' },
  'melony':   { s: 'melony',   c: 'Circhester',      cl: 'Líder de Gelo',       b: 'Mãe de Gordie e Líder de Gelo em Shield. Lapras Gigantamax é o grande destaque.' },
  'piers':    { s: 'piers',    c: 'Spikemuth',       cl: 'Líder de Sombrio',    b: 'Músico e líder da cidade de Spikemuth. Treina Pokémon Sombrios com um estilo próprio.' },
  'raihan':   { s: 'raihan',   c: 'Hammerlocke',     cl: 'Líder de Dragão',     b: 'Rival de Leon e streamer de batalhas. Batalha em dupla e usa o clima Tempestade de Areia a favor do time de Dragão.' },
  'leon':     { s: 'leon',     c: 'Wyndon',          cl: 'Campeão Invicto',     b: 'Campeão invicto de Galar e irmão de Hop. Seu Charizard Gigantamax é o ás do time.' },
  /* ---------- Paldea e extras ---------- */
  'janine':   { s: 'janine',   c: 'Fuchsia City',    cl: 'Ninja',               b: 'Filha do Koga e líder do ginásio de Fuchsia City em Gold/Silver e HeartGold/SoulSilver. Segue o estilo ninja do pai com Pokémon de Veneno.' },
  'cheren':   { s: 'cheren',   c: 'Aspertia City',   cl: 'Líder de Normal',     b: 'Amigo e rival do protagonista em Unova. Em Black 2 / White 2 se torna Líder de Aspertia City, com um time de Normal.' },
  'roxie':    { s: 'roxie',    c: 'Virbank City',    cl: 'Vocalista / Líder',   b: 'Líder de Virbank City em Black 2 / White 2 e vocalista de uma banda. Usa Pokémon de Veneno.' },
  'marlon':   { s: 'marlon',   c: 'Humilau City',    cl: 'Líder de Água',       b: 'Líder de Humilau City em Black 2 / White 2, especialista em Pokémon de Água.' },
  'bede':     { s: 'bede',     c: 'Galar',           cl: 'Rival',               b: 'Rival do protagonista em Sword/Shield, apadrinhado por Opal e especialista em Pokémon de Fada.' },
  'marnie':   { s: 'marnie',   c: 'Spikemuth',       cl: 'Rival',               b: 'Irmã mais nova do Piers e rival do protagonista em Sword/Shield. Treina Pokémon do tipo Sombrio.' },
  'molayne':  { s: 'molayne',  c: 'Mount Lanakila',  cl: 'Elite Four',          b: 'Membro do Elite Four de Alola em Ultra Sun / Ultra Moon, especialista em Pokémon de Aço.' },
  'hau':      { s: 'hau',      c: 'Alola',           cl: 'Rival',               b: 'Amigo e rival do protagonista em Alola e neto do Kahuna Hala.' },
  'mustard':  { s: 'mustard',  c: 'Isle of Armor',   cl: 'Mestre do Dojo',      b: 'Mestre do Dojo da Isle of Armor (DLC de Sword/Shield) e ex-campeão de Galar. Treina Urshifu.' },
  'red':      { s: 'red',      c: 'Mt. Silver',      cl: 'Mestre Lendário',     b: 'Protagonista de Red/Blue, enfrentado no topo do Mt. Silver em Gold/Silver. Tem o Pikachu como parceiro.' },
  'steven':   { s: 'steven',   c: 'Ever Grande City', cl: 'Campeão',            b: 'Campeão de Hoenn em Ruby/Sapphire e especialista em Pokémon de Aço. Coleciona pedras raras.' },
  'rika':     { s: 'rika',     c: 'Paldea',          cl: 'Elite Four',          b: 'Membro do Elite Four de Paldea, especialista em Pokémon de Terra.' },
  'poppy':    { s: 'poppy',    c: 'Paldea',          cl: 'Elite Four',          b: 'A mais jovem do Elite Four de Paldea. Usa Pokémon de Aço, com Tinkaton como ás.' },
  'larry':    { s: 'larry',    c: 'Medali',          cl: 'Funcionário / Líder', b: 'Funcionário de escritório que lidera o ginásio de Medali (Normal) e também faz parte do Elite Four de Paldea (Voador).' },
  'hassel':   { s: 'hassel',   c: 'Paldea',          cl: 'Elite Four',          b: 'Membro do Elite Four de Paldea, especialista em Dragão, com Baxcalibur no time.' },
  'katy':     { s: 'katy',     c: 'Cortondo',        cl: 'Confeiteira',         b: 'Confeiteira e líder do ginásio de Cortondo, em Paldea. Usa Pokémon do tipo Inseto.' },
  'brassius': { s: 'brassius', c: 'Artazon',         cl: 'Artista',             b: 'Artista e líder do ginásio de Artazon, em Paldea. Usa Pokémon do tipo Planta.' },
  'iono':     { s: 'iono',     c: 'Levincia',        cl: 'Streamer',            b: 'Streamer popular e líder do ginásio de Levincia, em Paldea. Usa Pokémon do tipo Elétrico.' },
  'kofu':     { s: 'kofu',     c: 'Cascarrafa',      cl: 'Chef',                b: 'Chef e líder do ginásio de Cascarrafa, em Paldea. Usa Pokémon do tipo Água.' },
  'ryme':     { s: 'ryme',     c: 'Montenevera',     cl: 'Rapper',              b: 'Rapper e líder do ginásio de Montenevera, em Paldea. Usa Pokémon do tipo Fantasma.' },
  'tulip':    { s: 'tulip',    c: 'Alfornada',       cl: 'Esteticista',         b: 'Esteticista e líder do ginásio de Alfornada, em Paldea. Usa Pokémon do tipo Psíquico.' },
  'grusha':   { s: 'grusha',   c: 'Glaseado',        cl: 'Snowboarder',         b: 'Ex-atleta de snowboard e líder do ginásio de Glaseado, em Paldea. Usa Pokémon do tipo Gelo.' },
  'geeta':    { s: 'geeta',    c: 'Mesagoza',        cl: 'Campeã',              b: 'Campeã de Paldea e presidente da Liga Pokémon. Tem o Glimmora como ás.' },
  'nemona':   { s: 'nemona',   c: 'Paldea',          cl: 'Rival / Campeã',      b: 'Amiga e rival do protagonista em Scarlet/Violet, apaixonada por batalhas e desafios.' },
  /* aliases (nomes alternativos) */
  'kukui':    { s: 'kukui',    c: 'Mount Lanakila',  cl: 'Professor / Campeão', b: 'Professor Pokémon especialista em golpes. Fundou a Liga de Alola.' },
  'tate':     { s: 'tateandliza', c: 'Mossdeep City', cl: 'Gêmeo Psíquico',     b: 'Um dos gêmeos líderes do ginásio de Mossdeep City. Luta ao lado da irmã Liza, com Pokémon do Sol e da Lua.' },
  'liza':     { s: 'tateandliza', c: 'Mossdeep City', cl: 'Gêmea Psíquica',     b: 'Uma das gêmeas líderes do ginásio de Mossdeep City. Luta ao lado do irmão Tate, com Pokémon do Sol e da Lua.' }
};

/* Imagem do treinador: chave do perfil a partir do nome */
window.trainerKey = function (name) {
  return String(name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};
