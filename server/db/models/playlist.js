const mongoose = require('mongoose');
const songListPlugin = require('../plugins/songList');
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const schema = new Schema({
  name: { type: String, required: true, trim: true },
});

// this plugin gives it song and artist arrays
// with some fancy validations and auto population
// check it out!
schema.plugin(songListPlugin);
schema.plugin(deepPopulate);

module.exports = mongoose.model('Playlist', schema);
