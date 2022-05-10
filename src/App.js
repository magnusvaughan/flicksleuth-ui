import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReward } from "react-rewards";
import List from "./components/List";
import ListItem from "./components/ListItem";
import Clue from "./components/Clue";
import Combobox from "./components/Combobox";
import { API } from "./api";

function App() {
  const [actors, setActors] = useState(null);
  const [won, setWon] = useState(false);
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
  const { reward, isAnimating } = useReward("rewardId", "confetti");

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
    const request = axios.CancelToken.source(); // (*)

    const getApiMovieData = async () => {
      try {
        const response = await axios.get(API.movies + "?query=" + query, {
          cancelToken: request.token, // (*)
        });
        setMovies(JSON.parse(response.data));
      } catch (err) {}
    };
    getApiMovieData();

    return () => request.cancel(); // (*)
  }, [query]);

  useEffect(() => {
    if (actors) {
      setCast((cast) => [...cast, actors[revealedActors - 1]]);
    }
  }, [revealedActors]);

  const onMovieSelect = (movie) => {
    if (revealedActors === 9) {
      setFeedback("Bad luck - you didn't get it today.");
      setTweetMessage(
        `I couldn't quite get today's Flicksleuth. Try it yourself at https://flicksleuth.com`
      );
      setFinished(true);
    } else if (movie.Title.toLowerCase() === answer.toLowerCase()) {
      setWon(true);
      const clueSuffix = showClue ? " clue" : "clues";
      setFeedback(
        `You got it with ${revealedActors} actors revealed and ${
          showClue ? "1" : "0"
        } ${clueSuffix}`
      );
      reward();
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
    <div className="flex justify-center items-center bg-blue-600 h-fit min-h-screen w-100">
      <svg
        role="status"
        className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  ) : (
    <>
      <div
        className="bg-blue-600 py-16 sm:py-6 h-fit min-h-screen w-100"
        ref={ref}
      >
        <div className="relative sm:py-3 w-100">
          <div aria-hidden="true" className="hidden sm:block">
            <div className="absolute inset-y-0 left-0 w-100 bg-blue-600 rounded-r-3xl" />
          </div>
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="relative rounded-2xl px-6 py-10 bg-blue-600 overflow-hidden shadow-2xl sm:px-12 sm:py-20">
              <div
                aria-hidden="true"
                className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
              ></div>
              <div className="relative">
                <div className="sm:text-center">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl text-center tracking-wide">
                    Flicksleuth
                  </h2>
                  <p className="mt-6 mx-auto max-w-2xl text-lg text-blue-200 text-center">
                    Guess the movie from the cast list?
                  </p>
                </div>
                <div className=" pt-6 text-center">
                  <dd className="text-xl font-extrabold tracking-tight text-white">
                    {/* {finished ? answer : answer.replace(/[a-zA-Z0-9+]/g, "*")} */}
                    {finished ? (won ? `${answer} is correct!` : null) : null}
                  </dd>
                  {finished ? null : (
                    <Clue clue={clue} className={showClue ? "" : "hidden"} />
                  )}
                  {showClue ? null : finished ? null : (
                    <>
                      <button
                        onClick={revealClue}
                        type="button"
                        className="max-w-xs mx-auto my-3 block w-full rounded-md border border-transparent px-5 py-3 bg-blue-500 text-base font-medium text-white shadow hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 sm:px-10"
                      >
                        Clue
                      </button>
                    </>
                  )}
                </div>
                <p className="mt-6 mx-auto max-w-2xl text-lg text-blue-200 text-center min-h-[1rem]">
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
                    className="max-w-xs mx-auto my-3 block w-full rounded-md border border-transparent px-5 py-3 bg-blue-500 text-base font-medium text-white shadow hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 sm:px-10"
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
                        className="max-w-xs mx-auto my-3 block w-full rounded-md border border-transparent px-5 py-3 bg-blue-500 text-base font-medium text-white shadow hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 sm:px-10"
                      >
                        Play again
                      </button>
                      <a
                        className="max-w-xs mx-auto my-3 block w-full rounded-md border border-transparent px-5 py-3 bg-blue-500 text-base font-medium text-white shadow hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 sm:px-10"
                        href={`https://twitter.com/intent/tweet?text=${tweetMessage}`}
                        data-url="https://flicksleuth.com"
                      >
                        Tweet Result
                      </a>
                    </div>
                    <span id="rewardId" />
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
