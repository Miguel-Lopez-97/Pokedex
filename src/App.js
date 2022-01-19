import "./App.css";
import AjaxApi from "./components/AjaxApi";


function App() {
  return (
    <>
    <h1>Pokedex</h1>
    <div className="App">
      <AjaxApi>
      </AjaxApi>
    </div>
    </>
  );
}

export default App;
