/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { useState } from "react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Combobox } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example(props) {
  const [selectedMovie, setSelectedMovie] = useState();

  function onMovieSelect(movie) {
    setSelectedMovie(movie);
    props.onMovieSelect(movie);
  }

  return (
    <Combobox
      as="div"
      value={selectedMovie}
      onChange={onMovieSelect}
      className="max-w-sm mx-auto"
    >
      <Combobox.Label className="block mt-3 text-sm text-indigo-200">
        Search movies
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => {
            if (event.target.value.length > 2) {
              props.setQuery(event.target.value);
            }
          }}
          displayValue={(movie) => (movie ? movie.name : "")}
          onClick={() => setSelectedMovie(null)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {props.movies && props.movies.Search && props.movies.Search.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {props.movies.Search.map((movie) => (
              <Combobox.Option
                key={movie.imdbID}
                value={movie}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-indigo-200",
                    active ? "bg-gray-100 text-gray-900" : "text-gray-600"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <img
                        src={movie.Poster}
                        alt=""
                        className="h-16 flex-grow-0"
                      />
                      <div className="flex flex-col">
                        <div
                          className={classNames(
                            "ml-3",
                            selected && "font-bold"
                          )}
                        >
                          {movie.Title}
                        </div>
                        <div
                          className={classNames(
                            "ml-3 truncate bold",
                            selected && "font-semibold"
                          )}
                        >
                          {`${movie.Year}`}
                        </div>
                      </div>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
