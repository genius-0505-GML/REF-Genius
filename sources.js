/* Fontes de personagens (APIs públicas) — usadas pelo perfil da home e pelos times de cada jogo */
const SOURCES = {
  dota: {
    label: "Dota 2",
    async load() {
      const r = await fetch("https://api.opendota.com/api/heroStats");
      if (!r.ok) throw new Error(r.status);
      return (await r.json())
        .map(h => ({ name: h.localized_name, image: "https://cdn.cloudflare.steamstatic.com" + h.img }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  },
  lol: {
    label: "League of Legends",
    async load() {
      let v = "15.18.1";
      try { v = (await (await fetch("https://ddragon.leagueoflegends.com/api/versions.json")).json())[0]; } catch {}
      const r = await fetch(`https://ddragon.leagueoflegends.com/cdn/${v}/data/en_US/champion.json`);
      if (!r.ok) throw new Error(r.status);
      const d = (await r.json()).data;
      return Object.values(d)
        .map(c => ({ name: c.name, image: `https://ddragon.leagueoflegends.com/cdn/${v}/img/champion/${c.image.full}` }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  },
  pokemon: {
    label: "Pokémon",
    async load() {
      const r = await fetch("https://pokeapi.co/api/v2/pokemon-species?limit=1025&offset=0");
      if (!r.ok) throw new Error(r.status);
      return (await r.json()).results.map(p => {
        const id = p.url.match(/\/(\d+)\/?$/)[1];
        return {
          name: p.name.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join(" "),
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        };
      });
    }
  },
  valorant: {
    label: "VALORANT",
    async load() {
      const r = await fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true");
      if (!r.ok) throw new Error(r.status);
      return (await r.json()).data
        .map(a => ({ name: a.displayName, image: a.displayIcon }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  }
};
