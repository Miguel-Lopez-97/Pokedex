import React, { useEffect, useState } from "react";
import { PokemonIndividual } from "../Card/card";
import "../header/Nav/navigation.css";
import "./apigen.css";

const TYPES = [
  "Any", "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Flying",
  "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock",
  "Steel", "Water"
];

export function ApiGen(props) {
  const [pokemon, setPokemon] = useState([]);
  const [sortOrder, setSortOrder] = useState("dex-asc");
  const [filterType1, setFilterType1] = useState("Any");
  const [filterType2, setFilterType2] = useState("Any");
  const { urlApi, Gen } = props;

  const getApi = async (url) => {
    setPokemon([]); // Clear current list immediately

    try {
      const res = await fetch(url);
      const json = await res.json();

      // Use Promise.all to fetch all details in parallel
      const detailedPokemon = await Promise.all(
        json.results.map(async (el) => {
          const res = await fetch(el.url);
          const data = await res.json();

          let speciesId = data.id;
          if (data.species && data.species.url) {
            const parts = data.species.url.split('/');
            // url is usually .../pokemon-species/{id}/
            speciesId = parseInt(parts[parts.length - 2]);
          }

          return {
            id: data.id,
            speciesId: speciesId,
            dex: data.id,
            name: data.name[0].toUpperCase() + data.name.slice(1),
            avatarNormal: data.sprites.front_default,
            avatarShiny: data.sprites.front_shiny,
            type1: data.types[0].type.name[0].toUpperCase() + data.types[0].type.name.slice(1),
            type2: data.types.length === 2
              ? data.types[1].type.name[0].toUpperCase() + data.types[1].type.name.slice(1)
              : "null",
            ability1: data.abilities?.[0]?.ability?.name || "undefined",
            ability2: data.abilities?.length > 1
              ? data.abilities[1].ability.name
              : "null",
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            specialAttack: data.stats[3].base_stat,
            specialDefense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat,
            base_experience: data.base_experience,
            weight: data.weight,
            height: data.height
          };
        })
      );

      setPokemon(detailedPokemon);
    } catch (err) {
      console.error("Error fetching generation data:", err);
    }
  };

  useEffect(() => {
    getApi(urlApi);
    setFilterType1("Any");
    setFilterType2("Any");
  }, [urlApi]);

  const filteredPokemon = pokemon.filter(p => {
    // Primary Filter
    if (filterType1 !== "Any" && p.type1 !== filterType1) return false;

    // Secondary Filter
    if (filterType2 === "Any") return true;
    if (filterType2 === "None") return p.type2 === "null";
    return p.type2 === filterType2;
  });

  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    if (sortOrder === "dex-asc") return a.dex - b.dex;
    if (sortOrder === "dex-desc") return b.dex - a.dex;
    if (sortOrder === "az") return a.name.localeCompare(b.name);
    if (sortOrder === "za") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="api-gen-wrapper">

      {/* HEADER SECTION */}
      <header className="gen-header">
        <h1 className="gen-title">{Gen} Generation</h1>

        <div className="controls-container">
          {/* Sort Control */}
          <div className="control-group">
            <label>Sort By</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="custom-select"
            >
              <option value="dex-asc">Dex Number (Asc)</option>
              <option value="dex-desc">Dex Number (Desc)</option>
              <option value="az">Name (A-Z)</option>
              <option value="za">Name (Z-A)</option>
            </select>
          </div>

          {/* Type 1 Filter */}
          <div className="control-group">
            <label>Primary Type</label>
            <select
              value={filterType1}
              onChange={(e) => setFilterType1(e.target.value)}
              className="custom-select"
            >
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Type 2 Filter */}
          <div className="control-group">
            <label>Secondary Type</label>
            <select
              value={filterType2}
              onChange={(e) => setFilterType2(e.target.value)}
              className="custom-select"
            >
              <option value="Any">Any</option>
              <option value="None">None (Pure)</option>
              {TYPES.filter(t => t !== "Any" && t !== filterType1).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </header>

      {/* GRID SECTION */}
      <div className="pokemon-grid-container">
        {sortedPokemon.length === 0 ? (
          <div className="no-results-card">
            <h3>No Pokémon found with this combination.</h3>
            <p>Try adjusting your type filters.</p>
          </div>
        ) : (
          sortedPokemon.map((el) => (
            <PokemonIndividual
              key={el.id}
              name={el.name}
              avatarNormal={el.avatarNormal}
              avatarShiny={el.avatarShiny}
              dex={el.id}
              speciesId={el.speciesId}
              type2={el.type2}
              type1={el.type1}
              ability1={el.ability1}
              ability2={el.ability2}
              hp={el.hp}
              attack={el.attack}
              defense={el.defense}
              specialAttack={el.specialAttack}
              specialDefense={el.specialDefense}
              speed={el.speed}
            />
          ))
        )}
      </div>
    </div>
  );
};
