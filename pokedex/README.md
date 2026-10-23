# Pokédex Web

Uma Pokédex completa, moderna e responsiva, construída em **HTML5, CSS3 e JavaScript puro (Vanilla JS)**, consumindo dados em tempo real da [PokéAPI](https://pokeapi.co).

## 🎯 Objetivo

Oferecer uma aplicação frontend real (sem frameworks) capaz de listar, pesquisar, filtrar, comparar e detalhar todos os Pokémon disponíveis na PokéAPI, com favoritos persistentes, tema claro/escuro e uma interface profissional.

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3 (variáveis CSS, Grid, Flexbox, responsividade)
- JavaScript ES6+ (módulos separados por responsabilidade, `async/await`, `fetch`)
- `LocalStorage` para favoritos e preferência de tema
- [PokéAPI v2](https://pokeapi.co/api/v2/) como única fonte de dados

Nenhuma biblioteca de UI (React/Vue/Angular) é utilizada.

## 📁 Estrutura de arquivos

```text
pokedex/
├── index.html          → Página inicial (lista, busca, filtros, comparação)
├── pokemon.html         → Página de detalhes de um Pokémon
├── teams.html           → Montagem de times (até 6 Pokémon) + análise
├── regions.html         → Aba de regiões (locais, jogos, Pokémon)
├── trainers.html        → Treinadores (Gym Leaders, Elite Four, Campeão) por região e jogo
├── css/
│   ├── style.css         → Estilos globais e da página inicial
│   ├── pokemon.css       → Estilos específicos da página de detalhes
│   ├── teams.css         → Estilos da página de times
│   ├── regions.css       → Estilos da página de regiões
│   └── trainers.css      → Estilos da página de treinadores
├── js/
│   ├── api.js            → Toda comunicação com a PokéAPI (fetch + cache)
│   ├── app.js             → Inicialização da página inicial + comparação
│   ├── pokemon.js         → Lógica da página de detalhes
│   ├── search.js          → Busca com debounce
│   ├── filters.js         → Filtros de tipo/geração, ordenação, efetividade de tipos
│   ├── favorites.js       → Persistência de favoritos e tema (LocalStorage)
│   ├── nav.js             → Menu responsivo (botão ☰) compartilhado
│   ├── teams.js           → Lógica da montagem de times
│   ├── regions.js         → Lógica da aba de regiões
│   └── trainers.js        → Lógica da aba de treinadores (rotas por hash, modal)
├── data/trainers/
│   ├── regions.js         → Índice leve: 8 regiões, jogos de cada uma, categorias
│   ├── profiles.js        → Perfil de cada treinador: imagem, cidade, classe e bio (PT-BR)
│   └── <regiao>.js        → Times dos jogos principais da região (carregado só ao abrir a região)
├── assets/
│   └── icons/placeholder.svg → Imagem de fallback quando um sprite não existe
└── README.md
```

## ▶️ Como executar

Como é um projeto 100% frontend, basta servir a pasta com qualquer servidor estático (não abra o `index.html` direto como `file://`, pois o `fetch` pode ser bloqueado pelo navegador em alguns casos):

```bash
cd pokedex
python -m http.server 8000
```

Depois acesse `http://localhost:8000` no navegador.

Alternativas:
- Extensão **Live Server** do VS Code.
- `npx serve .`

## ⚙️ Funcionalidades

- Listagem de Pokémon com paginação incremental ("Carregar mais")
- Busca por nome, nome parcial ou número (com debounce)
- Filtros por tipo e geração (combináveis) e ordenação por número, nome ou stats
- Cards com imagem, número, tipos e botão de favorito
- Página de detalhes com abas: Sobre, Stats, Habilidades, Golpes, Evoluções e Localizações
- Alternância de sprite Normal/Shiny e reprodução do "cry" do Pokémon
- Cálculo automático de fraquezas/resistências/imunidades a partir dos dados de tipo da API (nada é fixado manualmente)
- Cadeia evolutiva com suporte a ramificações (ex.: Eevee)
- Golpes agrupados por método de aprendizado, com detalhes carregados sob demanda
- **Times**: vários times de até 6 Pokémon, busca/filtros (tipo, geração, favoritos), análise de stats médios e fraquezas/resistências do time, cópia em texto, tudo salvo no `LocalStorage`
- **Regiões**: cards de todas as regiões da PokéAPI com jogos, locais (com filtro) e Pokémon da região, ligados à página de detalhes
- Sistema de favoritos persistente via `LocalStorage`
- Tema claro/escuro persistente
- Layout responsivo (desktop, tablet e celular)
- Tratamento de erros de rede/API e de imagens ausentes (fallback)

## 🧑‍🏫 Treinadores: como adicionar dados

Navegação: `Treinadores → Região → (jogo) → categoria → treinador`. URL: `trainers.html#hoenn/emerald/sidney-emerald`.

Um registro por treinador **por jogo** em `data/trainers/<regiao>.js` (a UI não precisa ser alterada):

```js
{ id: "brock-firered", region: "kanto", game: "firered-leafgreen", category: "gym-leader",
  order: 1, name: "Brock", specialty: "Rock", badge: "Boulder Badge",
  team: [{ pokemon: "Geodude", level: 12 }, { pokemon: "Onix", level: 14 }] }
```

- `category`: `gym-leader` | `elite-four` | `champion`; `order` = ordem de batalha dentro da categoria.
- `pokemon` é só a referência: tipos e sprite vêm da PokéAPI (use `slug` para formas especiais).
- Opcionais por Pokémon: `moves`, `item`, `ability`; por treinador: `badge`, `battle: "double"`, `source`.
- Para liberar um jogo: `ready: true` em `data/trainers/regions.js`. Novos jogos de uma região não sobrescrevem os existentes.
- Perfil do treinador (igual em todos os jogos) fica em `data/trainers/profiles.js`, com a chave = nome em minúsculas e sem acento (`Lt. Surge` → `lt-surge`):
  `{ s: 'ltsurge', c: 'Vermilion City', cl: 'Americano Relâmpago', b: 'bio curta...' }`
  - `s` é o id do sprite em `play.pokemonshowdown.com/sprites/trainers/<s>.png` (carregado direto no navegador).
    Se a imagem não carregar, aparece um avatar com as iniciais na cor do tipo. Para usar imagem própria, basta trocar a URL em `portraitHTML()` de `js/trainers.js`.
- Variantes (`variant`): rival/campeão e Striaton aparecem como cards separados, identificados pela variante.
- Formas regionais: se a PokéAPI tratar a forma como outro Pokémon, use `slug` no Pokémon ou adicione em `FORMS` (`js/trainers.js`).
- Opcional por Pokémon: `gimmick` (Dynamax/Gigantamax) aparece como etiqueta; o último Pokémon do time recebe a etiqueta **Ás**.
- Cadastrados: Kanto (Red/Blue), Johto (Gold/Silver), Hoenn (Emerald), Sinnoh (Platinum), Unova (Black/White), Kalos (X/Y), Alola (Sun/Moon) e Galar (Sword/Shield). Paldea ainda está vazia (marcada como "em breve").
- Somente Hoenn tem fonte com link e golpes/itens; as demais regiões têm a nota "Times a conferir no Serebii.net".

## 🧩 Como adicionar novas funcionalidades

- **Novos dados da API**: adicione um novo método em `js/api.js` (siga o padrão de `fetchJSON` + cache).
- **Novas seções na página de detalhes**: crie um novo painel em `pokemon.html` (dentro de `<main>`), adicione um botão em `.tabs` com `data-tab="sua-secao"` e implemente a função `renderSuaSecao()` em `js/pokemon.js`, chamando-a dentro de `PokemonPage.load()`.
- **Novos filtros**: estenda `Filters.state` e `Filters.applyBasicFilters()` em `js/filters.js`.
- **Novas cores de tipo**: edite o objeto `TYPE_COLORS` em `js/filters.js`.

## 📌 Observações sobre a PokéAPI

Alguns dados variam de disponibilidade entre Pokémon (habitat, cries, localizações, taxa de gênero etc.). Nesses casos a interface mostra mensagens amigáveis ("Desconhecido", "Nenhuma localização disponível") em vez de quebrar ou inventar informações. A separação clássica "TM/HM" não existe mais na estrutura atual da PokéAPI — os golpes são agrupados pelos métodos que ela expõe: Level Up, Machine, Egg e Tutor.

## 📄 Licença

Projeto educacional, sem fins lucrativos. Dados © [PokéAPI](https://pokeapi.co). Pokémon e nomes relacionados são marcas registradas da Nintendo/Game Freak/The Pokémon Company.
