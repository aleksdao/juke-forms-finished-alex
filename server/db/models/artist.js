'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('../plugins/findOrCreate');

const schema = new Schema({
  name: { type: String, required: true, trim: true }
});

schema.methods.getSongs = function () {
  return mongoose
  .model('Song')
  .find({ artists: this._id })
  .populate('artists');
};

schema.methods.getAlbums = function () {
  return mongoose
  .model('Album')
  .find({ artists: this._id });
};

schema.plugin(findOrCreate);

module.exports = mongoose.model('Artist', schema);
