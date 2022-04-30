import {useEffect, useState} from "react"
import axios from "axios"
import List from "./components/List"
import ListItem from "./components/ListItem"

function App() {
  const [movie, setMovie] = useState(null)
  const [actors, setActors] = useState(null)
  const [cast, setCast] = useState([])
  const [revealedActors, setRevealedActors] = useState(1)
  const [answer, setAnswer] = useState(null)
  const [guess, setGuess] = useState("");
  const [finished, setFinished] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      const getData = () => {
        axios.get("http://127.0.0.1:8000/api/movie").then(response => {
          setMovie(response.data)
          setActors(response.data.actors)
          setCast(response.data.actors.slice(0, 1))
          setAnswer(response.data.title)
          setIsLoading(false)
        });
      }
      getData()
  },[])

  useEffect(() => {
    if(actors){
      setCast(cast => [...cast, actors[revealedActors -1]])
    }
  },[revealedActors])

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if(guess.toLowerCase() === answer.toLowerCase()){
      setFinished(true)
    } else {
      alert('Wrong!');
      setRevealedActors(revealedActors + 1);
    }
    setGuess("")
}

  return (isLoading ? <p>Loading...</p>:
  <div className="relative bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20  lg:w-full lg:pb-28 xl:pb-32">
    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
    <span className="block xl:inline mt-6 mb-6">Guess the movie</span>
    </h1>
    {finished ? (<h3 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl my-6">You correctly guessed {answer} with {revealedActors} actors revealed</h3>) : (
    <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl my-6">Clue: {answer.replace(/\S/g, "#")}</h3>
    )}
    <form onSubmit={handleSubmit}>
    <label className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-6">
      My Guess:
      <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={guess}  onChange={e => setGuess(e.target.value)}/>
    </label>
    <input type="submit" value="Submit" className="mt-3 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" />
  </form>
    <h3 className="order-1 text-gray-900 text-3xl font-extrabold tracking-tight mt-9">Cast</h3>
    <List>
    {cast.map((actor) => {
      return <ListItem actor={actor} key={actor}></ListItem>
    })}
    </List>
    </div>
    </div>
</div>
  );
}

export default App;
