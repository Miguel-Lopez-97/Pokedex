import React, { useState, useEffect } from "react";
import "../header/Nav/navigation.css";
import "./home.css";
import { PokemonIndividual } from "../Card/card";
import { TeamAnalysis } from "../Analysis/TeamAnalysis"; // Import Analysis
import "../Trivia/trivia.css";

// Alphabetical Order
const TYPES = [
  "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire",
  "Flying", "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison",
  "Psychic", "Rock", "Steel", "Water"
];

export const typeColors = {
  Normal: "#A8A77A",
  Fire: "#EE8130",
  Water: "#6390F0",
  Electric: "#F7D02C",
  Grass: "#7AC74C",
  Ice: "#96D9D6",
  Fighting: "#C22E28",
  Poison: "#A33EA1",
  Ground: "#E2BF65",
  Flying: "#A98FF3",
  Psychic: "#F95587",
  Bug: "#A6B91A",
  Rock: "#B6A136",
  Ghost: "#735797",
  Dragon: "#6F35FC",
  Steel: "#B7B7CE",
  Fairy: "#D685AD",
  Dark: "rgb(112, 88, 72)"
};

const GENERATIONS = [
  { name: "All Generations", limit: 100000, offset: 0 },
  { name: "Gen 1 (Kanto)", limit: 151, offset: 0 },
  { name: "Gen 2 (Johto)", limit: 100, offset: 151 },
  { name: "Gen 3 (Hoenn)", limit: 135, offset: 251 },
  { name: "Gen 4 (Sinnoh)", limit: 107, offset: 386 },
  { name: "Gen 5 (Unova)", limit: 156, offset: 493 },
  { name: "Gen 6 (Kalos)", limit: 72, offset: 649 },
  { name: "Gen 7 (Alola)", limit: 88, offset: 721 },
  { name: "Gen 8 (Galar)", limit: 96, offset: 809 },
  { name: "Gen 9 (Paldea)", limit: 120, offset: 905 },
  { name: "Alternative Forms", limit: 100000, offset: 10000 }
];

export function Home() {
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem("pokeTeam");
    return saved ? JSON.parse(saved) : {};
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [availablePokemon, setAvailablePokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [genFilter, setGenFilter] = useState(GENERATIONS[0].name);
  const [isShiny, setIsShiny] = useState(false);
  const [isMinimalist, setIsMinimalist] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Track hovered slot for showing removal button
  const [hoveredSlot, setHoveredSlot] = useState(null);

  useEffect(() => {
    localStorage.setItem("pokeTeam", JSON.stringify(team));
  }, [team]);

  const openTypeModal = async (type) => {
    setSelectedType(type);
    setModalOpen(true);
    setLoading(true);
    setSearchQuery("");
    setIsShiny(false);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
      const data = await res.json();
      setAvailablePokemon(data.pokemon.map(p => p.pokemon));
    } catch (err) {
      console.error("Error fetching type data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPokemon = async (url) => {
    try {
      const res = await fetch(url);
      const json = await res.json();

      let speciesId = json.id;
      if (json.species && json.species.url) {
        const parts = json.species.url.split('/');
        speciesId = parseInt(parts[parts.length - 2]);
      }

      const mainSprite = isShiny
        ? (json.sprites.other.home.front_shiny || json.sprites.front_shiny)
        : (json.sprites.other.home.front_default || json.sprites.front_default);

      const pokemonData = {
        id: json.id,
        dex: json.id,
        speciesId: speciesId,
        name: json.name[0].toUpperCase() + json.name.slice(1),
        avatarNormal: mainSprite,
        avatarShiny: null,
        type1: json.types[0].type.name[0].toUpperCase() + json.types[0].type.name.slice(1),
        type2: json.types.length === 2 ? json.types[1].type.name[0].toUpperCase() + json.types[1].type.name.slice(1) : "null",
        ability1: (json.abilities && json.abilities.length > 0) ? json.abilities[0].ability.name : "undefined",
        ability2: (json.abilities && json.abilities.length > 1) ? json.abilities[1].ability.name : "null",
        hp: json.stats[0].base_stat,
        attack: json.stats[1].base_stat,
        defense: json.stats[2].base_stat,
        specialAttack: json.stats[3].base_stat,
        specialDefense: json.stats[4].base_stat,
        speed: json.stats[5].base_stat
      };

      setTeam(prev => ({
        ...prev,
        [selectedType]: pokemonData
      }));
      setModalOpen(false);
    } catch (err) {
      console.error("Error fetching pokemon details", err);
    }
  };

  const handleRemove = (e, type) => {
    e.stopPropagation();
    setTeam(prev => {
      const newTeam = { ...prev };
      delete newTeam[type];
      return newTeam;
    });
  }

  // Share Team Feature
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const teamParam = params.get("team");
    const minParam = params.get("minimalist");

    if (minParam === "true") {
      setIsMinimalist(true);
    } else if (minParam === "false") {
      setIsMinimalist(false);
    }

    if (teamParam) {
      const loadSharedTeam = async () => {
        setLoading(true);
        const newTeam = {};
        const pairs = teamParam.split("|");

        for (const pair of pairs) {
          const [type, id] = pair.split(":");
          if (type && id) {
            try {
              const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
              const json = await res.json();

              let speciesId = json.id;
              if (json.species && json.species.url) {
                const parts = json.species.url.split('/');
                speciesId = parseInt(parts[parts.length - 2]);
              }

              // Determine sprite based on shiny preference (default to normal for shared)
              const mainSprite = json.sprites.other.home.front_default || json.sprites.front_default;

              newTeam[type] = {
                id: json.id,
                dex: json.id,
                speciesId: speciesId,
                name: json.name[0].toUpperCase() + json.name.slice(1),
                avatarNormal: mainSprite,
                avatarShiny: null, // Shared view defaults to normal for simplicity unless we encode shiny state too
                type1: json.types[0].type.name[0].toUpperCase() + json.types[0].type.name.slice(1),
                type2: json.types.length === 2 ? json.types[1].type.name[0].toUpperCase() + json.types[1].type.name.slice(1) : "null",
                ability1: (json.abilities && json.abilities.length > 0) ? json.abilities[0].ability.name : "undefined",
                ability2: (json.abilities && json.abilities.length > 1) ? json.abilities[1].ability.name : "null",
                hp: json.stats[0].base_stat,
                attack: json.stats[1].base_stat,
                defense: json.stats[2].base_stat,
                specialAttack: json.stats[3].base_stat,
                specialDefense: json.stats[4].base_stat,
                speed: json.stats[5].base_stat
              };
            } catch (err) {
              console.error(`Error loading shared pokemon ${id}`, err);
            }
          }
        }
        setTeam(newTeam);
        setLoading(false);
        // Optional: Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      };
      loadSharedTeam();
    }
  }, []);

  const handleShare = () => {
    const teamString = Object.entries(team)
      .map(([type, member]) => `${type}:${member.id}`)
      .join("|");

    const url = `${window.location.origin}${window.location.pathname}?team=${teamString}&minimalist=${isMinimalist}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Team URL (with view mode) copied to clipboard! Share it with your friends.");
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your entire team?")) {
      setTeam({});
    }
  }

  const getPokemonId = (url) => {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
  }

  const filteredPokemon = availablePokemon.filter(p => {
    const matchesSearch = p.name.includes(searchQuery.toLowerCase());
    const id = getPokemonId(p.url);

    const gen = GENERATIONS.find(g => g.name === genFilter);
    const min = gen.offset + 1;
    const max = gen.offset + gen.limit;

    const matchesGen = id >= min && id <= max;
    return matchesSearch && matchesGen;
  });

  return (
    <div className="home-container">
      <h1 className="home-title">
        Ultimate Type Team
      </h1>

      <div className="welcome-section">
        <p className="welcome-text">
          <strong>Build your dream Pokémon team!</strong> Select a slot to search for Pokémon.
        </p>
        <ul className="welcome-list">
          <li>✨ <strong>Filters</strong>: Use the dropdown to filter by Generation.</li>
          <li>⚔️ <strong>Analyze</strong>: Check your team's coverage once you have 18 members.</li>
          <li>📤 <strong>Share</strong>: Get a link to share your team with friends.</li>
        </ul>
      </div>

      <div className="home-setup-form">
        <div className="home-form-group">
          <label>Generation Filter</label>
          <select
            value={genFilter}
            onChange={(e) => setGenFilter(e.target.value)}
            className="gen-select"
          >
            {GENERATIONS.map(gen => <option key={gen.name} value={gen.name}>{gen.name}</option>)}
          </select>
        </div>

        <button onClick={handleReset} className="reset-team-btn">
          Reset Team
        </button>

        <button
          onClick={() => setIsMinimalist(!isMinimalist)}
          className="minimalist-btn"
          style={{
            background: isMinimalist ? '#eee' : '#333',
            color: isMinimalist ? '#333' : 'white',
          }}
        >
          {isMinimalist ? "Show Details Mode" : "Minimalist Mode"}
        </button>

        <div className="action-buttons-container">
          <button
            onClick={() => setShowAnalysis(true)}
            disabled={Object.keys(team).length < 18}
            className="analyze-btn"
            style={{
              background: Object.keys(team).length === 18 ? '#faca04' : '#555',
              color: Object.keys(team).length === 18 ? '#222' : '#aaa',
              cursor: Object.keys(team).length === 18 ? 'pointer' : 'not-allowed',
              opacity: Object.keys(team).length === 18 ? 1 : 0.6
            }}
          >
            Analyze {Object.keys(team).length}/18
          </button>

          <button
            onClick={handleShare}
            disabled={Object.keys(team).length === 0}
            className="share-team-btn"
            style={{
              cursor: Object.keys(team).length > 0 ? 'pointer' : 'not-allowed',
              opacity: Object.keys(team).length > 0 ? 1 : 0.6
            }}
            title="Share Team URL"
          >
            📤
          </button>
        </div>
      </div>

      <TeamAnalysis team={team} isOpen={showAnalysis} onClose={() => setShowAnalysis(false)} />

      <div className="team-grid">
        {TYPES.map(type => {
          const member = team[type];
          return (
            <div
              key={type}
              onClick={() => openTypeModal(type)}
              onMouseEnter={() => setHoveredSlot(type)}
              onMouseLeave={() => setHoveredSlot(null)}
              className={`team-slot ${member ? 'team-slot-filled' : ''}`}
              style={{
                border: `3px solid ${typeColors[type]}`,
              }}
            >
              <div className="slot-type-label" style={{ background: typeColors[type] }}>
                {type}
              </div>

              {member ? (
                <>
                  <button
                    onClick={(e) => handleRemove(e, type)}
                    className="remove-btn"
                    style={{
                      opacity: hoveredSlot === type ? 1 : 0,
                    }}
                  >X</button>
                  <div style={{ transform: 'scale(1)', marginTop: '0', width: '100%', height: '100%' }}>
                    <PokemonIndividual {...member} showStats={false} minimalist={isMinimalist} />
                  </div>
                </>
              ) : (
                <div className="empty-slot-content">
                  <span className="plus-sign">+</span>
                  <p>Select {type}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="type-modal-content" style={{ border: `2px solid ${typeColors[selectedType]}` }}>
            <div className="modal-header">
              <h2>Select {selectedType} Pokémon</h2>
              <button onClick={() => setModalOpen(false)} className="close-modal-btn">✕</button>
            </div>

            <div className="modal-search-container">
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="modal-search-input"
              />
              <div
                className="shiny-toggle"
                onClick={() => setIsShiny(!isShiny)}
              >
                <label>Shiny?</label>
                <input
                  type="checkbox"
                  checked={isShiny}
                  onChange={() => setIsShiny(!isShiny)}
                  className="shiny-checkbox"
                />
              </div>
            </div>

            <div className="pokemon-list-container">
              {loading ? (
                <p className="loading-text">Loading...</p>
              ) : (
                <div className="pokemon-grid">
                  {filteredPokemon.map(p => (
                    <div
                      key={p.name}
                      onClick={() => handleSelectPokemon(p.url)}
                      className="pokemon-item"
                      onMouseEnter={e => e.currentTarget.style.borderColor = typeColors[selectedType]}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                    >
                      {p.name}
                    </div>
                  ))}
                  {filteredPokemon.length === 0 && !loading && (
                    <p className="no-matches">
                      No matches found {genFilter !== "All Generations" ? `in ${genFilter}` : ""}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};