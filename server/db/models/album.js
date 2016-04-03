const mongoose = require('mongoose');
const songListPlugin = require('../plugins/songList');
const findOrCreate = require('../plugins/findOrCreate');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const Schema = mongoose.Schema;

var schema = new Schema({
  name: { type: String, required: true, trim: true },
  cover: {type: Buffer, select: false },
  coverType: { type: String, select: false }
});

// this plugin gives it song and artist arrays
// with some fancy validations and auto population
// check it out!
schema.plugin(songListPlugin);
schema.plugin(findOrCreate);
schema.plugin(deepPopulate);

module.exports = mongoose.model('Album', schema);
