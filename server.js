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
  superagent.get(url).then(result => {
    let city = request.query.city;
    let geoData = result.body;
    let location = new City(city, geoData[0]);
    response.send(location);
  }).catch(err => console.error(err));
});

app.get('/weather', (request, response) => {
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${lat},${lon}`;
  superagent.get(url).then(result => {
    console.log(result.body.daily.data[0]);
    let forecast = result.body.daily.data.map((fc) => new WeatherDay(fc));
    response.send(forecast);
  }).catch(err => console.error(err));
});

function City(city, obj) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

function WeatherDay(obj) {
  this.forecast = obj.summary;
  let date = new Date(obj.time * 1000);
  this.time = date.toDateString();
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
