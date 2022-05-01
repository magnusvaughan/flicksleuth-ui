const debug = process.env.NODE_ENV !== "production";
let baseURL = "https://flicksleuth.herokuapp.com";

if (debug) {
  baseURL = "http://127.0.0.1:8000";
}

const apiURL = `${baseURL}/api`;

console.log(apiURL);

export const API = {
  movies: `${apiURL}/movies`,
  movie: `${apiURL}/movie`,
};
