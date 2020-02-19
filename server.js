'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');

require('dotenv').config();
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3003;

app.get('/location', (request, response) => {
  let city = request.query.city;
  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_API}&q=${city}&format=json`;
  superagent.get(url).then(results => {
    let city = request.query.city;
    let geoData = results.body;
    let location = new City(city, geoData[0]);
    response.send(location);
  }).catch(err => console.error(err));
});

app.get('/weather', (request, response) => {
  try {
    let darksky = require('./data/darksky.json');
    let forecast = darksky.daily.data.map((fc) => new WeatherDay(fc));
    console.log(forecast);
    // for(let i=0;i<darksky.daily.data.length;i++) {
    //   let dailyWeather = new WeatherDay(darksky, i);
    //   forecast.push(dailyWeather);
    // }
    response.send(forecast);
  } catch (err) {
    response.status(500).send(`${err}`);
  }
});

function City(city, obj) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

function WeatherDay(obj) {
  this.forecast = obj.summary;
  let date = new Date(obj.time);
  this.time = date.toDateString();
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
