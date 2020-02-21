'use strict';

const Restaurant = function(obj) {
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.price = obj.price;
  this.rating = obj.rating;
  this.url = obj.url;
  this.review_count = obj.review_count;
};

module.exports = Restaurant;
