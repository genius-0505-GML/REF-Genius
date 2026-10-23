/* REF-Genius · STEAM — jogos de exemplo (só usados na 1ª abertura; depois vale o localStorage).
   Edite ou apague à vontade: os números de conquistas abaixo são apenas ilustrativos.

   Campos de um jogo:
     id                    número ou texto único
     steamAppId            AppID da Steam (opcional; se a capa ficar vazia, ela é buscada pelo AppID)
     name                  nome
     cover                 URL da capa (opcional)
     status                "wishlist" (quero jogar) | "playing" | "completed" | "platinum" (100%)
     playtime              horas jogadas (a Steam API devolve minutos: divida por 60 ao importar)
     achievementsUnlocked  conquistas desbloqueadas
     achievementsTotal     total de conquistas
     rating                nota pessoal 0–10 (opcional)
     lastPlayed            "AAAA-MM-DD" (opcional)
     source                "manual" | "steam" (origem do cadastro)  */
const steamCapa = id => `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/library_600x900.jpg`;

const games = [
  { id: 1, steamAppId: 367520, name: "Hollow Knight", cover: steamCapa(367520), status: "completed", playtime: 87,
    achievementsUnlocked: 63, achievementsTotal: 63, rating: 9.5, lastPlayed: "2026-08-14", source: "manual" },
  { id: 2, steamAppId: 1145360, name: "Hades", cover: steamCapa(1145360), status: "playing", playtime: 42,
    achievementsUnlocked: 28, achievementsTotal: 49, rating: 9, lastPlayed: "2026-09-28", source: "manual" },
  { id: 3, steamAppId: 504230, name: "Celeste", cover: steamCapa(504230), status: "completed", playtime: 14,
    achievementsUnlocked: 24, achievementsTotal: 32, rating: 9, lastPlayed: "2026-06-03", source: "manual" },
  { id: 4, steamAppId: 413150, name: "Stardew Valley", cover: steamCapa(413150), status: "playing", playtime: 120,
    achievementsUnlocked: 34, achievementsTotal: 49, rating: 9.5, lastPlayed: "2026-09-30", source: "manual" },
  { id: 5, steamAppId: 620, name: "Portal 2", cover: steamCapa(620), status: "completed", playtime: 12,
    achievementsUnlocked: 40, achievementsTotal: 51, rating: 10, lastPlayed: "2026-04-19", source: "manual" },
  { id: 6, steamAppId: 1245620, name: "Elden Ring", cover: steamCapa(1245620), status: "wishlist", playtime: 0,
    achievementsUnlocked: 0, achievementsTotal: 42, rating: null, lastPlayed: null, source: "manual" }
];
