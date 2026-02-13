import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./pokeguess.css";

const GENERATIONS = [
    { name: "All Generations", url: "https://pokeapi.co/api/v2/pokemon/?limit=10000&offset=0" },
    { name: "Gen 1", url: "https://pokeapi.co/api/v2/pokemon/?limit=151&offset=0" },
    { name: "Gen 2", url: "https://pokeapi.co/api/v2/pokemon/?limit=100&offset=151" },
    { name: "Gen 3", url: "https://pokeapi.co/api/v2/pokemon/?limit=135&offset=251" },
    { name: "Gen 4", url: "https://pokeapi.co/api/v2/pokemon/?limit=107&offset=386" },
    { name: "Gen 5", url: "https://pokeapi.co/api/v2/pokemon/?limit=156&offset=493" },
    { name: "Gen 6", url: "https://pokeapi.co/api/v2/pokemon/?limit=72&offset=649" },
    { name: "Gen 7", url: "https://pokeapi.co/api/v2/pokemon/?limit=88&offset=721" },
    { name: "Gen 8", url: "https://pokeapi.co/api/v2/pokemon/?offset=809&limit=96" },
    { name: "Gen 9", url: "https://pokeapi.co/api/v2/pokemon/?offset=905&limit=120" },
];

const TYPES = [
    "Any", "Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug",
    "Ghost", "Steel", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice",
    "Dragon", "Dark", "Fairy"
];

export function PokeGuess() {
    const location = useLocation();
    const navigate = useNavigate();
    const [gameState, setGameState] = useState("setup"); // setup, loading, playing
    const [filters, setFilters] = useState({
        genUrl: GENERATIONS[0].url,
        type: "Any"
    });

    const [board, setBoard] = useState([]); // Array of pokemon objects
    const [isShiny, setIsShiny] = useState(false); // New state for Shiny toggle

    const [myPokemonId, setMyPokemonId] = useState(null);
    const [eliminatedIds, setEliminatedIds] = useState(new Set()); // IDs of eliminated pokemon
    const [showWinConfirm, setShowWinConfirm] = useState(false);
    const [victory, setVictory] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [shareUrl, setShareUrl] = useState("");

    // Check for shared board on mount
    useEffect(() => {
        const fetchPokemonDetails = async (idOrUrl) => {
            // Can accept ID (int) or URL (string)
            const url = typeof idOrUrl === 'number'
                ? `https://pokeapi.co/api/v2/pokemon/${idOrUrl}`
                : idOrUrl;

            const res = await fetch(url);
            const d = await res.json();

            return {
                id: d.id,
                name: d.name,
                types: d.types.map(t => t.type.name),
                spriteNormal: d.sprites.other?.home?.front_default || d.sprites.front_default,
                spriteShiny: d.sprites.other?.home?.front_shiny || d.sprites.front_shiny
            };
        };

        const loadSharedBoard = async (idsString) => {
            setGameState("loading");
            setLoadingMsg("Loading Shared Board...");

            try {
                const ids = idsString.split(',').map(id => parseInt(id));
                const pokemonData = await Promise.all(ids.map(id => fetchPokemonDetails(id)));

                setBoard(pokemonData);
                setGameState("playing");
                setShareUrl(window.location.href);
            } catch (e) {
                console.error(e);
                alert("Error loading shared board.");
                setGameState("setup");
            }
        };

        const params = new URLSearchParams(location.search);
        const ids = params.get("ids");
        if (ids) {
            loadSharedBoard(ids);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    // Check for win condition (all eliminated)
    useEffect(() => {
        if (gameState === "playing" && board.length > 0 && eliminatedIds.size === board.length) {
            setShowWinConfirm(true);
        }
    }, [eliminatedIds, board, gameState]);

    const handleWinConfirm = (didWin) => {
        if (didWin) {
            setVictory(true);
            setShowWinConfirm(false);
        } else {
            // Reset board
            setEliminatedIds(new Set());
            setShowWinConfirm(false);
        }
    };

    const fetchPokemonDetails = async (idOrUrl) => {
        // Can accept ID (int) or URL (string)
        const url = typeof idOrUrl === 'number'
            ? `https://pokeapi.co/api/v2/pokemon/${idOrUrl}`
            : idOrUrl;

        const res = await fetch(url);
        const d = await res.json();

        return {
            id: d.id,
            name: d.name,
            types: d.types.map(t => t.type.name),
            spriteNormal: d.sprites.other?.home?.front_default || d.sprites.front_default,
            spriteShiny: d.sprites.other?.home?.front_shiny || d.sprites.front_shiny
        };
    };

    const loadSharedBoard = async (idsString) => {
        setGameState("loading");
        setLoadingMsg("Loading Shared Board...");

        try {
            const ids = idsString.split(',').map(id => parseInt(id));
            const pokemonData = await Promise.all(ids.map(id => fetchPokemonDetails(id)));

            setBoard(pokemonData);
            setGameState("playing");
            setShareUrl(window.location.href);
        } catch (e) {
            console.error(e);
            alert("Error loading shared board.");
            setGameState("setup");
        }
    };

    const generateBoard = async (e) => {
        e.preventDefault();
        setGameState("loading");
        setLoadingMsg("Generating Board...");
        setEliminatedIds(new Set());
        setMyPokemonId(null);
        setShareUrl("");
        setVictory(false);
        setShowWinConfirm(false);
        setEliminatedIds(new Set());

        try {
            // 1. Fetch Candidates based on Gen
            const res = await fetch(filters.genUrl);
            const data = await res.json();
            let candidates = data.results;

            // 2. Filter by Type if needed
            if (filters.type !== "Any") {
                const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${filters.type.toLowerCase()}`);
                const typeData = await typeRes.json();
                const typePokemonNames = new Set(typeData.pokemon.map(p => p.pokemon.name));
                candidates = candidates.filter(c => typePokemonNames.has(c.name));
            }

            if (candidates.length < 20) {
                alert("Not enough Pokémon found! Try broader filters.");
                setGameState("setup");
                return;
            }

            // 3. Shuffle
            for (let i = candidates.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
            }

            // 4. Select 20 valid Pokémon (with images)
            // We fetch details in batches until we have 20 valid ones
            const validBoard = [];
            let i = 0;
            while (validBoard.length < 20 && i < candidates.length) {
                // Fetch next batch of 5 to speed up
                const batch = candidates.slice(i, i + 5);
                const results = await Promise.all(batch.map(c => fetchPokemonDetails(c.url)));

                for (const p of results) {
                    if (p.spriteNormal) { // Only add if it has an image
                        validBoard.push(p);
                        if (validBoard.length === 20) break;
                    }
                }
                i += 5;
            }

            if (validBoard.length < 20) {
                alert("Could not find 20 Pokémon with images. Try broader filters.");
                setGameState("setup");
                return;
            }

            setBoard(validBoard);

            // 5. Generate Share URL
            const ids = validBoard.map(p => p.id).join(',');
            const baseUrl = window.location.origin + window.location.pathname;
            const url = `${baseUrl}?ids=${ids}`;
            setShareUrl(url);
            navigate(`?ids=${ids}`, { replace: true }); // Update local URL

            setGameState("playing");

        } catch (e) {
            console.error(e);
            alert("Error generating board.");
            setGameState("setup");
        }
    };

    const toggleEliminate = (id) => {
        // If it's your pokemon, don't eliminate it? Or allow it? 
        // Standard Guess Who: You physically flip down cards.
        // If I click a card, I toggle its eliminated status.
        // Unless it's "selecting my pokemon" mode? 

        // Let's make it intuitive: 
        // Left click = Eliminate/Restore
        // Right click (or separate button) = Select as MINE?

        // Simpler: Just click to Eliminate. 
        // Have a separate "Select Yours" dropdown or initial phase?
        // User asked: "I choose my pokemon... keep it secret". 
        // Maybe we just add a small "Mine" button on each card?

        const newSet = new Set(eliminatedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setEliminatedIds(newSet);
    };

    const selectMyPokemon = (id, e) => {
        e.stopPropagation(); // Prevent elimination toggle
        if (myPokemonId === id) setMyPokemonId(null); // Deselect
        else setMyPokemonId(id);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard! Send it to your friend.");
    };

    return (
        <div className="pokeguess-container">
            {gameState === "setup" && (
                <form className="setup-form" onSubmit={generateBoard}>
                    <h1>PokeGuess Setup</h1>

                    <div className="game-instructions">
                        <h3>How to Play (Multiplayer)</h3>
                        <ol className="instructions-list">
                            <li><strong>Generate</strong>: Pick filters and create a board.</li>
                            <li><strong>Share</strong>: Click "Share Board" inside to get a link. Send it to a friend!</li>
                            <li><strong>Secret Pokémon</strong>: Both players pick a secret Pokémon by clicking the Star (★) on a card.</li>
                            <li><strong>Guessing</strong>: Take turns asking Yes/No questions (e.g., "Is it Water type?").</li>
                            <li><strong>Eliminate</strong>: Click cards to flip them down if they don't match.</li>
                            <li><strong>Win</strong>: The last one standing (or the correct guess) wins!</li>
                        </ol>
                    </div>

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

                    <button type="submit" className="start-btn">Generate Board</button>
                    {/* Duplicate Button Removed */}

                </form>
            )}

            {gameState === "loading" && <h2>{loadingMsg}</h2>}

            {gameState === "playing" && (
                <div className="game-board">
                    <div className="board-header">
                        <h1>PokeGuess</h1>
                        <div className="board-actions">
                            <button className="action-btn btn-share" onClick={copyToClipboard}>🔗 Share Board</button>
                            <button className={`action-btn ${isShiny ? 'btn-shiny-on' : 'btn-shiny-off'}`} onClick={() => setIsShiny(!isShiny)}>
                                {isShiny ? '✨ Shiny ON' : '✨ Shiny OFF'}
                            </button>
                            <button className="action-btn btn-reset" onClick={() => setEliminatedIds(new Set())}>↺ Reset Flips</button>
                            <button className="action-btn btn-exit" onClick={() => setGameState("setup")}>Reconfigure</button>
                        </div>
                    </div>

                    {!myPokemonId && (
                        <div className="instructions">
                            <strong>Step 1:</strong> Select YOUR Mystery Pokémon by clicking the star symbol on a card.
                        </div>
                    )}
                    {myPokemonId && (
                        <div className="instructions">
                            <strong>Step 2:</strong> Click cards to "Flip Done" (Eliminate) them based on your opponent's answers.
                        </div>
                    )}

                    <div className="cards-grid">
                        {board.map(p => {
                            const isEliminated = eliminatedIds.has(p.id);
                            const isMine = myPokemonId === p.id;

                            return (
                                <div
                                    key={p.id}
                                    className={`guess-card ${isEliminated ? 'eliminated' : ''} ${isMine ? 'selected-my-pokemon' : ''}`}
                                    onClick={() => toggleEliminate(p.id)}
                                >
                                    {isMine && <div className="status-badge badge-mine">MY POKEMON</div>}

                                    <button
                                        className={`star-btn ${isMine ? 'active' : ''}`}
                                        title="Mark as My Pokemon"
                                        onClick={(e) => selectMyPokemon(p.id, e)}
                                    >
                                        ★
                                    </button>

                                    <img src={isShiny ? (p.spriteShiny || p.spriteNormal) : p.spriteNormal} alt={p.name} />
                                    <div className="name">{p.name}</div>
                                    <div className="types">{p.types.join(" / ")}</div>
                                </div>
                            );
                        })}
                    </div>

                    {showWinConfirm && (
                        <div className="overlay">
                            <div className="modal-content">
                                <h2>All Pokémon Eliminated!</h2>
                                <p>Did you guess the opponent's Pokémon correctly?</p>
                                <div className="modal-buttons">
                                    <button
                                        className="action-btn btn-win-yes"
                                        onClick={() => handleWinConfirm(true)}
                                    >
                                        🏆 Yes, I Won!
                                    </button>
                                    <button
                                        className="action-btn btn-win-no"
                                        onClick={() => handleWinConfirm(false)}
                                    >
                                        ↺ No, Reset Board
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {victory && (
                        <div className="overlay">
                            <div className="modal-content victory">
                                <h1 className="victory-title">🎉 CONGRATULATIONS! 🎉</h1>
                                <p className="victory-text">You are a Pokémon Master!</p>
                                <button
                                    className="start-btn"
                                    onClick={() => { setVictory(false); setEliminatedIds(new Set()); }}
                                >
                                    Play Again (Reset Flips)
                                </button>
                                <button
                                    className="start-btn btn-new-game"
                                    onClick={() => setGameState("setup")}
                                >
                                    New Game
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
