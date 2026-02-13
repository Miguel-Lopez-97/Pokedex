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
  Unknown: "#efe9e0",
  Shadow: "#8673a1",
};

const getRegion = (dex, speciesId, name) => {
  const n = name ? name.toLowerCase() : "";
  if (n.includes("alola")) return "Alola";
  if (n.includes("galar")) return "Galar";
  if (n.includes("hisui")) return "Hisui";
  if (n.includes("paldea") && !n.includes("tauros")) return "Paldea";

  const id = speciesId || dex;

  if (id <= 151) return "Kanto";
  if (id <= 251) return "Johto";
  if (id <= 386) return "Hoenn";
  if (id <= 493) return "Sinnoh";
  if (id <= 649) return "Unova";
  if (id <= 721) return "Kalos";
  if (id <= 809) return "Alola";
  if (id <= 905) return "Galar";
  if (id <= 1026) return "Paldea";
  return "";
};

export function PokemonIndividual(props) {
  const { 
    name, dex, speciesId, avatarNormal, avatarShiny, 
    type1, type2, ability1, ability2, 
    hp, attack, defense, specialAttack, specialDefense, speed, 
    minimalist, hidden, customStat, showStats 
  } = props;

  const backgroundColor1 = colors[type1];
  const backgroundColor2 = type2 === "null" || !type2 ? colors[type1] : colors[type2];
  
  const backgroundColorMix = `linear-gradient(135deg, ${backgroundColor1} 30%, ${backgroundColor2} 70%)`;
  
  // URL de respaldo si falla la imagen
  const fallbackImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
  const imgNormal = avatarNormal || fallbackImage;
  
  // Determinamos si hay shiny para activar la clase CSS de hover
  const hasShiny = !!avatarShiny && !hidden;

  return (
    <div 
      className={`card ${hidden ? 'hidden-card-style' : ''}`} 
      style={{ background: backgroundColorMix }}
    >
      {/* SECCIÓN NOMBRE */}
      <div className="name">
        {!minimalist && (
          <h1>
            {hidden 
              ? "???" 
              : (dex >= 10000 ? "Variant" : `#${dex.toString().padStart(3, "0")}`)
            }
          </h1>
        )}
        <h2>{name}</h2>
        {!hidden && !minimalist && (
          <span className="region-name">{getRegion(dex, speciesId, name)}</span>
        )}
      </div>

      {/* SECCIÓN AVATAR (Con lógica de Shiny Swap) */}
      <div className={`avatar ${hasShiny ? 'has-shiny' : ''}`}>
        {hidden ? (
          <div className="unknown-avatar">?</div>
        ) : (
          <>
            {/* Imagen Normal (Siempre renderizada) */}
            <img 
              src={imgNormal} 
              alt={name} 
              className="sprite-normal"
            />
            {/* Imagen Shiny (Solo si existe, superpuesta) */}
            {hasShiny && (
              <img 
                src={avatarShiny} 
                alt={`${name} Shiny`} 
                className="sprite-shiny"
              />
            )}
          </>
        )}
      </div>

      {/* SECCIÓN INFO Y STATS */}
      {!minimalist && (
        <div className="info">
          
          {!hidden && (
            <>
              <p>
                {type1}
                {type2 && type2 !== "null" ? ` - ${type2}` : ""}
              </p>
              <p>
                {ability1 && ability1 !== "undefined" ? ability1 : "???"}
                {ability2 && ability2 !== "null" ? ` / ${ability2}` : ""}
              </p>
            </>
          )}

          {/* Stats Base (Si no hay customStat) */}
          {showStats !== false && !hidden && !customStat && (
            <div className="stats">
              <span className="statsP">HP {hp} / Atk {attack} / Def {defense}</span>
              <span className="statsP">SpA {specialAttack} / SpD {specialDefense}</span>
              <span className="statsP">Speed {speed}</span>
            </div>
          )}

          {/* Stat Personalizada (Para el juego Higher/Lower) */}
          {!hidden && customStat && (
            <div className="custom-stat-container">
              <span className="custom-stat-pill">
                {customStat.label}: {customStat.value}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}