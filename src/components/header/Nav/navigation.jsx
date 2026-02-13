import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./navigation.css";

export function NavBar() {
  const [displayGen, setDisplayGen] = useState()

  const [display, setDisplay] = useState("none")

  const onShow = () => {
    if (window.screen.width < 780) {
      if (display === "none") {
        display.slice(0);
        setDisplay("flex")
      }
      else {
        display.slice(0);
        setDisplay("none")
      }
    }
    else { setDisplay("flex") }
  };

  const onShowFirst = () => {
    if (window.screen.width < 780) {
      setDisplayGen("none")
    }
    else { setDisplayGen("flex") }
  }
    ;

  useEffect(() => { onShowFirst(); },
  );

  return (
    <>
      <button className="nav-toggle-btn" onClick={onShow}>Menu</button>
      <ul style={{ display: displayGen === "none" ? display : displayGen }}>

        {/* Your Team (Home) */}
        <li>
          <Link to="/" onClick={onShow} className="nav-link">Your Team</Link>
        </li>

        {/* Pokedex Level 1: Region/Gen */}
        <li className="dropdown">
          <span className="dropdown-btn">Pokedex (Region) 🌍</span>
          <div className="dropdown-content">
            <Link to="/first_gen" onClick={onShow}>Gen 1 (Kanto)</Link>
            <Link to="/second_gen" onClick={onShow}>Gen 2 (Johto)</Link>
            <Link to="/third_gen" onClick={onShow}>Gen 3 (Hoenn)</Link>
            <Link to="/fourth_gen" onClick={onShow}>Gen 4 (Sinnoh)</Link>
            <Link to="/fifth_gen" onClick={onShow}>Gen 5 (Unova)</Link>
            <Link to="/sixth_gen" onClick={onShow}>Gen 6 (Kalos)</Link>
            <Link to="/seventh_gen" onClick={onShow}>Gen 7 (Alola)</Link>
            <Link to="/eighth_gen" onClick={onShow}>Gen 8 (Galar)</Link>
            <Link to="/ninth_gen" onClick={onShow}>Gen 9 (Paldea)</Link>
            <Link to="/alternative_forms" onClick={onShow}>Alt Forms</Link>
          </div>
        </li>

        {/* Pokedex Level 2: Types */}
        <li className="dropdown">
          <span className="dropdown-btn">Pokedex (Type) 🔥</span>
          <div className="dropdown-content type-grid">
            <Link to="/normal" onClick={onShow}>Normal</Link>
            <Link to="/fighting" onClick={onShow}>Fighting</Link>
            <Link to="/flying" onClick={onShow}>Flying</Link>
            <Link to="/poison" onClick={onShow}>Poison</Link>
            <Link to="/ground" onClick={onShow}>Ground</Link>
            <Link to="/rock" onClick={onShow}>Rock</Link>
            <Link to="/bug" onClick={onShow}>Bug</Link>
            <Link to="/ghost" onClick={onShow}>Ghost</Link>
            <Link to="/steel" onClick={onShow}>Steel</Link>
            <Link to="/fire" onClick={onShow}>Fire</Link>
            <Link to="/water" onClick={onShow}>Water</Link>
            <Link to="/grass" onClick={onShow}>Grass</Link>
            <Link to="/electric" onClick={onShow}>Electric</Link>
            <Link to="/psychic" onClick={onShow}>Psychic</Link>
            <Link to="/ice" onClick={onShow}>Ice</Link>
            <Link to="/dragon" onClick={onShow}>Dragon</Link>
            <Link to="/dark" onClick={onShow}>Dark</Link>
            <Link to="/fairy" onClick={onShow}>Fairy</Link>
          </div>
        </li>

        {/* Games Dropdown */}
        <li className="dropdown">
          <span className="dropdown-btn">Games 🎮</span>
          <div className="dropdown-content">
            <NavLink to="/pokeguess" onClick={onShow}>PokeGuess (Guess Who)</NavLink>
            <NavLink to="/trivia" onClick={onShow}>Trivia Game</NavLink>
            <NavLink to="/poke-trivia" onClick={onShow}>PokeTrivia Challenge</NavLink>
            <NavLink to="/move-higher-lower" onClick={onShow}>Move Higher/Lower</NavLink>
            <NavLink to="/higher-lower" onClick={onShow}>Higher or Lower</NavLink>
          </div>
        </li>

      </ul>
    </>
  );
};
