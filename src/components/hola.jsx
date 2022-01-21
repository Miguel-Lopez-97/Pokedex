function App() {
    const [data, setData] = useState([]);
    useEffect(() => {
      const getApi = async () => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=100")
        .then(resp => resp.json())
        .then(dat => {
          dat.results.forEach(value => {
              fetch(value.url)
              .then(resp => resp.json())
              .then(dat => {
                setData(prev => [...prev.sort((a,b) => a.id - b.id), {
                  id: dat.id,
                  name: dat.name,
                  img: dat.sprites.front_default,
                  type: dat.types[0].type.name
                }]);
              });
          });
        })
      }
      getApi();
    }, []);
  
    return (
      <div className="App">
        <h1 className="content__title">Pokeapi</h1>
        <div className="content">
          {console.log(data)}
          {data.map(value => <Card key={value.id} data={value}/>)}
        </div>
      </div>
    );
  }
  
  export default App;