import React, { useState, useEffect } from "react";
import "../header/Nav/navigation.css";
import { PokemonIndividual } from "../Card/card";
import "../Trivia/trivia.css";

// Alphabetical Order
const TYPES = [
  "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire",
  "Flying", "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison",
  "Psychic", "Rock", "Steel", "Water"
];

const typeColors = {
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
  { name: "All Generations", limit: 10000, offset: 0 },
  { name: "Gen 1 (Kanto)", limit: 151, offset: 0 },
  { name: "Gen 2 (Johto)", limit: 100, offset: 151 },
  { name: "Gen 3 (Hoenn)", limit: 135, offset: 251 },
  { name: "Gen 4 (Sinnoh)", limit: 107, offset: 386 },
  { name: "Gen 5 (Unova)", limit: 156, offset: 493 },
  { name: "Gen 6 (Kalos)", limit: 72, offset: 649 },
  { name: "Gen 7 (Alola)", limit: 88, offset: 721 },
  { name: "Gen 8 (Galar)", limit: 96, offset: 809 },
  { name: "Gen 9 (Paldea)", limit: 120, offset: 905 }
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
        ability1: json.abilities[0].ability.name,
        ability2: json.abilities.length === 2 ? json.abilities[1].ability.name : "null",
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
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>
        {`
            /* Force card inside slot to fit perfectly */
            .team-slot .card {
                margin: 0 !important;
                width: 100% !important;
                height: 100% !important;
                border-radius: 4vh !important; /* Slightly less than slot radius */
                box-shadow: none !important;
            }
        `}
      </style>
      <h1 style={{ textAlign: 'center', color: '#faca04', textShadow: '2px 2px #3c5aa6', marginBottom: '30px' }}>
        Ultimate Type Team
      </h1>

      <div className="setup-form" style={{ marginTop: '0', marginBottom: '30px', width: 'auto', minWidth: '300px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div className="form-group" style={{ width: '100%' }}>
          <label>Generation Filter</label>
          <select
            value={genFilter}
            onChange={(e) => setGenFilter(e.target.value)}
            style={{ display: 'block', width: '100%' }}
          >
            {GENERATIONS.map(gen => <option key={gen.name} value={gen.name}>{gen.name}</option>)}
          </select>
        </div>

        <button
          onClick={handleReset}
          style={{
            background: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem',
            width: '100%'
          }}
        >
          Reset Team
        </button>

        <button
          onClick={() => setIsMinimalist(!isMinimalist)}
          style={{
            background: isMinimalist ? '#eee' : '#333',
            color: isMinimalist ? '#333' : 'white',
            border: '1px solid #777',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem',
            width: '100%'
          }}
        >
          {isMinimalist ? "Show Details Mode" : "Minimalist Mode"}
        </button>
      </div>

      <div className="team-grid" style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {TYPES.map(type => {
          const member = team[type];
          return (
            <div
              key={type}
              onClick={() => openTypeModal(type)}
              onMouseEnter={() => setHoveredSlot(type)}
              onMouseLeave={() => setHoveredSlot(null)}
              style={{
                borderRadius: '5vh',
                border: `3px solid ${typeColors[type]}`,
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                margin: '2vh', // Reduced margin between slots
                width: '23vw',
                padding: '0', // REMOVED padding
                backgroundColor: 'rgba(255,255,255,0.1)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.2s',
                justifyContent: member ? 'flex-start' : 'center',
              }}
              className="team-slot"
            >
              {!member && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: typeColors[type],
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  zIndex: 10
                }}>
                  {type}
                </div>
              )}

              {member ? (
                <>
                  <button
                    onClick={(e) => handleRemove(e, type)}
                    className="remove-btn"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      zIndex: 100,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      opacity: hoveredSlot === type ? 1 : 0, // Only show on hover
                      transition: 'opacity 0.2s'
                    }}
                  >X</button>
                  <div style={{ transform: 'scale(1)', marginTop: '0', width: '100%', height: '100%' }}>
                    <PokemonIndividual {...member} showStats={false} minimalist={isMinimalist} />
                  </div>
                </>
              ) : (
                <div style={{ color: 'white', textAlign: 'center', opacity: 0.7, marginTop: '50px' }}>
                  <span style={{ fontSize: '3rem' }}>+</span>
                  <p>Select {type}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#222',
            width: '100%',
            maxWidth: '600px',
            height: '80vh',
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            border: `2px solid ${typeColors[selectedType]}`
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: 'white', margin: 0 }}>Select {selectedType} Pokémon</h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
              >✕</button>
            </div>

            <div style={{ padding: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  backgroundColor: '#333',
                  color: 'white'
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: 'white',
                  background: '#333',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => setIsShiny(!isShiny)}
              >
                <label style={{ cursor: 'pointer', fontWeight: 'bold' }}>Shiny?</label>
                <input
                  type="checkbox"
                  checked={isShiny}
                  onChange={() => setIsShiny(!isShiny)}
                  style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
              {loading ? (
                <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                  {filteredPokemon.map(p => (
                    <div
                      key={p.name}
                      onClick={() => handleSelectPokemon(p.url)}
                      style={{
                        background: '#333',
                        padding: '10px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        border: '1px solid transparent',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = typeColors[selectedType]}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                    >
                      {p.name}
                    </div>
                  ))}
                  {filteredPokemon.length === 0 && !loading && (
                    <p style={{ color: '#aaa', gridColumn: '1/-1', textAlign: 'center' }}>
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