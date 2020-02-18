'use strict';

const express = require('express');
const app = express();

require('dotenv').config();
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3003;

app.get('/location', (request, response) => {
  try{
    let city = request.query.city;
    let geoData = require('./data/geo.json');
    let location = new City(city, geoData[0]);
    response.send(location);
  } catch (err) {
    console.log(err);
  }
});

function City(city, obj) {
  this.search_query = city;
  this.place_id = obj.place_id;
  this.license = obj.licence;
  this.osm_type = obj.osm_type;
  this.osm_id = obj.osm_id;
  this.boundingbox = obj.boundingbox;
  this.lat = obj.lat;
  this.lon = obj.lon;
  this.display_name = obj.display_name;
  this.class = obj.class;
  this.type = obj.type;
  this.importance = obj.importance;
  this.icon = obj.icon;
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
