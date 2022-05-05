import { useEffect, useState, useRef } from "react";
import axios from "axios";
import List from "./components/List";
import ListItem from "./components/ListItem";
import Clue from "./components/Clue";
import Combobox from "./components/Combobox";
import { API } from "./api";

function App() {
  const [actors, setActors] = useState(null);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState("");
  const [clue, setClue] = useState(null);
  const [year, setYear] = useState(null);
  const [showClue, setShowClue] = useState(false);
  const [tweetMessage, setTweetMessage] = useState(true);
  const [cast, setCast] = useState([]);
  const [revealedActors, setRevealedActors] = useState(1);
  const [answer, setAnswer] = useState(null);
  const [guess, setGuess] = useState("");
  const [finished, setFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availablePoints, setAvailablePoints] = useState(10);
  const [feedback, setFeedback] = useState("");
  const ref = useRef();

  const getClue = (clue) => {
    return { name: "Year", value: clue };
  };

  const revealClue = () => {
    setShowClue(true);
  };

  useEffect(() => {
    const getData = () => {
      // To get this to work on live - need to look into setting up dev / prod urls
      // Pretty sure they do this on JustDjango at some point
      axios.get(API.movie).then((response) => {
        setActors(response.data.actors);
        setCast(response.data.actors.slice(0, 1));
        setAnswer(response.data.title);
        setClue(getClue(response.data.year));
        setYear(response.data.year);
        setIsLoading(false);
      });
    };
    getData();
  }, []);

  useEffect(() => {
    const getApiMovieData = () => {
      axios.get(API.movies + "?query=" + query).then((response) => {
        setMovies(JSON.parse(response.data));
      });
    };
    getApiMovieData();
  }, [query]);

  useEffect(() => {
    if (actors) {
      setCast((cast) => [...cast, actors[revealedActors - 1]]);
    }
  }, [revealedActors]);

  const onMovieSelect = (movie) => {
    if (movie.Title.toLowerCase() === answer.toLowerCase()) {
      const clueSuffix = clue ? " clue" : "clues";
      setFeedback(
        `You got it with ${revealedActors} actors revealed and ${
          clue ? "1" : "0"
        } ${clueSuffix}`
      );
      setTweetMessage(
        `I got today's Flicksleuth with ${revealedActors} actor${
          revealedActors > 1 ? "s" : ""
        } revealed and ${
          clue ? "1" : "0"
        }${clueSuffix}. Try it yourself at https://flicksleuth.com`
      );
      setFinished(true);
    } else {
      setRevealedActors(revealedActors + 1);
      setAvailablePoints(availablePoints - 1);
      let yearGuide = "";
      if (parseInt(year) > parseInt(movie.Year)) {
        yearGuide = "newer";
      } else if (parseInt(year) < parseInt(movie.Year)) {
        yearGuide = "older";
      } else {
        yearGuide = "made in the same year";
      }
      setFeedback(
        `No, not ${movie.Title}. This movie is ${yearGuide}. Try again`
      );
    }
    ref.current.scrollIntoView();
    setGuess("");
  };

  function refreshPage() {
    window.location.reload(false);
  }

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <>
      <main ref={ref}>
        {/* Header */}
        <div className="py-6 bg-gray-50 sm:py-6 md:py-12 min-h-screen">
          <div className="max-w-md mx-auto pl-4 pr-4 sm:max-w-lg sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="text-4xl leading-10 font-extrabold tracking-tight text-gray-900 text-center sm:text-5xl sm:leading-none lg:text-6xl font-sans">
              Flicksleuth
            </h1>
            <p className="text-center text-gray-500 pt-3 italic text-sm">
              Can you guess the movie from the cast list?
            </p>
            <div className=" pt-6 text-center">
              {/* <dt className="text-xl font-extrabold tracking-tight text-gray-900">
                Title
              </dt> */}
              <dd className="text-xl font-extrabold tracking-tight text-gray-600">
                {/* {finished ? answer : answer.replace(/[a-zA-Z0-9+]/g, "*")} */}
                {finished ? answer : null}
              </dd>
              {finished ? null : (
                <Clue clue={clue} className={showClue ? "" : "hidden"} />
              )}
              {showClue ? null : finished ? null : (
                <>
                  <button
                    onClick={revealClue}
                    type="button"
                    className="inline-flex text-center w-100 items-center mt-2 mb-2 px-6 py-2 border border-transparent text-base font-semibold rounded-md shadow-sm text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                  >
                    Clue
                  </button>
                </>
              )}
            </div>
            <p className="text-xl font-extrabold tracking-tight text-gray-600 text-center mt-3 h-100 min-h-fit">
              {feedback}
            </p>

            <div className={finished ? "hidden" : ""}>
              <div className="mt-6 max-w-3xl mx-auto text-xl leading-normal text-gray-500 text-center">
                <main className="text-center">
                  <form>
                    <Combobox
                      movies={movies}
                      setQuery={setQuery}
                      onMovieSelect={onMovieSelect}
                    />
                    <input
                      type="submit"
                      value="Guess"
                      className="m-1 items-center px-6 py-2 border border-transparent text-base font-semibold rounded-md shadow-sm text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                      disabled={guess === ""}
                    />
                  </form>
                </main>
              </div>
            </div>
            {finished ? (
              ""
            ) : (
              <>
                <aside className="mt-5 text-xl font-semibold text-gray-900 text-center h-12">
                  <p className="text-xl font-extrabold tracking-tight text-gray-900">
                    Cast
                  </p>
                  <List>
                    {cast.map((actor) => {
                      return <ListItem actor={actor} key={actor}></ListItem>;
                    })}
                  </List>
                </aside>
              </>
            )}
          </div>
          <div className={finished ? "" : "hidden"}>
            <div className="max-w-7xl mx-auto text-center">
              <div className="">
                <button
                  onClick={refreshPage}
                  className="mt-5 inline-flex items-center px-6 py-2 mx-3 border border-transparent text-base font-semibold rounded-md shadow-sm text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                >
                  Play again
                </button>
                <a
                  className="twitter-share-button mt-5 inline-flex items-center px-6 py-2 mx-3 border border-transparent text-base font-semibold rounded-md shadow-sm text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                  href={`https://twitter.com/intent/tweet?text=${tweetMessage}`}
                  data-url="https://flicksleuth.com"
                >
                  Tweet Result
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
