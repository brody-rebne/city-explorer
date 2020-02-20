'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');

require('dotenv').config();
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3003;

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

app.get('/location', (request, response) => {
  let city = request.query.city;
  let selectSQL = 'SELECT * FROM locations WHERE search_query = $1;';
  let selectSafeValues = [city];
  client.query(selectSQL, selectSafeValues).then(data => {
    if(data.rowCount) {
      console.log('location found in db');
      response.send(data.rows[0]);
    } else {
      console.log('inserting into database');
      let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_API}&q=${city}&format=json`;
      superagent.get(url).then(result => {
        let geoData = result.body;
        let location = new City(city, geoData[0]);
        let insertSQL = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';
        let insertSafeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude];
        client.query(insertSQL, insertSafeValues);
        response.send(location);
      });
    }
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

client.connect().then(() => {
  app.listen(PORT, () => console.log(`listening on ${PORT}`));
});
