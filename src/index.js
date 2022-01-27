import React from 'react';
import { render } from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import ApiGen, {AjaxApi}from "./components/Api Gen/Gen"
import Header from "./components/header/header";
import ApiType from "./components/Api Type/Type";
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
  "https://pokeapi.co/api/v2/pokemon/?limit=89&offset=809"
];

render(
  <React.StrictMode>
  <BrowserRouter>
  <Routes>
      <Route path='/' element={<Header />}>
          <Route path="/" element={<AjaxApi/>} />
          <Route path="/first_gen" element={<ApiGen urlApi={url[0]} />} />
          <Route path="/second_gen" element={<ApiGen urlApi={url[1]} />} />
          <Route path="/third_gen" element={<ApiGen urlApi={url[2]} />} />
          <Route path="/fourth_gen" element={<ApiGen urlApi={url[3]} />} />
          <Route path="/fifth_gen" element={<ApiGen urlApi={url[4]} />} />
          <Route path="/sixth_gen" element={<ApiGen urlApi={url[5]} />} />
          <Route path="/seventh_gen" element={<ApiGen urlApi={url[6]} />} />
          <Route path="/eighth_gen" element={<ApiGen urlApi={url[7]} />} />
          <Route path="/normal" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/1"}/>}/>
          <Route path="/fighting" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/2"}/>}/>
          <Route path="/flying" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/3"}/>}/>
          <Route path="/poison" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/4"}/>}/>
          <Route path="/ground" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/5"}/>}/>
          <Route path="/rock" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/6"}/>}/>
          <Route path="/bug" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/7"}/>}/>
          <Route path="/ghost" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/8"}/>}/>
          <Route path="/steel" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/9"}/>}/>
          <Route path="/fire" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/10"}/>}/>
          <Route path="/water" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/11"}/>}/>
          <Route path="/grass" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/12"}/>}/>
          <Route path="/electric" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/13"}/>}/>
          <Route path="/psychic" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/14"}/>}/>
          <Route path="/ice" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/15"}/>}/>
          <Route path="/dragon" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/16"}/>}/>
          <Route path="/dark" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/17"}/>}/>
          <Route path="/fairy" element={<ApiType urlApi={"https://pokeapi.co/api/v2/type/18"}/>}/>
          <Route path='*' element={<Navigate replace to='/' />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </React.StrictMode>,
  rootElement
);

reportWebVitals();

