import { useEffect, useState } from "react";
import axios from "axios";
import List from "./components/List";
import ListItem from "./components/ListItem";
import Clue from "./components/Clue";
import { API } from "./api";
import ReactGA from "react-ga";
const TRACKING_ID = "G-R3TF7CT4NE"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

function App() {
  const [actors, setActors] = useState(null);
  const [year, setYear] = useState(null);
  const [clue, setClue] = useState(null);
  const [clues, setClues] = useState(0);
  const [showClue, setShowClue] = useState(false);
  const [tweetMessage, setTweetMessage] = useState(true);
  const [cast, setCast] = useState([]);
  const [revealedActors, setRevealedActors] = useState(1);
  const [answer, setAnswer] = useState(null);
  const [guess, setGuess] = useState("");
  const [finished, setFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availablePoints, setAvailablePoints] = useState(10);
  const [feedback, setFeedback] = useState(
    "Can you guess the movie from just the cast list? Actors are listed in credits order."
  );

  const getClue = (clue) => {
    return { name: "Year", value: clue };
  };

  const revealClue = () => {
    setShowClue(true);
    setClues(clues + 1);
  };

  useEffect(() => {
    const getData = () => {
      // To get this to work on live - need to look into setting up dev / prod urls
      // Pretty sure they do this on JustDjango at some point
      axios.get(API.movie).then((response) => {
        setActors(response.data.actors);
        setYear(response.data.year);
        setCast(response.data.actors.slice(0, 1));
        setAnswer(response.data.title);
        setClue(getClue(response.data.year));
        setIsLoading(false);
      });
    };
    getData();
  }, []);

  useEffect(() => {
    if (actors) {
      setCast((cast) => [...cast, actors[revealedActors - 1]]);
    }
  }, [revealedActors]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (guess.toLowerCase() === answer.toLowerCase()) {
      const clueSuffix = clues > 0 ? " clue" : "clues";
      setFeedback(
        `You got it with ${revealedActors} actors revealed and ${clues} ${clueSuffix}`
      );
      setTweetMessage(
        `I got today's Flicksleuth with ${revealedActors} actor${
          revealedActors > 1 ? "s" : ""
        } revealed and ${clues} ${clueSuffix}. Try it yourself at https://flicksleuth.com`
      );
      setFinished(true);
    } else {
      setRevealedActors(revealedActors + 1);
      setAvailablePoints(availablePoints - 1);
      setFeedback(`Wrong - it's not ${guess}. Try again`);
    }
    setGuess("");
  };

  function refreshPage() {
    window.location.reload(false);
  }

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <>
      <main>
        {/* Header */}
        <div className="py-12 bg-gray-50 sm:py-12 min-h-screen">
          <div className="max-w-md mx-auto pl-4 pr-8 sm:max-w-lg sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="text-4xl leading-10 font-extrabold tracking-tight text-gray-900 text-center sm:text-5xl sm:leading-none lg:text-6xl">
              Flicksleuth
            </h1>
            <div className=" pt-6 text-center">
              <dt className="text-base font-medium text-gray-500">
                Movie name
              </dt>
              <dd className="text-3xl font-extrabold tracking-tight text-gray-700">
                {finished ? answer : answer.replace(/[a-zA-Z0-9+]/g, "*")}
              </dd>
            </div>
            <p className="mt-6 max-w-3xl mx-auto text-xl leading-normal text-gray-500 text-center">
              {feedback}
            </p>
            {finished ? null : (
              <Clue clue={clue} className={showClue ? "" : "invisible"} />
            )}

            <div className={finished ? "hidden" : ""}>
              <div className="mt-6 max-w-3xl mx-auto text-xl leading-normal text-gray-500 text-center">
                <main className="text-center">
                  <form
                    onSubmit={handleSubmit}
                    className="mt-5 flex-1 items-center flex-row"
                  >
                    <label className="text-2xl font-extrabold tracking-tight text-gray-900">
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                      />
                    </label>
                    <input
                      type="submit"
                      value="Guess"
                      className="inline-flex m-1 items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={guess === ""}
                    />
                    <button
                      onClick={revealClue}
                      type="button"
                      className="inline-flex m-1 items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clue
                    </button>
                  </form>
                </main>
              </div>
            </div>
            {finished ? (
              ""
            ) : (
              <>
                <aside className="mt-5 text-xl font-semibold text-gray-900 text-center h-12">
                  <h3 className="order-1 text-gray-900 text-3xl font-extrabold tracking-tight mt-9">
                    Cast
                  </h3>
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
                  className="mt-5 inline-flex items-center px-6 py-2 mx-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Play again
                </button>
                <a
                  class="twitter-share-button mt-5 inline-flex items-center px-6 py-2 mx-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
