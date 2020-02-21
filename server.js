'use strict';

const express = require('express');
const app = express();

require('dotenv').config();
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3003;

const client = require('./lib/client');
const serveLocation = require('./lib/serveLocation');
const serveWeather = require('./lib/serveWeather');
const serveTrails = require('./lib/serveTrails');
const serveMovies = require('./lib/serveMovies');

app.get('/location', (request, response) => {
  serveLocation(request, response);
});

app.get('/weather', (request, response) => {
  serveWeather(request, response);
});

app.get('/trails', (request, response) => {
  serveTrails(request, response);
});

app.get('/movies', (request, response) => {
  serveMovies(request, response);
});

client.connect().then(() => {
  app.listen(PORT, () => console.log(`listening on ${PORT}`));
});
