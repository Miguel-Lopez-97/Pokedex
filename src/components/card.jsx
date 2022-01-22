import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./card.css";

const colors = {
  Normal: "#e6e6fa",
  Fighting: "#b22222",
  Flying: "#ffffff",
  Poison: "#600080",
  Ground: "#deb887",
  Rock: "#cd853f",
  Bug: "#bfff00",
  Ghost: "#800080",
  Steel: "#D3D3D3",
  Fire: "#dc143c",
  Water: "#0050af",
  Grass: "#9acd70",
  Electric: "#f0f000",
  Psychic: "#ee10ee",
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
    " 30%, " +
    backgroundColor2 +
    " 70%)";
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
export default PokemonIndividual;