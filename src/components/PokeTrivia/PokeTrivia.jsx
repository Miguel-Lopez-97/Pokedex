import React, { useState, useEffect } from "react";
import "./poketrivia.css";

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
    { name: "Gen 8 (Galar)", limit: 96, offset: 809, url: "https://pokeapi.co/api/v2/pokemon/?offset=809&limit=96" },
    { name: "Gen 9 (Paldea)", limit: 120, offset: 905, url: "https://pokeapi.co/api/v2/pokemon/?offset=905&limit=120" },
    { name: "Alternative Forms", limit: 10000, offset: 1025, url: "https://pokeapi.co/api/v2/pokemon/?offset=1025&limit=10000" }
];

const TYPES = [
    "Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug",
    "Ghost", "Steel", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice",
    "Dragon", "Dark", "Fairy"
];

const ALPHABET = "abcdefghijklmnopqrstuvwxyz-".split("");

const PERCENTAGES = [
    { label: "100%", value: 1.0 },
    { label: "50%", value: 0.5 },
    { label: "25%", value: 0.25 },
    { label: "10%", value: 0.1 },
    { label: "10 Pokémon (Quick)", value: 0 } // Special value for fixed 10
];

export function PokeTrivia() {
    const [gameState, setGameState] = useState("setup");
    const [genUrl, setGenUrl] = useState(GENERATIONS[0].url);
    const [percentage, setPercentage] = useState(0.25); // Default 25%
    const [pokemonQueue, setPokemonQueue] = useState([]);
    const [currentPokemon, setCurrentPokemon] = useState(null);

    // Game Logic State
    const [phase, setPhase] = useState("name"); // name, type, ability
    const [revealedIndices, setRevealedIndices] = useState(new Set()); // Indices of correctly guessed chars
    const [inputValue, setInputValue] = useState("");
    const [mistakes, setMistakes] = useState(0);
    const [score, setScore] = useState(0);

    const [loadingMsg, setLoadingMsg] = useState("");

    // Ability Modal State
    const [showAbilityModal, setShowAbilityModal] = useState(false);
    const [abilityInfo, setAbilityInfo] = useState({ name: "", desc: "" });

    // Type Phase
    const [selectedTypes, setSelectedTypes] = useState([]);

    // Ability Phase
    const [abilityOptions, setAbilityOptions] = useState([]);

    const fetchPokemonDetails = async (url) => {
        const res = await fetch(url);
        const d = await res.json();
        return {
            id: d.id,
            name: d.name,
            types: d.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
            abilities: d.abilities.map(a => a.ability.name),
            sprite: d.sprites.other?.home?.front_default || d.sprites.front_default
        };
    };

    const startGame = async (e) => {
        e.preventDefault();
        setGameState("loading");
        setLoadingMsg("Catching'em all...");
        setScore(0);
        setMistakes(0);

        try {
            const res = await fetch(genUrl);
            const data = await res.json();
            let candidates = data.results;

            // Shuffle
            for (let i = candidates.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
            }

            // Calculate count based on percentage
            let count = 10;
            if (percentage > 0) {
                count = Math.ceil(candidates.length * percentage);
            }
            if (count < 1) count = 1;

            // Take calculated count
            setPokemonQueue(candidates.slice(0, count));

            await loadNextPokemon(candidates[0]);
            setPokemonQueue(prev => prev.slice(1));
            setGameState("playing");
        } catch (err) {
            console.error(err);
            alert("Error starting game");
            setGameState("setup");
        }
    };

    const loadNextPokemon = async (candidate) => {
        setLoadingMsg("Who's that Pokémon?");
        const details = await fetchPokemonDetails(candidate.url);
        setCurrentPokemon(details);

        // Reset Round State
        setRevealedIndices(new Set());
        setInputValue("");
        setSelectedTypes([]);
        setShowAbilityModal(false); // Ensure modal is closed
        setAbilityInfo({ name: "", desc: "" });

        // Sprite Check: If no sprite, skip Name phase
        if (!details.sprite) {
            setPhase("type");
        } else {
            setPhase("name");
        }

        // Prepare Ability Options (1 correct + 3 random)
        // Note: For simplicity, we just take 3 fake strings or fetch randoms?
        // Better: fetch a few random abilities from API or hardcode common ones is tricky without extra calls.
        // Let's use a small set of mock abilities or just other pokemon's abilities if we had them.
        // For now, let's fetch 3 random types to mix in or just generic placeholders is boring.
        // Let's actually fetch 3 random ability names from the pokeapi ability list!
        // Optimization: Just mock for now or fetch list once.
        // Let's try to get 3 random abilities from a hardcoded list of common ones to avoid spamming API.
        const commonAbilities = ["overgrow", "blaze", "torrent", "shield-dust", "shed-skin", "compound-eyes", "swarm", "keen-eye", "run-away", "intimidate", "static", "sand-veil", "synchronize", "levitate", "pressure", "thick-fat", "chlorophyll", "swift-swim"];

        const correctAbility = details.abilities[0]; // Take first as 'correct' for simplicity if multiple
        const distractors = [];
        while (distractors.length < 3) {
            const r = commonAbilities[Math.floor(Math.random() * commonAbilities.length)];
            if (r !== correctAbility && !distractors.includes(r)) distractors.push(r);
        }
        const options = [...distractors, correctAbility].sort(() => Math.random() - 0.5);
        setAbilityOptions(options);
    };

    const handleInputSubmit = (e) => {
        e.preventDefault();
        if (phase !== "name") return;

        const guess = inputValue.toLowerCase().trim();
        const target = currentPokemon.name.toLowerCase();

        if (guess === target) {
            // Perfect match
            setRevealedIndices(new Set(target.split('').map((_, i) => i)));
            setTimeout(() => setPhase("type"), 500);
        } else {
            // Partial check
            setMistakes(m => m + 1);
            const newRevealed = new Set(revealedIndices);

            // Reveal characters that match at the correct index
            guess.split('').forEach((char, i) => {
                if (i < target.length && char === target[i]) {
                    newRevealed.add(i);
                }
            });

            setRevealedIndices(newRevealed);
            setInputValue(""); // Clear input for retry
        }
    };

    const handleTypeClick = (type) => {
        if (phase !== "type") return;

        // Check if correct
        if (currentPokemon.types.includes(type)) {
            const newSelected = [...selectedTypes, type];
            setSelectedTypes(newSelected);

            // Check if all types found
            const allFound = currentPokemon.types.every(t => newSelected.includes(t));
            if (allFound) {
                setTimeout(() => setPhase("ability"), 500);
            }
        } else {
            setMistakes(m => m + 1);
            alert(`Wrong! ${type} is not a type of ${currentPokemon.name}`);
        }
    };

    const getAbilityDescription = async (abilityName) => {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
            const data = await res.json();
            const entry = data.flavor_text_entries.find(e => e.language.name === 'en');
            return entry ? entry.flavor_text : "No description available.";
        } catch (e) {
            console.error(e);
            return "Could not load description.";
        }
    };

    const handleSuccessAbility = async (abilityName) => {
        const desc = await getAbilityDescription(abilityName);
        setAbilityInfo({ name: abilityName, desc: desc });
        setShowAbilityModal(true);
    };

    const handleAbilityClick = (ability) => {
        if (phase !== "ability") return;

        if (currentPokemon.abilities.includes(ability)) {
            // Correct!
            setScore(s => s + 1);
            handleSuccessAbility(ability);
        } else {
            setMistakes(m => m + 1);
            alert("Wrong Ability!");
        }
    };

    const nextStageOrPokemon = () => {
        setShowAbilityModal(false); // Close modal
        if (pokemonQueue.length > 0) {
            // Next Pokemon
            setLoadingMsg("Next Pokémon...");
            const next = pokemonQueue[0];
            setPokemonQueue(prev => prev.slice(1));
            loadNextPokemon(next);
        } else {
            setGameState("victory");
        }
    };

    const handleGiveUp = async () => {
        setMistakes(m => m + 2); // Double penalty

        if (phase === "name") {
            // Reveal name then move to type
            setRevealedIndices(new Set(currentPokemon.name.split('').map((_, i) => i)));
            setTimeout(() => setPhase("type"), 1000);
        } else if (phase === "type") {
            // Reveal types then move to ability
            // We can just fill selectedTypes with the correct ones to show them
            setSelectedTypes(currentPokemon.types);
            setTimeout(() => setPhase("ability"), 1000);
        } else if (phase === "ability") {
            // Show Correct Ability Info instead of just skipping
            const correct = currentPokemon.abilities[0]; // Take first correct
            handleSuccessAbility(correct);
        }
    };

    return (
        <div className="poketrivia-container">
            {gameState === "setup" && (
                <form className="setup-form" onSubmit={startGame}>
                    <h1>PokéTrivia Challenge</h1>

                    <div className="instructions-box">
                        <h3>How to Play</h3>
                        <p>Prove you are a master by guessing entire data flows!</p>
                        <ol className="instructions-list">
                            <li><strong>Name</strong>: Guess the Pokémon hidden by the silhouette.</li>
                            <li><strong>Types</strong>: Select the correct type(s).</li>
                            <li><strong>Ability</strong>: Identify the correct ability from the options.</li>
                        </ol>
                    </div>

                    <div className="form-group">
                        <label>Select Generation</label>
                        <select value={genUrl} onChange={e => setGenUrl(e.target.value)}>
                            {GENERATIONS.map(g => <option key={g.name} value={g.url}>{g.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Game Length (% of Gen)</label>
                        <select
                            value={percentage}
                            onChange={e => setPercentage(parseFloat(e.target.value))}
                        >
                            {PERCENTAGES.map(p => <option key={p.label} value={p.value}>{p.label}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="start-btn">Start Challenge</button>
                </form>
            )}

            {gameState === "loading" && <h2>{loadingMsg}</h2>}

            {gameState === "playing" && currentPokemon && (
                <div className="game-area">
                    <button
                        className="reconfigure-btn"
                        onClick={() => setGameState("setup")}
                    >
                        Reconfigure
                    </button>
                    <div className="score-board">
                        <span>Score: {score}/{pokemonQueue.length + 1}</span>
                        <span className="mistakes-count">Mistakes: {mistakes}</span>
                    </div>

                    <div className="pokemon-display">
                        <img
                            src={currentPokemon.sprite || "https://www.latercera.com/resizer/CBmGvvFEACkiaL4Diatt7wyUqlM=/900x600/smart/arc-anglerfish-arc2-prod-copesa.s3.amazonaws.com/public/LUOOHUM2OVEEXG7ZTRSNI6XWLY.png"}
                            alt="Who's that pokemon?"
                            className="pokemon-image"
                        />

                        {/* NAME PHASE */}
                        {phase === "name" && (
                            <div className="name-phase">
                                <h3 className="phase-title">Type the name!</h3>
                                <div className="hangman-word">
                                    {currentPokemon.name.split('').map((char, i) => (
                                        <span key={i} className={`letter-slot ${revealedIndices.has(i) ? 'letter-revealed' : ''}`}>
                                            {char === '-' ? '-' : (revealedIndices.has(i) ? char : "_")}
                                        </span>
                                    ))}
                                </div>
                                <form onSubmit={handleInputSubmit} className="input-form">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type Pokémon name..."
                                        className="trivia-input"
                                        autoFocus
                                    />
                                    <button type="submit" className="check-btn">Check</button>
                                </form>
                                <button onClick={handleGiveUp} className="give-up-btn give-up-btn-small">Give Up (+2 Errors)</button>
                            </div>
                        )}

                        {/* TYPE PHASE */}
                        {phase === "type" && (
                            <>
                                <h2 className="pokemon-name-title">{currentPokemon.name}</h2>
                                <h2>Select the correct Type(s)!</h2>
                                <div className="types-display">
                                    {currentPokemon.types.map((t, i) => (
                                        <span key={i} className="type-btn-static"
                                            style={{
                                                background: selectedTypes.includes(t) ? undefined : '#333', /* We keep this dynamic inline because it depends on the specific matching type color which is complex to class entirely without many classes or CSS vars */
                                            }}
                                            data-type={selectedTypes.includes(t) ? t : ""}
                                        >
                                            {selectedTypes.includes(t) ? t : "???"}
                                        </span>
                                    ))}
                                </div>
                                <div className="type-selector">
                                    {TYPES.map(t => (
                                        <button key={t} className="type-btn" data-type={t} onClick={() => handleTypeClick(t)}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={handleGiveUp} className="give-up-btn">Give Up (+2 Errors)</button>
                            </>
                        )}

                        {/* ABILITY PHASE */}
                        {phase === "ability" && (
                            <>
                                <h2 className="pokemon-name-title">{currentPokemon.name}</h2>
                                <h2>Select the correct Ability!</h2>
                                <div className="ability-selector">
                                    {abilityOptions.map(a => (
                                        <button key={a} className="ability-btn" onClick={() => handleAbilityClick(a)}>
                                            {a}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={handleGiveUp} className="give-up-btn">Give Up (+2 Errors)</button>
                            </>
                        )}

                    </div>
                </div>
            )}

            {gameState === "victory" && (
                <div className="overlay">
                    <h1 className="victory-title">Victory!</h1>
                    <p>You completed a set of 10 Pokémon!</p>
                    <p>Total Mistakes: {mistakes}</p>
                    <button className="start-btn" onClick={() => setGameState("setup")}>Play Again</button>
                </div>
            )}

            {showAbilityModal && (
                <div className="overlay">
                    <h2 className="pokemon-name-title">{abilityInfo.name}</h2>
                    <p className="overlay-description">{abilityInfo.desc}</p>
                    <button className="check-btn" onClick={nextStageOrPokemon}>Continue</button>
                </div>
            )}
        </div>
    );
}
