import React, { useEffect, useState } from "react";
import { PokemonIndividual } from "../Card/card";
import "../header/Nav/navigation.css";

const TYPES = [
  "Any", "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Flying",
  "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock",
  "Steel", "Water"
];

export function ApiType(props) {
  const [pokemon, setPokemon] = useState([]);
  const [sortOrder, setSortOrder] = useState("dex-asc");
  const [filterType2, setFilterType2] = useState("Any");
  const { urlApi, Gen } = props;

  const getApi = async (url) => {
    fetch(url).then(setPokemon([]))
      .then((res) => res.json())
      .then((json) => {
        json.pokemon.forEach((el) => {
          fetch(el.pokemon.url)
            .then((res) => res.json())
            .then((json) => {
              let speciesId = json.id;
              if (json.species && json.species.url) {
                const parts = json.species.url.split('/');
                speciesId = parseInt(parts[parts.length - 2]);
              }

              let pokemonNew = {
                id: json.id,
                speciesId: speciesId,
                dex: json.id,
                name: json.name[0].toUpperCase() + json.name.slice(1),
                avatarNormal: json.sprites.other.home.front_default,
                avatarShiny: json.sprites.other.home.front_shiny,
                type1:
                  json.types[0].type.name[0].toUpperCase() +
                  json.types[0].type.name.slice(1),
                type2:
                  json.types.length === 2
                    ? json.types[1].type.name[0].toUpperCase() +
                    json.types[1].type.name.slice(1)
                    : "null",
                ability1: json.abilities[0].ability.name,
                ability2: json.abilities.length === 2
                  ? json.abilities[1].ability.name
                  : "null",
                hp: json.stats[0].base_stat,
                attack: json.stats[1].base_stat,
                defense: json.stats[2].base_stat,
                specialAttack: json.stats[3].base_stat,
                specialDefense: json.stats[4].base_stat,
                speed: json.stats[5].base_stat
              };
              setPokemon(prev => [...prev, pokemonNew])
            })
            ;
        });
      });
  };


  useEffect(() => {
    getApi(urlApi);
  }, [urlApi]);

  const filteredPokemon = pokemon.filter(p => {
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
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>{Gen} Type</h1>
        <div className="sort-controls" style={{ marginTop: '10px', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '10px', color: 'white' }}>Sort By:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ padding: '5px', borderRadius: '5px' }}
            >
              <option value="dex-asc">Pokedex Number (Asc)</option>
              <option value="dex-desc">Pokedex Number (Desc)</option>
              <option value="az">Name (A-Z)</option>
              <option value="za">Name (Z-A)</option>
            </select>
          </div>
          <div>
            <label style={{ marginRight: '10px', color: 'white' }}>Secondary Type:</label>
            <select
              value={filterType2}
              onChange={(e) => setFilterType2(e.target.value)}
              style={{ padding: '5px', borderRadius: '5px' }}
            >
              <option value="Any">Any</option>
              <option value="None">None (Pure)</option>
              {TYPES.filter(t => t !== "Any").map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="container">
        {sortedPokemon.length === 0 ? (
          <div className="pokemon-card" style={{ backgroundColor: '#222', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', cursor: 'default' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <h3>No Pokémon with this type combination exists yet.</h3>
            </div>
          </div>
        ) : (
          sortedPokemon.map((el) => (
            <PokemonIndividual
              key={el.id}
              name={el.name}
              avatarNormal={el.avatarNormal}
              avatarShiny={el.avatarShiny}
              dex={el.id}
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
    </>
  );
};
