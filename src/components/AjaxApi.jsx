import React, { Component } from "react";
import "./cards.css";

const colors = {
  Normal: "#e6e6fa",
  Fighting: "#b22222",
  Flying: "#ffffff",
  Poison: "#800080",
  Ground: "#deb887",
  Rock: "#cd853f",
  Bug: "#9acd32",
  Ghost: "#800080",
  Steel: "#D3D3D3",
  Fire: "#dc143c",
  Water: "#0000ff",
  Grass: "#bfff00",
  Electric: "#ffff00",
  Psychic: "#ee82ee",
  Ice: "#7fffd4",
  Dragon: "#7b68ee",
  Dark: "#808080",
  Fairy: "#ff88ee",
  Unknown: "#efe9e1",
  Shadow: "#8673a1",
};

function PokemonIndividual(props) {
  const backgroundColor1 = colors[props.type1];
  const backgroundColor2 =
    props.type2 == "null" ? colors[props.type1] : colors[props.type2];
  const backgroundColorMix =
    "linear-gradient(135deg," +
    backgroundColor1 +
    " 25%, " +
    backgroundColor2 +
    " 75%)";
  return (
    <>
      <div className="card" style={{ background: backgroundColorMix }}>
        <div className="name">
          <h1>#{props.dex.toString().padStart(3, "0")}</h1>
          <h2>{props.name}</h2>
        </div>
        <div className="avatar">
          <img src={props.avatarNormal} alt={props.name} />
          <img src={props.avatarShiny} alt={props.name} />
        </div>
        <div className="info">
          <h3>Normal Sprit - Shiny Sprit</h3>
          <p>
            {props.type1}
            {props.type2 == "null" ? "" : " - " + props.type2}
          </p>
        </div>
      </div>
    </>
  );
}

export default class AjaxApi extends Component {
  state = {
    pokemon: [],
  };
  componentDidMount() {
    let url = "https://pokeapi.co/api/v2/pokemon/?limit=151&offset=0";
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        json.results.forEach((el) => {
          fetch(el.url)
            .then((res) => res.json())
            .then((json) => {
              console.log(json);
              let pokemonNew = {
                id: json.id,
                dex: json.dex,
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

              let pokemon = [...this.state.pokemon, pokemonNew];

              this.setState({ pokemon });
            });
        });
      });
  }
  render() {
    return (
      <>
        {this.state.pokemon.map((el) => (
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
      </>
    );
  }
}
