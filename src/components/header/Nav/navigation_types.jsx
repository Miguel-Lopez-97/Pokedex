import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react/cjs/react.development";
import "./navigation.css";

export function NavTypes() {
  const [display, setDisplay] = useState("")

  const onShow= ()=>{
    if(display==="none"){
    display.slice(0);
    setDisplay("flex")}
    else{display.slice(0);
      setDisplay("none")}
  }

  return (
    <>
    <button onClick={onShow}>List Pokemon Types</button>
      <ul className="Types" style={{display:display}}>
      <li>
          <Link to="/normal" onClick={onShow}>Normal</Link>
        </li>
        <li>
          <Link to="/fighting" onClick={onShow}>Fighting</Link>
        </li>
        <li>
          <Link to="/flying" onClick={onShow}>Fly</Link>
        </li>
        <li>
          <Link to="/poison" onClick={onShow}>Poison</Link>
        </li>
        <li>
          <Link to="/ground" onClick={onShow}>Ground</Link>
        </li>
        <li>
          <Link to="/rock" onClick={onShow}>Rock</Link>
        </li>
        <li>
          <Link to="/bug" onClick={onShow}>Bug</Link>
        </li>
        <li>
          <Link to="/ghost" onClick={onShow}>Ghost</Link>
        </li>
        <li>
          <Link to="/steel" onClick={onShow}>Steel</Link>
        </li>
        <li>
          <Link to="/fire" onClick={onShow}>Fire</Link>
        </li>
        <li>
          <Link to="/water" onClick={onShow}>Water</Link>
        </li>
        <li>
          <Link to="/grass" onClick={onShow}>Grass</Link>
        </li>
        <li>
          <Link to="/electric" onClick={onShow}>Electric</Link>
        </li>
        <li>
          <Link to="/psychic" onClick={onShow}>Psychic</Link>
        </li>
        <li>
          <Link to="/ice" onClick={onShow}>Ice</Link>
        </li>
        <li>
          <Link to="/dragon" onClick={onShow}>Dragon</Link>
        </li>
        <li>
          <Link to="/dark" onClick={onShow}>Dark</Link>
        </li>
        <li>
          <Link to="/fairy" onClick={onShow}>Fairy</Link>
        </li>
        
      </ul>
    </>
  );
};
