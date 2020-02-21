'use strict';

require('dotenv').config();
const superagent = require('superagent');
const Trail = require('./trail');

const serveTrails = (request, response) => {
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxResults=10&key=${process.env.HIKINGPROJECT_API}`;
  superagent.get(url).then(result => {
    let trailsArr = result.body.trails.map(t => new Trail(t));
    response.send(trailsArr);
  }).catch(err => console.error(err));
};

module.exports = serveTrails;
