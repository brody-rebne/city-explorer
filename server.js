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
    console.log(err);
  }
});

app.get('/weather', (request, response) => {
  try {
    let darksky = require('./data/darksky.json');
    let forecast = [];
    for(let i=0;i<darksky.daily.data.length;i++) {
      let dailyWeather = new WeatherDay(darksky);
      forecast.push(dailyWeather);
    }
    response.send(forecast);
  } catch (err) {
    console.log(err);
  }
});

function City(city, obj) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

function WeatherDay(obj) {
  this.forecast = obj.daily.data.summary;
  this.time = obj.daily.data.time.toDateString();
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
