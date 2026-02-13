import React, { useState } from "react";
import "./movehigherlower.css";



const TYPES = [
    "Any", "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire",
    "Flying", "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison",
    "Psychic", "Rock", "Steel", "Water"
];

const CATEGORIES = [
    "Any", "Physical", "Special", "Status"
];

const STATS = [
    { label: "Power", value: "power" },
    { label: "PP", value: "pp" },
    { label: "Accuracy", value: "accuracy" }
];

const PERCENTAGES = [
    { label: "100%", value: 1.0 },
    { label: "50%", value: 0.5 },
    { label: "25%", value: 0.25 },
    { label: "10%", value: 0.1 },
    { label: "10 Moves (Quick)", value: 0 }
];

export function MoveHigherLower() {
    const [gameState, setGameState] = useState("setup");
    const [filters, setFilters] = useState({
        type: "Any",
        category: "Any",
        stat: "power",
        percentage: 0.25
    });

    const [gameQueue, setGameQueue] = useState([]);
    const [score, setScore] = useState(0);
    const [totalMoves, setTotalMoves] = useState(0);
    const [leftMove, setLeftMove] = useState(null);
    const [rightMove, setRightMove] = useState(null);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [resultMsg, setResultMsg] = useState(null);

    const fetchMoveDetails = async (url) => {
        const res = await fetch(url);
        const d = await res.json();
        return {
            id: d.id,
            name: d.name.replace(/-/g, " "),
            type: d.type.name,
            category: d.damage_class.name,
            power: d.power || 0,
            pp: d.pp || 0,
            accuracy: d.accuracy || 0,
            flavor: d.flavor_text_entries.find(e => e.language.name === "en")?.flavor_text || ""
        };
    };

    const startGame = async (e) => {
        e.preventDefault();
        setGameState("loading");
        setLoadingMsg("Gathering Moves...");
        setScore(0);
        setResultMsg(null);

        try {
            let candidates = [];

            // 1. Fetch based on Filters
            // We need to intersect lists if multiple filters are active.
            // Strategy: 
            // - If Gen is selected, fetch Gen moves. 
            // - If Type is selected, fetch Type moves.
            // - If both, find intersection.
            // - If neither, fetch all moves (limit 2000).

            let listsToIntersect = [];



            if (filters.type !== "Any") {
                const res = await fetch(`https://pokeapi.co/api/v2/type/${filters.type.toLowerCase()}`);
                const data = await res.json();
                listsToIntersect.push(data.moves);
            }

            if (filters.category !== "Any") {
                // If filtering by Power and Category is Status -> Error
                if (filters.stat === "power" && filters.category === "Status") {
                    alert("Status moves have 0 Power! Please choose a different Category or Stat.");
                    setGameState("setup");
                    return;
                }

                const res = await fetch(`https://pokeapi.co/api/v2/move-damage-class/${filters.category.toLowerCase()}`);
                const data = await res.json();
                listsToIntersect.push(data.moves);
            } else if (filters.stat === "power") {
                // If Category is ANY but Stat is POWER -> Exclude Status moves
                // Fetch Physical and Special and start with that union
                const pRes = await fetch("https://pokeapi.co/api/v2/move-damage-class/physical");
                const pData = await pRes.json();

                const sRes = await fetch("https://pokeapi.co/api/v2/move-damage-class/special");
                const sData = await sRes.json();

                // Union of Physical + Special
                const combined = [...pData.moves, ...sData.moves];
                listsToIntersect.push(combined);
            }

            if (listsToIntersect.length === 0) {
                // Fetch all
                const res = await fetch("https://pokeapi.co/api/v2/move?limit=2000");
                const data = await res.json();
                candidates = data.results;
            } else {
                // Intersect
                // Use Name as key
                candidates = listsToIntersect[0];
                for (let i = 1; i < listsToIntersect.length; i++) {
                    const currentSet = new Set(listsToIntersect[i].map(m => m.name));
                    candidates = candidates.filter(m => currentSet.has(m.name));
                }
            }

            // Filter out moves that might have null stats for the chosen stat?
            // We'll handle nulls in details fetch (treat as 0)

            if (candidates.length < 2) {
                alert("Not enough moves found! Try broader filters.");
                setGameState("setup");
                return;
            }

            // Shuffle
            setLoadingMsg("Shuffling Moves...");
            for (let i = candidates.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
            }

            // Slice based on percentage
            let count = 10;
            if (filters.percentage > 0) {
                count = Math.ceil(candidates.length * filters.percentage);
            }
            if (count < 2) count = 2; // Minimum

            setGameQueue(candidates.slice(0, count)); // Limit game queue
            setTotalMoves(count);

            // Fetch first two
            setLoadingMsg("Preparing Battle...");

            // Ensure we have enough candidates
            if (candidates.length < 2) {
                alert("Not enough moves found for this combination!");
                setGameState("setup");
                return;
            }

            const first = await fetchMoveDetails(candidates[0].url);
            const second = await fetchMoveDetails(candidates[1].url);

            setLeftMove(first);
            setRightMove(second);
            setGameQueue(prev => prev.slice(2));
            setGameState("playing");

        } catch (err) {
            console.error(err);
            alert("Error starting game.");
            setGameState("setup");
        }
    };

    const getStatValue = (move) => {
        return move[filters.stat];
    };

    const getStatLabel = () => {
        return STATS.find(s => s.value === filters.stat).label;
    };

    const handleGuess = async (guess) => {
        if (resultMsg) return;

        const leftVal = getStatValue(leftMove);
        const rightVal = getStatValue(rightMove);

        let isCorrect = false;
        if (guess === 'higher') isCorrect = rightVal > leftVal;
        else if (guess === 'lower') isCorrect = rightVal < leftVal;
        else if (guess === 'equal') isCorrect = rightVal === leftVal;

        if (isCorrect) {
            setResultMsg("Correct!");
            setTimeout(async () => {
                setScore(s => s + 1);

                if (gameQueue.length === 0) {
                    setGameState("victory");
                    return;
                }

                setResultMsg(null);
                setLeftMove(rightMove);

                // Fetch next
                try {
                    const next = await fetchMoveDetails(gameQueue[0].url);
                    setRightMove(next);
                    setGameQueue(prev => prev.slice(1));
                } catch (e) {
                    alert("Error loading next move");
                }
            }, 1000);
        } else {
            setResultMsg("WRONG!");
            setTimeout(() => setGameState("gameover"), 1500);
        }
    };

    return (
        <div className="move-higher-lower-container">
            {gameState === "setup" && (
                <form className="setup-form" onSubmit={startGame}>
                    <h1>Move Higher Lower</h1>

                    <div className="instructions-box">
                        <h3>How to Play</h3>
                        <p>Guess if the <strong>Hidden Move</strong> has a Higher or Lower Power/Accuracy/PP.</p>
                        <ul className="instructions-list">
                            <li><strong>Power</strong>: Damage potential.</li>
                            <li><strong>Accuracy</strong>: Hit chance.</li>
                            <li><strong>PP</strong>: Usage count.</li>
                        </ul>
                    </div>

                    <div className="form-group">
                        <label>Type</label>
                        <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
                            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Compare Stat</label>
                        <select value={filters.stat} onChange={e => setFilters({ ...filters, stat: e.target.value })}>
                            {STATS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Game Length (% of Pool)</label>
                        <select value={filters.percentage} onChange={e => setFilters({ ...filters, percentage: parseFloat(e.target.value) })}>
                            {PERCENTAGES.map(p => <option key={p.label} value={p.value}>{p.label}</option>)}
                        </select>
                    </div>

                    <button type="submit" className="start-btn">Start Game</button>
                    {/* Duplicate Instructions removed */}
                </form>
            )}

            {gameState === "loading" && <h1>{loadingMsg}</h1>}

            {(gameState === "playing" || gameState === "gameover" || gameState === "victory") && leftMove && rightMove && (
                <div className="game-area">
                    <button
                        className="reset-btn"
                        onClick={() => setGameState("setup")}
                    >
                        Reconfigure
                    </button>
                    <div className="score-board">
                        <span>Score: {score} / {totalMoves}</span>
                    </div>

                    <div className="cards-container">
                        {/* LEFT CARD */}
                        <div className="move-card left-card">
                            <div className="move-info">
                                <div className="move-name">{leftMove.name}</div>
                                <div className="move-type" data-type={leftMove.type}>{leftMove.type}</div>
                                <div className={`category-${leftMove.category} move-category`}>{leftMove.category}</div>
                                <div className="move-flavor">
                                    "{leftMove.flavor}"
                                </div>
                            </div>

                            <div className="move-stat-display">
                                <div className="stat-label">{getStatLabel()}</div>
                                <div className="stat-value">{getStatValue(leftMove)}</div>
                            </div>
                        </div>

                        <div className="vs-circle">VS</div>

                        {/* RIGHT CARD */}
                        <div className="move-card right-card">
                            <div className={`move-info ${gameState === "playing" && !resultMsg ? "move-info-hidden" : ""}`}>
                                <div className="move-name">{rightMove.name}</div>
                                <div className="move-type" data-type={rightMove.type}>{rightMove.type}</div>
                                <div className={`category-${rightMove.category} move-category`}>{rightMove.category}</div>
                                <div className="move-flavor">
                                    "{rightMove.flavor}"
                                </div>
                            </div>

                            <div className="move-stat-display">
                                <div className="stat-label">{getStatLabel()}</div>
                                <div className="stat-value">
                                    {(resultMsg || gameState !== "playing") ? getStatValue(rightMove) : "???"}
                                </div>
                            </div>
                        </div>

                        {/* CONTROLS (Side) */}
                        {gameState === "playing" && !resultMsg && (
                            <div className="controls-side">
                                <button className="guess-btn btn-higher" onClick={() => handleGuess('higher')}>▲ Higher</button>
                                <button className="guess-btn btn-equal" onClick={() => handleGuess('equal')}>= Equal</button>
                                <button className="guess-btn btn-lower" onClick={() => handleGuess('lower')}>▼ Lower</button>
                            </div>
                        )}
                    </div>

                    {resultMsg && (
                        <div className={`result-feedback ${resultMsg === "Correct!" ? "result-correct" : "result-wrong"}`}>
                            {resultMsg}
                        </div>
                    )}

                    {gameState === "gameover" && (
                        <div className="overlay">
                            <h1 className="overlay-title-gameover">Game Over</h1>
                            <p>You scored {score}!</p>
                            <div className="overlay-details">
                                <p className="overlay-text-small">{rightMove.name} has {getStatValue(rightMove)} {getStatLabel()}</p>
                                <button onClick={() => setGameState("setup")}>Try Again</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
