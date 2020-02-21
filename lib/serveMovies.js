'use strict';

require('dotenv').config();
const superagent = require('superagent');
const Movie = require('./movie');

const serveMovies = (request, response) => {
  let city = request.query.search_query;
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API}&language=en-US&query=${city}&page=1&include_adult=true`;
  superagent.get(url).then(result => {
    let moviesArr = result.body.results.map(m => new Movie(m));
    let sortedMoviesArr = moviesArr.sort((a, b) => {
      let aP = a.popularity;
      let bP = b.popularity;
      if(aP<bP) {
        return 1;
      } else if(aP>bP) {
        return -1;
      } else {
        return 0;
      }
    });
    response.send(sortedMoviesArr);
  }).catch(err => console.error(err));
};

module.exports = serveMovies;
