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
  if (n.includes("paldea") && !n.includes("tauros")) return "Paldea"; // Paldean Tauros logic if needed, simplify for now

  // Use speciesId if available (fallback to dex if not, though dex for alt forms is > 10000)
  const id = speciesId || dex;

  if (id <= 151) return "Kanto";
  if (id <= 251) return "Johto";
  if (id <= 386) return "Hoenn";
  if (id <= 493) return "Sinnoh";
  if (id <= 649) return "Unova";
  if (id <= 721) return "Kalos";
  if (id <= 809) return "Alola";
  if (id <= 905) return "Galar";
  return "Paldea";
};

export function PokemonIndividual(props) {
  const { name, dex, speciesId, avatarNormal, avatarShiny, type1, type2, ability1, ability2, hp, attack, defense, specialAttack, specialDefense, speed, minimalist } = props
  const backgroundColor1 = colors[type1];
  const backgroundColor2 =
    type2 === "null" ? colors[type1] : colors[type2];
  const backgroundColorMix =
    "linear-gradient(135deg," +
    backgroundColor1 +
    " 30%, " +
    backgroundColor2 +
    " 70%)";
  return (
    <>
      <div className={`card ${props.hidden ? 'hidden-card-style' : ''}`} style={{ background: backgroundColorMix }}>
        <div className="name">
          {!minimalist && <h1>{props.hidden ? "???" : (dex >= 1026 ? "Alternative Form" : "#" + dex.toString().padStart(3, "0"))}</h1>}
          <h2>{name}</h2>
          {!props.hidden && !minimalist && <h3 style={{ fontSize: '1rem', marginTop: '0px', color: '#555' }}>{getRegion(dex, speciesId, name)}</h3>}
        </div>
        <div className="avatar">
          {props.hidden ?
            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: '#555' }}>?</div>
            :
            (avatarNormal ? <img src={avatarNormal} alt={name} /> : <img src="https://www.latercera.com/resizer/CBmGvvFEACkiaL4Diatt7wyUqlM=/900x600/smart/arc-anglerfish-arc2-prod-copesa.s3.amazonaws.com/public/LUOOHUM2OVEEXG7ZTRSNI6XWLY.png" alt="Missingno" />)
          }
          {(!props.hidden && avatarShiny) ? <img src={avatarShiny} alt={name} /> : null}
        </div>
        {!minimalist && (
          <div className="info">
            {props.showStats !== false && <h3>Normal Sprit - Shiny Sprit</h3>}
            {props.hidden ? null : (
              <>
                <p>
                  {type1}
                  {type2 === "null" ? "" : " - " + type2}
                </p>
                <p>
                  {ability1[0].toUpperCase() + ability1.slice(1)}
                  {ability2 === "null" ? "" : " / " + ability2[0].toUpperCase() + ability2.slice(1)}
                </p>
              </>
            )}
            {props.showStats !== false && !props.hidden && !props.customStat ? (
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
            ) : null}

            {!props.hidden && props.customStat && (
              <div className="stats" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
                <p className="statsP" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#222', background: 'rgba(255,255,255,0.6)', padding: '5px 15px', borderRadius: '10px' }}>
                  {props.customStat.label}: {props.customStat.value}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

