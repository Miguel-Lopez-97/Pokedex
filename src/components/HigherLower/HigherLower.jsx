import React, { useState, useEffect } from "react";
import { PokemonIndividual } from "../Card/card";
import "./higherlower.css";

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
    { name: "Alternative Forms", limit: 10000, offset: 1025, url: "https://pokeapi.co/api/v2/pokemon/?offset=1025&limit=10000", customMin: 10001, customMax: 99999 }
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
    { label: "Speed", value: "speed" },
    { label: "Weight", value: "weight" },
    { label: "Height", value: "height" }
];

const PERCENTAGES = [
    { label: "100%", value: 1.0 },
    { label: "75%", value: 0.75 },
    { label: "50%", value: 0.5 },
    { label: "25%", value: 0.25 },
    { label: "10%", value: 0.1 }
];

export function HigherLower() {
    const [gameState, setGameState] = useState("setup"); // setup, loading, playing, victory, gameover
    const [filters, setFilters] = useState({
        genUrl: GENERATIONS[0].url,
        stat: "total",
        percentage: 0.25, // Default 25%
        type: "Any"
    });

    const [gameQueue, setGameQueue] = useState([]);
    const [currentScore, setCurrentScore] = useState(0);
    const [leftPokemon, setLeftPokemon] = useState(null);
    const [rightPokemon, setRightPokemon] = useState(null);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [resultMsg, setResultMsg] = useState(null); // "Correct!", "Wrong!"

    // Helper to fetch details
    const fetchPokemonDetails = async (url) => {
        const res = await fetch(url);
        const d = await res.json();
        const total = d.stats.reduce((acc, s) => acc + s.base_stat, 0);

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
            weight: d.weight,
            height: d.height
        };
    };

    const getGenRange = (genUrl) => {
        const gen = GENERATIONS.find(g => g.url === genUrl);
        if (!gen) return { min: 0, max: 10000 };
        if (gen.customMin) return { min: gen.customMin, max: gen.customMax };
        return { min: gen.offset + 1, max: gen.offset + gen.limit };
    };

    const getPokemonIdFromUrl = (url) => {
        const parts = url.split('/');
        return parseInt(parts[parts.length - 2]);
    };

    const startGame = async (e) => {
        e.preventDefault();
        setGameState("loading");
        setLoadingMsg("Fetching Pokémon List...");
        setCurrentScore(0);
        setResultMsg(null);

        try {
            let candidates = [];

            // 1. Fetch Candidates (Gen OR Type -> Gen Filter)
            if (filters.type === "Any") {
                const res = await fetch(filters.genUrl);
                const data = await res.json();
                candidates = data.results;
            } else {
                // Fetch by Type
                const res = await fetch(`https://pokeapi.co/api/v2/type/${filters.type.toLowerCase()}`);
                const data = await res.json();
                // data.pokemon is array of { pokemon: { name, url }, slot }
                const allTypePokemon = data.pokemon.map(p => p.pokemon);

                // Filter by Gen Range
                const { min, max } = getGenRange(filters.genUrl);
                candidates = allTypePokemon.filter(p => {
                    const id = getPokemonIdFromUrl(p.url);
                    return id >= min && id <= max;
                });
            }

            if (candidates.length < 2) {
                alert("Not enough Pokémon found with these filters (Type + Gen)! Try a different combination.");
                setGameState("setup");
                return;
            }

            // 2. Shuffle
            setLoadingMsg("Shuffling Deck...");
            for (let i = candidates.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
            }

            // 3. Slice Percentage
            let count = Math.ceil(candidates.length * filters.percentage);
            if (count < 2) count = 2; // Ensure at least 2 to play

            const selectedCandidates = candidates.slice(0, count);

            setLoadingMsg(`Loading first cards (0/${count})...`);

            // 4. Fetch Details
            const first = await fetchPokemonDetails(selectedCandidates[0].url);
            const second = await fetchPokemonDetails(selectedCandidates[1].url);

            setLeftPokemon(first);
            setRightPokemon(second);
            setGameQueue(selectedCandidates.slice(2));

            setGameState("playing");

        } catch (err) {
            console.error(err);
            alert("Error starting game. Check console.");
            setGameState("setup");
        }
    };

    const getStatValue = (pokemon) => {
        if (!pokemon) return 0;
        const key = filters.stat;
        if (key === 'total') return pokemon.stats.total;
        if (key === 'weight') return pokemon.weight / 10; // kg
        if (key === 'height') return pokemon.height / 10; // m
        return pokemon.stats[key.replace('-', '_')];
    };

    const getStatLabel = () => {
        return STATS.find(s => s.value === filters.stat)?.label;
    };

    const handleGuess = async (guess) => {
        if (resultMsg) return; // Prevent double clicks

        const leftVal = getStatValue(leftPokemon);
        const rightVal = getStatValue(rightPokemon);

        let isCorrect = false;
        if (guess === 'higher') isCorrect = rightVal >= leftVal;
        else if (guess === 'lower') isCorrect = rightVal <= leftVal;

        // Show result
        if (isCorrect) {
            setResultMsg("Correct!");
            setTimeout(async () => {
                setCurrentScore(prev => prev + 1);

                if (gameQueue.length === 0) {
                    setGameState("victory");
                    return;
                }

                setResultMsg(null);
                setLeftPokemon(rightPokemon);

                const nextCandidate = gameQueue[0];
                setGameQueue(prev => prev.slice(1));

                try {
                    const nextP = await fetchPokemonDetails(nextCandidate.url);
                    setRightPokemon(nextP);
                } catch (e) {
                    console.error("Error fetching next card", e);
                    alert("Error loading next card");
                }
            }, 1000);
        } else {
            setResultMsg("WRONG!");
            setTimeout(() => {
                setGameState("gameover");
            }, 1500);
        }
    };

    return (
        <div className="higher-lower-container">
            {gameState === "setup" && (
                <form className="setup-form" onSubmit={startGame}>
                    <h1>Higher or Lower?</h1>

                    <div className="form-group">
                        <label>Generation</label>
                        <select
                            value={filters.genUrl}
                            onChange={e => setFilters({ ...filters, genUrl: e.target.value })}
                        >
                            {GENERATIONS.map(g => <option key={g.name} value={g.url}>{g.name}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Type</label>
                        <select
                            value={filters.type}
                            onChange={e => setFilters({ ...filters, type: e.target.value })}
                        >
                            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Stat to Compare</label>
                        <select
                            value={filters.stat}
                            onChange={e => setFilters({ ...filters, stat: e.target.value })}
                        >
                            {STATS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Game Length (% of Gen)</label>
                        <select
                            value={filters.percentage}
                            onChange={e => setFilters({ ...filters, percentage: parseFloat(e.target.value) })}
                        >
                            {PERCENTAGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                    </div>

                    <button type="submit" className="start-btn">Start Game</button>
                </form>
            )}

            {gameState === "loading" && <h1>{loadingMsg}</h1>}

            {(gameState === "playing" || gameState === "victory" || gameState === "gameover") && leftPokemon && rightPokemon && (
                <div className="game-area">
                    <div className="score-board">
                        <span>Score: {currentScore}</span>
                        <span>Remaining: {gameQueue.length + 1}</span>
                    </div>

                    <div className="cards-container">
                        {/* Left Card - Known */}
                        <div className={`card-wrapper left-card`}>
                            <PokemonIndividual
                                name={leftPokemon.name}
                                dex={leftPokemon.dex}
                                avatarNormal={leftPokemon.sprites.front_default}
                                avatarShiny={leftPokemon.sprites.front_shiny}
                                type1={leftPokemon.types[0]}
                                type2={leftPokemon.types[1] || "null"}
                                ability1={leftPokemon.abilities?.[0]?.ability?.name || "undefined"}
                                ability2={leftPokemon.abilities?.[1]?.ability?.name || "null"}
                                hp={leftPokemon.stats.hp}
                                attack={leftPokemon.stats.attack}
                                defense={leftPokemon.stats.defense}
                                specialAttack={leftPokemon.stats.special_attack}
                                specialDefense={leftPokemon.stats.special_defense}
                                speed={leftPokemon.stats.speed}
                                hidden={false}
                                customStat={{ label: getStatLabel(), value: getStatValue(leftPokemon) }}
                            />
                        </div>

                        <div className="vs-circle">VS</div>

                        {/* Right Card - Stats Hidden */}
                        <div className={`card-wrapper right-card`}>
                            {/* Controls Overlay if playing */}
                            {gameState === "playing" && !resultMsg && (
                                <div className="controls" style={{
                                    position: 'absolute',
                                    zIndex: 50,
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '80%'
                                }}>
                                    <button className="guess-btn btn-higher" onClick={() => handleGuess('higher')}>
                                        Higher ▲
                                    </button>
                                    <button className="guess-btn btn-lower" onClick={() => handleGuess('lower')}>
                                        Lower ▼
                                    </button>
                                </div>
                            )}

                            <div style={{ transition: 'all 0.5s' }}>
                                <PokemonIndividual
                                    name={rightPokemon.name}
                                    dex={rightPokemon.dex}
                                    avatarNormal={rightPokemon.sprites.front_default}
                                    avatarShiny={rightPokemon.sprites.front_shiny}
                                    type1={rightPokemon.types[0]}
                                    type2={rightPokemon.types[1] || "null"}
                                    ability1={rightPokemon.abilities?.[0]?.ability?.name || "undefined"}
                                    ability2={rightPokemon.abilities?.[1]?.ability?.name || "null"}
                                    hp={rightPokemon.stats.hp}
                                    attack={rightPokemon.stats.attack}
                                    defense={rightPokemon.stats.defense}
                                    specialAttack={rightPokemon.stats.special_attack}
                                    specialDefense={rightPokemon.stats.special_defense}
                                    speed={rightPokemon.stats.speed}
                                    hidden={false}
                                    // Custom Stat shows '???' when playing
                                    // Added 'glass-stat' class or inline style could be handled here or in card.jsx if supported
                                    // For now we just use the customStat prop which card re-renders. 
                                    customStat={(resultMsg || gameState === 'gameover' || gameState === 'victory')
                                        ? { label: getStatLabel(), value: getStatValue(rightPokemon) }
                                        : { label: getStatLabel(), value: "???" }
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {resultMsg && (
                        <div style={{
                            position: 'absolute',
                            zIndex: 100,
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            color: resultMsg === "Correct!" ? '#4caf50' : '#ff4444',
                            textShadow: '2px 2px 5px black',
                            top: '40%'
                        }}>
                            {resultMsg}
                        </div>
                    )}

                    {gameState === "gameover" && (
                        <div className="overlay">
                            <h1 style={{ color: '#ff4444' }}>Game Over</h1>
                            <p>You scored {currentScore}!</p>
                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'center' }}>
                                <p style={{ fontSize: '1rem' }}>The {getStatLabel()} of {rightPokemon.name} was {getStatValue(rightPokemon)}</p>
                                <button onClick={() => setGameState("setup")}>Try Again</button>
                            </div>
                        </div>
                    )}

                    {gameState === "victory" && (
                        <div className="overlay">
                            <h1 style={{ color: '#4caf50' }}>Victory!</h1>
                            <p>You completed the list!</p>
                            <button onClick={() => setGameState("setup")}>Play Again</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
