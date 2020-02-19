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
    let forecast = result.body.daily.data.map((fc) => new WeatherDay(fc));
    response.send(forecast);
  }).catch(err => console.error(err));
});

// https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200689068-fbabe38f860e184addaeddc952eb5c87

app.get('/trails', (request, response) => {
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxResults=10&key=${process.env.HIKINGPROJECT_API}`;
  superagent.get(url).then(result => {
    let trailsArr = result.body.trails.map((t) => new Trail(t));
    response.send(trailsArr);
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

function Trail(obj) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionStatus;
  let splitDateTime = obj.conditionDate.split(' ');
  this.condition_date = splitDateTime[0];
  this.condition_time = splitDateTime[1];
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
