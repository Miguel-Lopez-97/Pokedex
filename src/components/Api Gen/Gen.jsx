import React, {  useEffect, useState } from "react";
import PokemonIndividual from "../Card/card";
import "../header/Nav/navegation.css";

function ApiGen(props) {
  const [pokemon, setPokemon] = useState([]);
  const {urlApi}=props;

  const getApi = async (url) => {
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        json.results.forEach((el) => {
          fetch(el.url)
            .then((res) => res.json())
            .then((json) => {
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
            });
        });
      });
  };

  useEffect(() => {
    getApi(urlApi);
  }, [urlApi]);

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
export default ApiGen;

export function AjaxApi() {
  
  return (
    <div className="containerBanner">
      <img src="https://i.pinimg.com/originals/06/5e/5e/065e5e9239f7d492dc3d64e57e84d6ed.jpg" alt="" />
    </div>
  );
};