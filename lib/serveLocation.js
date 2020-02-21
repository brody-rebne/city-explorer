'use strict';

require('dotenv').config();
const client = require('./client');
const superagent = require('superagent');
const City = require('./city');

const serveLocation = function(request, response) {
  let city = request.query.city;
  let selectSQL = 'SELECT * FROM locations WHERE search_query = $1;';
  let selectSafeValues = [city];
  client.query(selectSQL, selectSafeValues).then(data => {
    if(data.rowCount) {
      response.send(data.rows[0]);
    } else {
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
};

module.exports = serveLocation;
