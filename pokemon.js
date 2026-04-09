document.addEventListener('DOMContentLoaded', () => {
    const rawPokemonList = [
        "Venusaur", "Mega Venusaur", "Charizard", "Mega Charizard", "Mega Charizard", "Blastoise", "Mega Blastoise",
        "Beedrill", "Mega Beedrill", "Pidgeot", "Mega Pidgeot", "Arbok", "Pikachu", "Raichu", "Raichu",
        "Clefable", "Mega Clefable", "Ninetales", "Ninetales", "Arcanine", "Arcanine", "Alakazam", "Mega Alakazam",
        "Machamp", "Victreebel", "Mega Victreebel", "Slowbro", "Mega Slowbro", "Slowbro", "Gengar", "Mega Gengar",
        "Kangaskhan", "Mega Kangaskhan", "Starmie", "Mega Starmie", "Pinsir", "Mega Pinsir", "Tauros", "Tauros",
        "Gyarados", "Mega Gyarados", "Ditto", "Vaporeon", "Jolteon", "Flareon", "Aerodactyl", "Mega Aerodactyl",
        "Snorlax", "Dragonite", "Mega Dragonite", "Meganium", "Mega Meganium", "Typhlosion", "Typhlosion",
        "Feraligatr", "Mega Feraligatr", "Ariados", "Ampharos", "Mega Ampharos", "Azumarill", "Politoed",
        "Espeon", "Umbreon", "Slowking", "Slowking", "Forretress", "Steelix", "Mega Steelix",
        "Scizor", "Mega Scizor", "Heracross", "Mega Heracross", "Skarmory", "Mega Skarmory", "Houndoom", "Mega Houndoom",
        "Tyranitar", "Mega Tyranitar", "Pelipper", "Gardevoir", "Mega Gardevoir", "Sableye", "Mega Sableye",
        "Aggron", "Mega Aggron", "Medicham", "Mega Medicham", "Manectric", "Mega Manectric", "Sharpedo", "Mega Sharpedo",
        "Camerupt", "Mega Camerupt", "Torkoal", "Altaria", "Mega Altaria", "Milotic", "Castform",
        "Banette", "Mega Banette", "Chimecho", "Mega Chimecho", "Absol", "Mega Absol", "Glalie", "Mega Glalie",
        "Torterra", "Infernape", "Empoleon", "Luxray", "Roserade", "Rampardos", "Bastiodon", "Lopunny", "Mega Lopunny",
        "Spiritomb", "Garchomp", "Mega Garchomp", "Lucario", "Mega Lucario", "Hippowdon", "Toxicroak",
        "Abomasnow", "Mega Abomasnow", "Weavile", "Rhyperior", "Leafeon", "Glaceon", "Gliscor", "Mamoswine",
        "Gallade", "Mega Gallade", "Froslass", "Mega Froslass", "Rotom", "Serperior", "Emboar", "Mega Emboar",
        "Samurott", "Samurott", "Patrat", "Liepard", "Simisage", "Simisear", "Simipour", "Excadrill", "Mega Excadrill",
        "Audino", "Mega Audino", "Conkeldurr", "Whimsicott", "Krookodile", "Cofagrigus", "Garbodor", "Zoroark", "Zoroark",
        "Reuniclus", "Vanilluxe", "Emolga", "Chandelure", "Mega Chandelure", "Beartic", "Stunfisk", "Stunfisk",
        "Golurk", "Mega Golurk", "Hydreigon", "Volcarona", "Chesnaught", "Mega Chesnaught", "Delphox", "Mega Delphox",
        "Greninja", "Mega Greninja", "Diggersby", "Talonflame", "Vivillon", "Floette", "Mega Floette", "Florges",
        "Pangoro", "Furfrou", "Meowstic", "Mega Meowstic", "Aegislash", "Aromatisse", "Slurpuff", "Clawitzer",
        "Heliolisk", "Tyrantrum", "Aurorus", "Sylveon", "Hawlucha", "Mega Hawlucha", "Dedenne", "Goodra", "Goodra",
        "Klefki", "Trevenant", "Gourgeist", "Avalugg", "Avalugg", "Noivern", "Decidueye", "Decidueye", "Incineroar",
        "Primarina", "Toucannon", "Crabominable", "Mega Crabominable", "Lycanroc", "Toxapex", "Mudsdale", "Araquanid",
        "Salazzle", "Tsareena", "Oranguru", "Passimian", "Mimikyu", "Drampa", "Mega Drampa", "Kommo-o", "Corviknight",
        "Flapple", "Appletun", "Sandaconda", "Polteageist", "Hatterene", "Mr. Rime", "Runerigus", "Alcremie", "Morpeko",
        "Dragapult", "Wyrdeer", "Kleavor", "Basculegion", "Sneasler", "Meowscarada", "Skeledirge", "Quaquaval", "Maushold",
        "Garganacl", "Armarouge", "Ceruledge", "Bellibolt", "Scovillain", "Mega Scovillain", "Espathra", "Tinkaton",
        "Palafin", "Orthworm", "Glimmora", "Mega Glimmora", "Farigiraf", "Kingambit", "Sinistcha", "Archaludon", "Hydrapple"
    ];

    const typeColors = {
        normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C", grass: "#7AC74C",
        ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1", ground: "#E2BF65", flying: "#A98FF3",
        psychic: "#F95587", bug: "#A6B91A", rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC",
        dark: "#705746", steel: "#B7B7CE", fairy: "#D685AD"
    };

    const instanceMap = {};

    function getPokeApiSlug(name) {
        if (!instanceMap[name]) instanceMap[name] = 0;
        instanceMap[name]++;
        const count = instanceMap[name];

        const lower = name.toLowerCase().replace(/ \/ | /g, '-').replace(/[^a-z0-9-]/g, '');
        let base = lower;
        let suffix = "";

        if (lower.startsWith('mega-')) {
            base = lower.replace('mega-', '') + '-mega';
        }

        // Mapping slugs and regional suffixes
        let slug = base;
        
        if (name === "Mega Charizard") slug = count === 1 ? "charizard-mega-x" : "charizard-mega-y";
        else if (name === "Raichu") { slug = count === 1 ? "raichu" : "raichu-alola"; if(count === 2) suffix = "Alola"; }
        else if (name === "Ninetales") { slug = count === 1 ? "ninetales" : "ninetales-alola"; if(count === 2) suffix = "Alola"; }
        else if (name === "Arcanine") { slug = count === 1 ? "arcanine" : "arcanine-hisui"; if(count === 2) suffix = "Hisui"; }
        else if (name === "Slowbro") { slug = count === 1 ? "slowbro" : "slowbro-galar"; if(count === 2) suffix = "Galar"; }
        else if (name === "Tauros") { slug = count === 1 ? "tauros" : "tauros-paldea-combat-breed"; if(count === 2) suffix = "Paldea"; }
        else if (name === "Typhlosion") { slug = count === 1 ? "typhlosion" : "typhlosion-hisui"; if(count === 2) suffix = "Hisui"; }
        else if (name === "Slowking") { slug = count === 1 ? "slowking" : "slowking-galar"; if(count === 2) suffix = "Galar"; }
        else if (name === "Samurott") { slug = count === 1 ? "samurott" : "samurott-hisui"; if(count === 2) suffix = "Hisui"; }
        else if (name === "Zoroark") { slug = count === 1 ? "zoroark" : "zoroark-hisui"; if(count === 2) suffix = "Hisui"; }
        else if (name === "Stunfisk") { slug = count === 1 ? "stunfisk" : "stunfisk-galar"; if(count === 2) suffix = "Galar"; }
        else if (name === "Goodra") { slug = count === 1 ? "goodra" : "goodra-hisui"; if(count === 2) suffix = "Hisui"; }
        else if (name === "Avalugg") { slug = count === 1 ? "avalugg" : "avalugg-hisui"; if(count === 2) suffix = "Hisui"; }
        else if (name === "Decidueye") { slug = count === 1 ? "decidueye" : "decidueye-hisui"; if(count === 2) suffix = "Hisui"; }

        else if (name === "Mega Greninja") slug = "greninja-ash";
        else if (base === "mimikyu") slug = "mimikyu-disguised";
        else if (base === "aegislash") slug = "aegislash-shield";
        else if (base === "gourgeist") slug = "gourgeist-average";
        else if (base === "palafin") slug = "palafin-zero";

        return { slug, suffix };
    }

    const container = document.getElementById('pokemon-container');

    async function loadPokemon() {
        if (!container) return;

        let loadedCount = 0;
        
        // Cargar en lotes de 10 para no saturar 
        const batchSize = 10;
        for (let i = 0; i < rawPokemonList.length; i += batchSize) {
            const batch = rawPokemonList.slice(i, i + batchSize);
            
            const promises = batch.map(async (requestedName) => {
                const { slug, suffix } = getPokeApiSlug(requestedName);
                
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
                    if (!response.ok) {
                        console.warn(`No se encontró: ${slug}`);
                        return null; 
                    }
                    const data = await response.json();
                    return { requestedName, data, suffix };
                } catch (error) {
                    console.error(`Error al recuperar ${slug}`, error);
                    return null;
                }
            });

            const results = await Promise.all(promises);

            if (i === 0) container.innerHTML = ''; // Limpiar loader inicial
            results.forEach((item, index) => {
                if (!item) return;
                
                const { requestedName, data, suffix } = item;
                const absoluteIndex = i + index + 1;
                const card = document.createElement('div');
                card.className = 'reward-card';

                const displayName = suffix ? `${requestedName} de ${suffix}` : requestedName;
                
                card.style.animation = 'fadeIn 0.5s ease forwards';
                card.style.opacity = '0';
                card.style.animationDelay = `${(loadedCount % batchSize) * 50}ms`;
                
                const spriteDefault = data.sprites.other['official-artwork'].front_default || data.sprites.front_default || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                const spriteShiny = data.sprites.other['official-artwork'].front_shiny || data.sprites.front_shiny || spriteDefault;
                
                const types = data.types.map(t => t.type.name);
                const typeTags = types.map(t => `<span style="background:${typeColors[t]}; padding: 2px 6px; border-radius: 4px; font-size:0.7rem; color:#fff; text-shadow: 1px 1px 1px #000; text-transform: uppercase;">${t}</span>`).join(' ');
                
                const bgType = types[0];
                const bgGradient = `linear-gradient(135deg, ${typeColors[bgType]}44 0%, #0e0e10 100%)`;

                const customId = `poke_${absoluteIndex}`;
                const isShinySaved = shinyPokemon.includes(customId);
                const activeSprite = isShinySaved ? spriteShiny : spriteDefault;

                card.innerHTML = `
                    <div class="reward-image-container" style="background: ${bgGradient}; height: 150px; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 1rem; display: flex; align-items: center; justify-content: center; position: relative;">
                        <img src="${activeSprite}" alt="${displayName}" style="max-height: 110px; max-width: 110px; object-fit: contain; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.6));" class="poke-image">
                        <div class="card-language" style="position: absolute; top: 10px; left: 10px; background: transparent; border:none; padding: 2px 6px; font-weight: bold; font-size: 0.8rem; text-shadow: 1px 1px 3px rgba(0,0,0,0.9);">#${absoluteIndex.toString().padStart(2, '0')}</div>
                        <div class="card-language" style="background: transparent; border:none; text-shadow: 1px 1px 3px rgba(0,0,0,0.9); font-size: 0.8rem;">#${data.id.toString().padStart(3, '0')}</div>
                        <div class="owned-badge"><i class="fas fa-check"></i></div>
                        <div class="shiny-btn" title="Activar modo Shiny"><i class="fas fa-star"></i></div>
                    </div>
                    <div class="reward-info" style="gap: 2px;">
                        <h2 class="reward-name" title="${displayName}" style="color: var(--text-primary); text-transform: capitalize; margin-bottom: 4px; font-size: 1.15rem; font-weight: 800;">${displayName}</h2>
                        <div style="display: flex; gap: 5px; margin-bottom: auto; flex-wrap: wrap;">
                            ${typeTags}
                        </div>
                    </div>
                `;

                card.setAttribute('data-sprite-default', spriteDefault);
                card.setAttribute('data-sprite-shiny', spriteShiny);

                if (isShinySaved) {
                    card.classList.add('pokemon-shiny');
                }

                // Logic to identify base name for Mega synchronizing
                let baseName = requestedName;
                if (requestedName.startsWith("Mega ")) {
                    baseName = requestedName.substring(5).split(' ')[0]; 
                }
                
                // For regional forms, unique identity
                if (suffix) {
                    baseName += "-" + suffix; 
                }
                
                card.setAttribute('data-base-name', baseName);

                if (ownedPokemon.includes(customId)) {
                    card.classList.add('pokemon-owned');
                }
                
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    const currentlyOwned = card.classList.contains('pokemon-owned');
                    const newState = !currentlyOwned;
                    
                    // Synchronize all related Megas/Base forms
                    const relatedCards = container.querySelectorAll(`[data-base-name="${baseName}"]`);
                    relatedCards.forEach(c => {
                        const targetId = c.getAttribute('data-id-ref');
                        if (newState) {
                            c.classList.add('pokemon-owned');
                            if (!ownedPokemon.includes(targetId)) ownedPokemon.push(targetId);
                        } else {
                            c.classList.remove('pokemon-owned');
                            ownedPokemon = ownedPokemon.filter(id => id !== targetId);
                        }
                    });

                    localStorage.setItem('ownedPokemon', JSON.stringify(ownedPokemon));
                    
                    const resetBtn = document.getElementById('reset-pokedex');
                    const hasSomeProgress = ownedPokemon.length > 0 || shinyPokemon.length > 0;
                    if (resetBtn) resetBtn.style.display = hasSomeProgress ? 'inline-flex' : 'none';
                });

                // Shiny toggle login
                const shinyBtn = card.querySelector('.shiny-btn');
                if (shinyBtn) {
                    shinyBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const currentlyShiny = card.classList.contains('pokemon-shiny');
                        const newState = !currentlyShiny;
                        
                        // Synchronize all related Megas/Base forms for Shiny status
                        const relatedCards = container.querySelectorAll(`[data-base-name="${baseName}"]`);
                        relatedCards.forEach(c => {
                            const targetId = c.getAttribute('data-id-ref');
                            const img = c.querySelector('.poke-image');
                            const sShiny = c.getAttribute('data-sprite-shiny');
                            const sDefault = c.getAttribute('data-sprite-default');
                            
                            if (newState) {
                                c.classList.add('pokemon-shiny');
                                if (img && sShiny) img.src = sShiny;
                                if (!shinyPokemon.includes(targetId)) shinyPokemon.push(targetId);
                            } else {
                                c.classList.remove('pokemon-shiny');
                                if (img && sDefault) img.src = sDefault;
                                shinyPokemon = shinyPokemon.filter(id => id !== targetId);
                            }
                        });

                        localStorage.setItem('shinyPokemon', JSON.stringify(shinyPokemon));
                        
                        const resetBtn = document.getElementById('reset-pokedex');
                        const hasSomeProgress = ownedPokemon.length > 0 || shinyPokemon.length > 0;
                        if (resetBtn) resetBtn.style.display = hasSomeProgress ? 'inline-flex' : 'none';
                    });
                }

                card.setAttribute('data-id-ref', customId);
                container.appendChild(card);
                loadedCount++;
            });
        }
    }

    // Load only when user clicks the pokemon tab for the first time, to save network
    const pokemonTabBtn = document.querySelector('.tab-btn[data-tab="pokemon"]');
    let loaded = false;
    let ownedPokemon = JSON.parse(localStorage.getItem('ownedPokemon') || '[]');
    let shinyPokemon = JSON.parse(localStorage.getItem('shinyPokemon') || '[]');

    const resetBtn = document.getElementById('reset-pokedex');
    if (resetBtn) {
        resetBtn.style.display = (ownedPokemon.length > 0 || shinyPokemon.length > 0) ? 'inline-flex' : 'none';
        resetBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas borrar todo tu progreso de captura (incluyendo Shinies)?')) {
                localStorage.removeItem('ownedPokemon');
                localStorage.removeItem('shinyPokemon');
                ownedPokemon = [];
                shinyPokemon = [];
                document.querySelectorAll('.reward-card').forEach(card => {
                    card.classList.remove('pokemon-owned');
                    card.classList.remove('pokemon-shiny');
                });
                resetBtn.style.display = 'none';
            }
        });
    }

    if (pokemonTabBtn) {
        pokemonTabBtn.addEventListener('click', () => {
            if (!loaded) {
                loaded = true;
                loadPokemon();
            }
        });

        // Trigger load if it's the default active tab on startup
        if (pokemonTabBtn.classList.contains('active')) {
            loaded = true;
            loadPokemon();
        }
    }
});
