import React from "react";
import { Link } from "react-router-dom";
import "./navegation.css";

function NavTypes() {
  
  return (
    <>
      <ul>
      <li>
          <Link to="/normal">Normal</Link>
        </li>
        <li>
          <Link to="/fighting">Fighting</Link>
        </li>
        <li>
          <Link to="/flying">Fly</Link>
        </li>
        <li>
          <Link to="/poison">Poison</Link>
        </li>
        <li>
          <Link to="/ground">Ground</Link>
        </li>
        <li>
          <Link to="/rock">Rock</Link>
        </li>
        <li>
          <Link to="/bug">Bug</Link>
        </li>
        <li>
          <Link to="/ghost">Ghost</Link>
        </li>
        <li>
          <Link to="/steel">Steel</Link>
        </li>
        <li>
          <Link to="/fire">Fire</Link>
        </li>
        <li>
          <Link to="/water">Water</Link>
        </li>
        <li>
          <Link to="/grass">Grass</Link>
        </li>
        <li>
          <Link to="/electric">Electric</Link>
        </li>
        <li>
          <Link to="/psychic">Psychic</Link>
        </li>
        <li>
          <Link to="/ice">Ice</Link>
        </li>
        <li>
          <Link to="/dragon">Dragon</Link>
        </li>
        <li>
          <Link to="/dark">Dark</Link>
        </li>
        <li>
          <Link to="/fairy">Fairy</Link>
        </li>
        
      </ul>
    </>
  );
}
export default NavTypes;
