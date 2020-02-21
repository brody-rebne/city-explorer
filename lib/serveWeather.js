'use strict';

require('dotenv').config();
const superagent = require('superagent');
const Weather = require('./weather');

const serveWeather = (request, response) => {
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${lat},${lon}`;
  superagent.get(url).then(result => {
    let forecast = result.body.daily.data.map(fc => new Weather(fc));
    response.send(forecast);
  }).catch(err => console.error(err));
};

module.exports = serveWeather;
