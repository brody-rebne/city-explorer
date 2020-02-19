'use strict';

const express = require('express');
const app = express();

require('dotenv').config();
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3003;

app.get('/location', (request, response) => {
  try {
    let city = request.query.city;
    let geoData = require('./data/geo.json');
    let location = new City(city, geoData[0]);
    response.send(location);
  } catch (err) {
    response.status(500).send(`${err}`);
  }
});

app.get('/weather', (request, response) => {
  try {
    let timezone = request.query.timezone;
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
