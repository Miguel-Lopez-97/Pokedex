import React, { useState } from "react";
import { Route, Routes, BrowserRouter} from "react-router-dom";
import "./App.css";
import AjaxApi from "./components/Api Gen/Gen";
import ApiGen2 from "./components/Api Gen//Gen 2"
import ApiGen3 from "./components/Api Gen//Gen 3"
import ApiGen4 from "./components/Api Gen//Gen 4"
import ApiGen5 from "./components/Api Gen//Gen 5"
import ApiGen6 from "./components/Api Gen//Gen 6"
import ApiGen7 from "./components/Api Gen//Gen 7"
import ApiGen8 from "./components/Api Gen//Gen 8"
import ApiGen1 from "./components/Api Gen/Gen 1"
import Header from "./components/header/header";
import BarNav from "./components/Nav/navegation";

function App() {
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

  return (
    <>
      <Header/>
      <BarNav/>
      <div className="App">
        <Routes>
          <Route path="/" element={<AjaxApi/>} />
          <Route path="/first_gen" element={<ApiGen1 urlApi={url[0]} />} />
          <Route path="/second_gen" element={<ApiGen2 urlApi={url[1]} />} />
          <Route path="/third_gen" element={<ApiGen3 urlApi={url[2]} />} />
          <Route path="/fourth_gen" element={<ApiGen4 urlApi={url[3]} />} />
          <Route path="/fifth_gen" element={<ApiGen5 urlApi={url[4]} />} />
          <Route path="/sixth_gen" element={<ApiGen6 urlApi={url[5]} />} />
          <Route path="/seventh_gen" element={<ApiGen7 urlApi={url[6]} />} />
          <Route path="/eighth_gen" element={<ApiGen8 urlApi={url[7]} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
