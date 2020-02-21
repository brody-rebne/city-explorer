'use strict';

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

module.exports = Trail;
