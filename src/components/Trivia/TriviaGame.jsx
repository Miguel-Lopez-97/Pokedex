import React, { useState, useEffect } from "react";
import { PokemonIndividual } from "../Card/card";
import "./trivia.css";

const GENERATIONS = [
    { name: "All Generations", limit: 10000, offset: 0, url: "https://pokeapi.co/api/v2/pokemon/?limit=10000&offset=0" },
    { name: "Gen 1 (Kanto)", limit: 151, offset: 0, url: "https://pokeapi.co/api/v2/pokemon/?limit=151&offset=0" },
    { name: "Gen 2 (Johto)", limit: 100, offset: 151, url: "https://pokeapi.co/api/v2/pokemon/?limit=100&offset=151" },
    { name: "Gen 3 (Hoenn)", limit: 135, offset: 251, url: "https://pokeapi.co/api/v2/pokemon/?limit=135&offset=251" },
    { name: "Gen 4 (Sinnoh)", limit: 107, offset: 386, url: "https://pokeapi.co/api/v2/pokemon/?limit=107&offset=386" },
    { name: "Gen 5 (Unova)", limit: 156, offset: 493, url: "https://pokeapi.co/api/v2/pokemon/?limit=156&offset=493" },
    { name: "Gen 6 (Kalos)", limit: 72, offset: 649, url: "https://pokeapi.co/api/v2/pokemon/?limit=72&offset=649" },
    { name: "Gen 7 (Alola)", limit: 88, offset: 721, url: "https://pokeapi.co/api/v2/pokemon/?limit=88&offset=721" },
    { name: "Gen 8 (Galar)", limit: 96, offset: 809, url: "https://pokeapi.co/api/v2/pokemon/?offset=809&limit=96" },
    { name: "Gen 9 (Paldea)", limit: 120, offset: 905, url: "https://pokeapi.co/api/v2/pokemon/?offset=905&limit=120" },
    { name: "Alternative Forms", limit: 1000, offset: 1025, url: "https://pokeapi.co/api/v2/pokemon/?offset=1025&limit=1000" },
];



const TYPES = [
    "Any", "Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug",
    "Ghost", "Steel", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice",
    "Dragon", "Dark", "Fairy"
];

const STATS = [
    { label: "Total Base Stats", value: "total" },
    { label: "HP", value: "hp" },
    { label: "Attack", value: "attack" },
    { label: "Defense", value: "defense" },
    { label: "Special Attack", value: "special-attack" },
    { label: "Special Defense", value: "special-defense" },
    { label: "Speed", value: "speed" }
];

export function TriviaGame() {
    const [gameState, setGameState] = useState("setup"); // setup, loading, playing, victory, gameover
    const [filters, setFilters] = useState({
        genUrl: GENERATIONS[0].url,
        type: "Any",
        stat: "total",
        order: "desc", // desc = Highest, asc = Lowest
        limit: 5,
        includeAltForms: false,
        difficulty: "normal" // easy, normal, hard
    });

    const [gameData, setGameData] = useState([]);
    const [revealedIds, setRevealedIds] = useState([]);
    const [revealedHints, setRevealedHints] = useState({}); // { [pokemonId]: count_revealed (0-3) }
    const [searchQuery, setSearchQuery] = useState("");
    const [allPokemonNames, setAllPokemonNames] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [lives, setLives] = useState(5);
    const [maxLives, setMaxLives] = useState(5);

    // Fetch all names for autocomplete on mount
    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon/?limit=10000")
            .then(res => res.json())
            .then(data => {
                setAllPokemonNames(data.results.map(p => p.name));
            });
    }, []);

    const handleStartGame = async (e) => {
        if (e) e.preventDefault();
        setGameState("loading");
        setRevealedIds([]);
        setRevealedHints({});
        setSearchQuery("");

        // Initial lives set purely for UI stability before load
        setLives(5);
        setMaxLives(5);

        try {
            // 1. Fetch initial list from Gen URL
            // User requested strict logic: Gen -> Type -> Sort
            const res = await fetch(filters.genUrl);
            const data = await res.json();
            let candidates = data.results;

            // 2. Fetch details for ALL candidates
            // Note: For "All Generations", this fetches 1000+ items.
            // This matches the user's requested logic flow.
            const detailedPokemon = await Promise.all(
                candidates.map(async (p) => {
                    const r = await fetch(p.url);
                    const d = await r.json();

                    // Calculate Total Stats
                    const total = d.stats.reduce((acc, s) => acc + s.base_stat, 0);



                    // Fetch Species Data for Hints
                    const speciesRes = await fetch(d.species.url);
                    const speciesData = await speciesRes.json();

                    const genusEntry = speciesData.genera.find(g => g.language.name === 'es');
                    const genus = genusEntry ? genusEntry.genus : "Unknown Pokémon";

                    // Generate Hints Pool
                    const availableHints = [];
                    // Hint 1: Type(s)
                    availableHints.push(`Type: ${d.types.map(t => t.type.name).join(' / ')}`);
                    // Hint 2: First Ability
                    if (d.abilities.length > 0) availableHints.push(`Ability: ${d.abilities[0].ability.name}`);
                    // Hint 3: Category
                    availableHints.push(`Category: The ${genus}`);
                    // Hint 4: First Letter
                    availableHints.push(`Starts with: ${d.name.charAt(0).toUpperCase()}`);

                    // Shuffle and select 3 unique hints
                    const shuffledHints = availableHints.sort(() => 0.5 - Math.random()).slice(0, 3);


                    return {
                        id: d.id,
                        name: d.name,
                        dex: d.id,
                        types: d.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
                        stats: {
                            hp: d.stats[0].base_stat,
                            attack: d.stats[1].base_stat,
                            defense: d.stats[2].base_stat,
                            special_attack: d.stats[3].base_stat,
                            special_defense: d.stats[4].base_stat,
                            speed: d.stats[5].base_stat,
                            total: total
                        },
                        sprites: {
                            front_default: d.sprites.other?.home?.front_default || d.sprites.front_default,
                            front_shiny: d.sprites.other?.home?.front_shiny || d.sprites.front_shiny
                        },
                        abilities: d.abilities,
                        hints: shuffledHints
                    };
                })
            );

            let processedData = detailedPokemon;

            // 3. Filter by Type (Primary or Secondary)
            // We do this AFTER fetching details because Gen List doesn't have type info
            const filtered = processedData.filter(d => {
                if (filters.type === "Any") return true;
                return d.types.includes(filters.type);
            });

            // 4. Filter Alt Forms logic (Simplified: if we excluded them, remove IDs > 10000 usually)
            let filteredAltForms = filtered;
            if (!filters.includeAltForms) {
                filteredAltForms = filteredAltForms.filter(p => p.id < 10000);
            }

            // 5. Sort by Stat
            filteredAltForms.sort((a, b) => {
                let valA = 0;
                let valB = 0;

                if (filters.stat === 'total') {
                    valA = a.stats.total;
                    valB = b.stats.total;

                } else {
                    valA = a.stats[filters.stat.replace('-', '_')];
                    valB = b.stats[filters.stat.replace('-', '_')];
                }



                return filters.order === 'desc' ? valB - valA : valA - valB;
            });

            // 5. Slice Top N
            let limitCount = filters.limit;
            if (filters.limit === "50%") {
                limitCount = Math.ceil(filteredAltForms.length / 2);
            }

            const topN = filteredAltForms.slice(0, limitCount);

            // Dynamic Lives Calculation based on ACTUAL result count
            // (e.g., if user wants Top 10 but only 3 exist, count lives for 3)
            let actualCount = topN.length;
            let calculatedLives = actualCount;
            if (filters.difficulty === "easy") calculatedLives = actualCount * 2;
            if (filters.difficulty === "hard") calculatedLives = Math.ceil(actualCount / 2);

            setLives(calculatedLives);
            setMaxLives(calculatedLives);

            setGameData(topN);

            if (topN.length === 0) {
                alert("No Pokémon found with these filters! Try a different combination.");
                setGameState("setup");
                return;
            }

            setGameState("playing");
        } catch (err) {
            console.error(err);
            alert("Error loading data. Please try a smaller range.");
            setGameState("setup");
        }
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchQuery(val);

        if (val.length > 2) {
            const match = allPokemonNames.filter(n => n.includes(val.toLowerCase())).slice(0, 5);
            setSuggestions(match);
        } else {
            setSuggestions([]);
        }
    };

    const submitGuess = (name) => {
        const target = gameData.find(p => p.name.toLowerCase() === name.toLowerCase());
        if (target) {
            if (!revealedIds.includes(target.id)) {
                const newRevealed = [...revealedIds, target.id];
                setRevealedIds(newRevealed);

                // Clear hints for this pokemon (optional, or leave them visible)
                // setRevealedHints({...revealedHints, [target.id]: 0}); 

                setSearchQuery("");
                setSuggestions([]);



                if (newRevealed.length === gameData.length) {
                    setGameState("victory");
                }
            }
        } else {
            // Wrong Guess
            const newLives = lives - 1;
            setLives(newLives);
            setSearchQuery(""); // Clear input on wrong guess? Optional. Keeping it makes it easier to delete.
            // Maybe provide feedback "Wrong!"? For now, just deduction.

            if (newLives <= 0) {
                setGameState("gameover");
            }
        }
    };

    const handleRevealHint = (pokemonId) => {
        if (lives <= 0) return;

        const newCost = 1;
        if (lives - newCost < 0) {
            alert("Not enough lives to reveal a hint!");
            return;
        }

        setLives(lives - newCost);
        setRevealedHints({
            ...revealedHints,
            [pokemonId]: (revealedHints[pokemonId] || 0) + 1
        });

        if (lives - newCost <= 0) {
            setGameState("gameover");
        }
    };

    return (
        <div className="trivia-container">
            {gameState === "setup" && (
                <form className="setup-form" onSubmit={handleStartGame}>
                    <h1>Configure Trivia Game</h1>

                    <div className="form-group">
                        <label>Generation</label>
                        <select value={filters.genUrl} onChange={e => setFilters({ ...filters, genUrl: e.target.value })}>
                            {GENERATIONS.map(g => <option key={g.name} value={g.url}>{g.name}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Type</label>
                        <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
                            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ranking Metric</label>
                        <select value={filters.stat} onChange={e => setFilters({ ...filters, stat: e.target.value })}>
                            {STATS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Order</label>
                        <select value={filters.order} onChange={e => setFilters({ ...filters, order: e.target.value })}>
                            <option value="desc">Highest First</option>
                            <option value="asc">Lowest First</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Top N</label>
                        <select
                            value={filters.limit}
                            onChange={e => {
                                const val = e.target.value;
                                setFilters({ ...filters, limit: val === "50%" ? "50%" : parseInt(val) });
                            }}
                        >
                            <option value="3">Top 3</option>
                            <option value="5">Top 5</option>
                            <option value="10">Top 10</option>
                            <option value="15">Top 15</option>
                            <option value="20">Top 20</option>
                            <option value="50%">Top 50%</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Difficulty</label>
                        <select value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
                            <option value="easy">Easy (Double Lives)</option>
                            <option value="normal">Normal (1 Life per Pokémon)</option>
                            <option value="hard">Hard (Half Lives)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={filters.includeAltForms}
                                onChange={e => setFilters({ ...filters, includeAltForms: e.target.checked })}
                            />
                            Include Alternative Forms
                        </label>
                    </div>

                    <button type="submit" className="start-btn">Start Game</button>
                </form>
            )}

            {gameState === "loading" && <h1>Loading Game Data... This may take a moment.</h1>}

            {(gameState === "playing" || gameState === "victory" || gameState === "gameover") && (
                <div className="game-area">
                    <button
                        className="reset-btn"
                        style={{ alignSelf: 'flex-end', marginRight: '10%', marginBottom: '1rem', background: '#555', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        onClick={() => setGameState("setup")}
                    >
                        Reconfigure
                    </button>
                    <div className="config-summary">
                        <span><strong>Gen:</strong> {GENERATIONS.find(g => g.url === filters.genUrl)?.name}</span>
                        <span><strong>Type:</strong> {filters.type}</span>
                        <span><strong>Ranking:</strong> {filters.limit} {filters.order === 'desc' ? 'Highest' : 'Lowest'} {STATS.find(s => s.value === filters.stat)?.label}</span>
                        <span><strong>Diff:</strong> {filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1)}</span>
                    </div>

                    <div className="lives-display">
                        <h2>Lives: {Array(lives).fill('❤️').join('')} ({lives}/{maxLives})</h2>
                        <h3 style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#ffd700' }}>
                            Found: {revealedIds.length} / {gameData.length}
                        </h3>
                    </div>
                    <div className="search-container">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Who's that Pokémon?"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        {suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map(s => (
                                    <li key={s} className="suggestion-item" onClick={() => submitGuess(s)}>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>



                    {gameState === "gameover" && (
                        <div className="victory-message" style={{ borderColor: '#ff4444', boxShadow: '0 0 50px rgba(255, 68, 68, 0.5)' }}>
                            <h1 style={{ color: '#ff4444' }}>💀 Game Over 💀</h1>
                            <p>You ran out of lives!</p>
                            <button className="reset-btn" onClick={() => setGameState("setup")}>Try Again</button>
                        </div>
                    )}

                    {gameState === "victory" && (
                        <div className="victory-message">
                            <h1>🎉 Victory! 🎉</h1>
                            <p>You revealed all the top Pokémon!</p>
                            <button className="reset-btn" onClick={() => setGameState("setup")}>Play Again</button>
                        </div>
                    )}

                    <div className="cards-grid">
                        {gameData.map(p => {
                            const isRevealed = revealedIds.includes(p.id);

                            // Map data to match PokemonIndividual props
                            // Note: PokemonIndividual expects specific prop names

                            // Determine which stat to show based on filters.stat
                            let displayedStat = null;
                            if (isRevealed) {
                                const statKey = filters.stat;
                                const statLabel = STATS.find(s => s.value === statKey)?.label || "Stat";
                                let statValue = 0;

                                if (statKey === 'total') {
                                    statValue = p.stats.total;
                                } else {
                                    statValue = p.stats[statKey.replace('-', '_')];
                                }

                                displayedStat = { label: statLabel, value: statValue };
                            }

                            return (
                                <div key={p.id} className={!isRevealed ? "card-hidden" : ""}>
                                    <PokemonIndividual
                                        name={isRevealed ? p.name : "???"}
                                        dex={p.dex}
                                        avatarNormal={p.sprites.front_default}
                                        avatarShiny={p.sprites.front_shiny}
                                        type1={p.types[0]}
                                        type2={p.types[1] || "null"}
                                        ability1={p.abilities[0]?.ability?.name || "null"}
                                        ability2={p.abilities[1]?.ability?.name || "null"}
                                        hp={p.stats.hp}
                                        attack={p.stats.attack}
                                        defense={p.stats.defense}
                                        specialAttack={p.stats.special_attack}
                                        specialDefense={p.stats.special_defense}
                                        speed={p.stats.speed}
                                        // Hidden prop handles the ??? and image logic
                                        hidden={!isRevealed}
                                        // showStats={false} // We don't need this anymore as customStat overrides it or we handle it in card.jsx
                                        customStat={displayedStat}
                                    />
                                    {!isRevealed && p.hints && (
                                        <div className="hints-section" style={{ display: 'flex', marginTop: '10px', zIndex: 100 }}>
                                            {p.hints.slice(0, revealedHints[p.id] || 0).map((hint, index) => (
                                                <div key={index} className="hint-text">💡 {hint}</div>
                                            ))}
                                            {(revealedHints[p.id] || 0) < 3 && (
                                                <button
                                                    className="hint-btn"
                                                    style={{ display: 'inline-block' }}
                                                    onClick={() => handleRevealHint(p.id)}
                                                >
                                                    Reveal Hint (-1 ❤️)
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
