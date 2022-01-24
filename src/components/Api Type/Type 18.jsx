import React, {  useEffect, useState } from "react";
import PokemonIndividual from "../Card/card";
import "../Nav/navegation.css";


function ApiType18({urlApi}) {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    const getApi = async () => {
      let url = urlApi;
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          json.pokemon.forEach((el) => {
            fetch(el.pokemon.url)
              .then((res) => res.json())
              .then((json) => {
                console.log(json)
                let pokemonNew = {
                  id: json.id,
                  dex: json.id,
                  name: json.name[0].toUpperCase() + json.name.slice(1),
                  avatarNormal: json.sprites.front_default,
                  avatarShiny: json.sprites.front_shiny,
                  type1:
                    json.types[0].type.name[0].toUpperCase() +
                    json.types[0].type.name.slice(1),
                  type2:
                    json.types.length == 2
                      ? json.types[1].type.name[0].toUpperCase() +
                        json.types[1].type.name.slice(1)
                      : "null",
                };
                setPokemon(prev=>
                  [...prev.sort((a, b) => {
                    return a.dex - b.dex;
                  }), pokemonNew]
                )
                console.log(pokemonNew);
              });
          });
        });
    };
    getApi();
  }, []);

  return (
    <>
    <div className="container">
      {pokemon.map((el) => (
        <PokemonIndividual
          key={el.id}
          name={el.name}
          avatarNormal={el.avatarNormal}
          avatarShiny={el.avatarShiny}
          dex={el.id}
          type2={el.type2}
          type1={el.type1}
        />
      ))}
      </div>
    </>
  );
}
export default ApiType18;
