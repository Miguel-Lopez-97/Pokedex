import React, {  useEffect, useState } from "react";
import {PokemonIndividual} from "../Card/card";
import "../header/Nav/navigation.css";


export function ApiType(props) {
  const [pokemon, setPokemon] = useState([]);
  const {urlApi, Gen}=props;

  const getApi = async (url) => {
      fetch(url).then(setPokemon([]))
      .then((res) => res.json())
      .then((json) => {
        json.pokemon.forEach((el) => {
          fetch(el.pokemon.url)
            .then((res) => res.json())
            .then((json) => {
              let pokemonNew = {
                id: json.id,
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
                    ability2:json.abilities.length === 2
                      ?json.abilities[1].ability.name
                      :"null",
                    hp: json.stats[0].base_stat,
                    attack: json.stats[1].base_stat,
                    defense: json.stats[2].base_stat,
                    specialAttack: json.stats[3].base_stat,
                    specialDefense: json.stats[4].base_stat,
                    speed: json.stats[5].base_stat
              };
              setPokemon(prev=>
                [...prev.sort((a, b) => {
                  return a.dex - b.dex;
                }), pokemonNew]
              )
            })
            ;
        });
      });
  };


  useEffect(() => {
    getApi(urlApi);
  }, [urlApi]);

  return (
    <>
    <h1>{Gen} Type</h1>
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
        ability1={el.ability1}
        ability2={el.ability2}
        hp={el.hp}
        attack={el.attack}
        defense={el.defense}
        specialAttack={el.specialAttack}
        specialDefense={el.specialDefense}
        speed={el.speed}
      />
      ))}
      </div>
    </>
  );
};
