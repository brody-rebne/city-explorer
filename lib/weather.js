'use strict';

function Weather(obj) {
  this.forecast = obj.summary;
  let date = new Date(obj.time * 1000);
  this.time = date.toDateString();
}

module.exports = Weather;