import React from 'react';
import { render } from "react-dom";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import {ApiGen} from "./components/Api_Gen/Gen"
import {Home} from "./components/Api_Gen/Home"
import {Header} from "./components/header/header";
import {ApiType} from "./components/Api_Type/Type";
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById("root");

const url = [
  "https://pokeapi.co/api/v2/pokemon/?limit=151&offset=0",
  "https://pokeapi.co/api/v2/pokemon/?limit=100&offset=151",
  "https://pokeapi.co/api/v2/pokemon/?limit=135&offset=251",
  "https://pokeapi.co/api/v2/pokemon/?limit=107&offset=386",
  "https://pokeapi.co/api/v2/pokemon/?limit=156&offset=493",
  "https://pokeapi.co/api/v2/pokemon/?limit=72&offset=649",
  "https://pokeapi.co/api/v2/pokemon/?limit=88&offset=721",
  "https://pokeapi.co/api/v2/pokemon/?limit=89&offset=809",
  "https://pokeapi.co/api/v2/pokemon/?offset=898&limit=220"
];

render(
  <React.StrictMode>
  <HashRouter>
  <Routes>
      <Route path='/' element={<Header />}>
          <Route path="/" element={<Home/>} />
          <Route path="/first_gen" element={<ApiGen urlApi={url[0]} Gen="Kanto - First" />} />
          <Route path="/second_gen" element={<ApiGen urlApi={url[1]} Gen="Johto - Second"/>} />
          <Route path="/third_gen" element={<ApiGen urlApi={url[2]} Gen="Hoenn - Third"/>} />
          <Route path="/fourth_gen" element={<ApiGen urlApi={url[3]} Gen="Sinnoh - Fourth"/>} />
          <Route path="/fifth_gen" element={<ApiGen urlApi={url[4]} Gen="Unova - Fifth"/>} />
          <Route path="/sixth_gen" element={<ApiGen urlApi={url[5]} Gen="Kalos - Sixth"/>} />
          <Route path="/seventh_gen" element={<ApiGen urlApi={url[6]} Gen="Alola - Seventh"/>} />
          <Route path="/eighth_gen" element={<ApiGen urlApi={url[7]} Gen="Galar - Eighth"/>} />
          <Route path="/alternative_forms" element={<ApiGen urlApi={url[8]} Gen="Alternative Forms"/>} />
          <Route path="/normal" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/1"} Gen="Normal"/>}/>
          <Route path="/fighting" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/2"} Gen="Fighting"/>}/>
          <Route path="/flying" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/3"} Gen="Fly"/>}/>
          <Route path="/poison" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/4"} Gen="Poison"/>}/>
          <Route path="/ground" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/5"} Gen="Ground"/>}/>
          <Route path="/rock" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/6"} Gen="Rock"/>}/>
          <Route path="/bug" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/7"} Gen="Bug"/>}/>
          <Route path="/ghost" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/8"} Gen="Ghost"/>}/>
          <Route path="/steel" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/9"} Gen="Steel"/>}/>
          <Route path="/fire" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/10"} Gen="Fire"/>}/>
          <Route path="/water" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/11"} Gen="Water"/>}/>
          <Route path="/grass" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/12"} Gen="Grass"/>}/>
          <Route path="/electric" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/13"} Gen="Electric"/>}/>
          <Route path="/psychic" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/14"} Gen="Psychic"/>}/>
          <Route path="/ice" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/15"} Gen="Ice"/>}/>
          <Route path="/dragon" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/16"} Gen="Dragon"/>}/>
          <Route path="/dark" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/17"} Gen="Dark"/>}/>
          <Route path="/fairy" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/18"} Gen="Fairy"/>}/>
          <Route path='*' element={<Navigate replace to='/' />} />
      </Route>
    </Routes>
  </HashRouter>
  </React.StrictMode>,
  rootElement
);

reportWebVitals();

