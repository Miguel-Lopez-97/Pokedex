import React from "react";
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

export function PokemonIndividual(props) {
  const {name, dex, avatarNormal, avatarShiny, type1, type2, ability1, ability2, hp, attack, defense, specialAttack, specialDefense, speed}=props
  const backgroundColor1 = colors[type1];
  const backgroundColor2 =
    type2 == "null" ? colors[type1] : colors[type2];
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
          <h1>{dex>=898?"Alternative Form":"#"+dex.toString().padStart(3, "0")}</h1>
          <h2>{name}</h2>
        </div>
        <div className="avatar">
          {avatarNormal?<img src={avatarNormal} alt={name} />:<img src="https://www.latercera.com/resizer/CBmGvvFEACkiaL4Diatt7wyUqlM=/900x600/smart/arc-anglerfish-arc2-prod-copesa.s3.amazonaws.com/public/LUOOHUM2OVEEXG7ZTRSNI6XWLY.png" alt="Missingno" />}
          {avatarShiny?<img src={avatarShiny} alt={name} />:null}
        </div>
        <div className="info">
          <h3>Normal Sprit - Shiny Sprit</h3>
          <p>
            {type1}
            {type2 == "null" ? "" : " - " + type2}
          </p>
          <p>
            {ability1[0].toUpperCase()+ability1.slice(1)}
            {ability2 == "null" ? "" : " / " + ability2[0].toUpperCase()+ability2.slice(1)}
          </p>
          <div className="stats">
          <p className="statsP">
            HP {hp} / Atk {attack} / Def {defense}</p>
          <p className="statsP">
            Sp. Atk {specialAttack} / Sp. Def {specialDefense}
          </p>
          <p className="statsP">
            Speed {speed}
          </p>
          </div>
        </div>
      </div>
    </>
  );
};

