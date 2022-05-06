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
      const clueSuffix = showClue ? " clue" : "clues";
      setFeedback(
        `You got it with ${revealedActors} actors revealed and ${
          showClue ? "1" : "0"
        } ${clueSuffix}`
      );
      setTweetMessage(
        `I got today's Flicksleuth with ${revealedActors} actor${
          revealedActors > 1 ? "s" : ""
        } revealed and ${
          showClue ? "1" : "0"
        } ${clueSuffix}. Try it yourself at https://flicksleuth.com`
      );
      setFinished(true);
    } else {
      setRevealedActors(revealedActors + 1);
      setAvailablePoints(availablePoints - 1);
      let yearGuide = "";
      if (parseInt(year) > parseInt(movie.Year)) {
        yearGuide = "Newer";
      } else if (parseInt(year) < parseInt(movie.Year)) {
        yearGuide = "Older";
      } else {
        yearGuide = "Same year, though.";
      }
      setFeedback(`No, not ${movie.Title}. ${yearGuide}. Try again`);
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
      <div
        className="bg-indigo-600 py-16 sm:py-24 h-screen flex align-center justify-center"
        ref={ref}
      >
        <div className="relative sm:py-16">
          <div aria-hidden="true" className="hidden sm:block">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-indigo-600 rounded-r-3xl" />
            <svg
              className="absolute top-8 left-1/2 -ml-3"
              width={404}
              height={392}
              fill="none"
              viewBox="0 0 404 392"
            >
              <defs>
                <pattern
                  id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
            </svg>
          </div>
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="relative rounded-2xl px-6 py-10 bg-indigo-600 overflow-hidden shadow-xl sm:px-12 sm:py-20">
              <div
                aria-hidden="true"
                className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 1463 360"
                >
                  <path
                    className="text-indigo-500 text-opacity-40"
                    fill="currentColor"
                    d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                  />
                  <path
                    className="text-indigo-700 text-opacity-40"
                    fill="currentColor"
                    d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                  />
                </svg>
              </div>
              <div className="relative">
                <div className="sm:text-center">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl text-center tracking-wide">
                    Flicksleuth
                  </h2>
                  <p className="mt-6 mx-auto max-w-2xl text-lg text-indigo-200 text-center">
                    Guess the movie from the cast list?
                  </p>
                </div>
                <div className=" pt-6 text-center">
                  <dd className="text-xl font-extrabold tracking-tight text-white">
                    {/* {finished ? answer : answer.replace(/[a-zA-Z0-9+]/g, "*")} */}
                    {finished ? `${answer} is correct!` : null}
                  </dd>
                  {finished ? null : (
                    <Clue clue={clue} className={showClue ? "" : "hidden"} />
                  )}
                  {showClue ? null : finished ? null : (
                    <>
                      <button
                        onClick={revealClue}
                        type="button"
                        className="max-w-xs mx-auto my-3 block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                      >
                        Clue
                      </button>
                    </>
                  )}
                </div>
                <p className="mt-6 mx-auto max-w-2xl text-lg text-indigo-200 text-center min-h-[1rem]">
                  {feedback}
                </p>
                <form className={finished ? "hidden" : ""}>
                  <Combobox
                    movies={movies}
                    setQuery={setQuery}
                    onMovieSelect={onMovieSelect}
                  />
                  <button
                    type="submit"
                    value="Guess"
                    className="max-w-xs mx-auto my-3 block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                    disabled={guess === ""}
                  >
                    Guess
                  </button>
                </form>
                {finished ? (
                  ""
                ) : (
                  <>
                    <aside className="mt-5 text-xl font-semibold text-white text-center">
                      <p className="text-xl font-extrabold tracking-tight text-white">
                        Cast
                      </p>
                      <List>
                        {cast.map((actor) => {
                          return (
                            <ListItem actor={actor} key={actor}></ListItem>
                          );
                        })}
                      </List>
                    </aside>
                  </>
                )}
                <div className={finished ? "" : "hidden"}>
                  <div className="max-w-7xl mx-auto text-center">
                    <div className="">
                      <button
                        onClick={refreshPage}
                        className="max-w-xs mx-auto my-3 block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                      >
                        Play again
                      </button>
                      <a
                        className="max-w-xs mx-auto my-3 block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                        href={`https://twitter.com/intent/tweet?text=${tweetMessage}`}
                        data-url="https://flicksleuth.com"
                      >
                        Tweet Result
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
