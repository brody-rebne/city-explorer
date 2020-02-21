'use strict';

require('dotenv').config();
const superagent = require('superagent');
const Restaurant = require('./restaurant');

const serveRestaurants = (request, response) => {
  let latitude = request.query.latitude;
  let longitude = request.query.longitude;
  let url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}`;
  superagent.get(url).set('Authorization', `Bearer ${process.env.YELP_API}`).then(result => {
    let restaurantsArr = result.body.businesses.map(r => new Restaurant(r));
    let sortedRestaurantsArr = restaurantsArr.sort((a, b) => {
      let aR = a.review_count;
      let bR = b.review_count;
      if(aR<bR) {
        return 1;
      } else if(aR>bR) {
        return -1;
      } else {
        return 0;
      }
    });
    response.send(sortedRestaurantsArr);
  }).catch(err => console.error(err));
};

module.exports = serveRestaurants;
