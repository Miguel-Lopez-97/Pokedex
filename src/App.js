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
import BarTypes from "./components/Nav/navegation types"
import ApiType1 from "./components/Api Type/Type 1"
import ApiType2 from "./components/Api Type/Type 2"
import ApiType3 from "./components/Api Type/Type 3"
import ApiType4 from "./components/Api Type/Type 4"
import ApiType5 from "./components/Api Type/Type 5"
import ApiType6 from "./components/Api Type/Type 6"
import ApiType7 from "./components/Api Type/Type 7"
import ApiType8 from "./components/Api Type/Type 8"
import ApiType9 from "./components/Api Type/Type 9"
import ApiType10 from "./components/Api Type/Type 10"
import ApiType11 from "./components/Api Type/Type 11"
import ApiType12 from "./components/Api Type/Type 12"
import ApiType13 from "./components/Api Type/Type 13"
import ApiType14 from "./components/Api Type/Type 14"
import ApiType15 from "./components/Api Type/Type 15"
import ApiType16 from "./components/Api Type/Type 16"
import ApiType17 from "./components/Api Type/Type 17"
import ApiType18 from "./components/Api Type/Type 18"

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
      <BarTypes/>
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
          <Route path="/normal" element={<ApiType1 urlApi={"https://pokeapi.co/api/v2/type/1"}/>}/>
          <Route path="/fighting" element={<ApiType2 urlApi={"https://pokeapi.co/api/v2/type/2"}/>}/>
          <Route path="/flying" element={<ApiType3 urlApi={"https://pokeapi.co/api/v2/type/3"}/>}/>
          <Route path="/poison" element={<ApiType4 urlApi={"https://pokeapi.co/api/v2/type/4"}/>}/>
          <Route path="/ground" element={<ApiType5 urlApi={"https://pokeapi.co/api/v2/type/5"}/>}/>
          <Route path="/rock" element={<ApiType6 urlApi={"https://pokeapi.co/api/v2/type/6"}/>}/>
          <Route path="/bug" element={<ApiType7 urlApi={"https://pokeapi.co/api/v2/type/7"}/>}/>
          <Route path="/ghost" element={<ApiType8 urlApi={"https://pokeapi.co/api/v2/type/8"}/>}/>
          <Route path="/steel" element={<ApiType9 urlApi={"https://pokeapi.co/api/v2/type/9"}/>}/>
          <Route path="/fire" element={<ApiType10 urlApi={"https://pokeapi.co/api/v2/type/10"}/>}/>
          <Route path="/water" element={<ApiType11 urlApi={"https://pokeapi.co/api/v2/type/11"}/>}/>
          <Route path="/grass" element={<ApiType12 urlApi={"https://pokeapi.co/api/v2/type/12"}/>}/>
          <Route path="/electric" element={<ApiType13 urlApi={"https://pokeapi.co/api/v2/type/13"}/>}/>
          <Route path="/psychic" element={<ApiType14 urlApi={"https://pokeapi.co/api/v2/type/14"}/>}/>
          <Route path="/ice" element={<ApiType15 urlApi={"https://pokeapi.co/api/v2/type/15"}/>}/>
          <Route path="/dragon" element={<ApiType16 urlApi={"https://pokeapi.co/api/v2/type/16"}/>}/>
          <Route path="/dark" element={<ApiType17 urlApi={"https://pokeapi.co/api/v2/type/17"}/>}/>
          <Route path="/fairy" element={<ApiType18 urlApi={"https://pokeapi.co/api/v2/type/18"}/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
