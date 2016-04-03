'use strict';

// arguments
const dir = process.argv[2];
if (!dir) {
  console.error('Please provide the path to your music folder.');
  process.exit();
}
// built-in modules
const pathLib = require('path');
// installed modules
const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs-extra');
const mongoose = require('mongoose');
const chalk = require('chalk');
// custom modules
const helper = require('./helper');
const metadata = require('./metadataWrapper');
const connectToDb = require('../server/db');

const Song = mongoose.model('Song');
Promise.promisifyAll(fs);

const extractMetaData = function (path) {
  return helper.dirWalk(path)
    .then(filesNames => filesNames.filter(helper.isMp3))
    .map(name => metadata(name));
};

const clearDb = function () {
  return Promise.map(['Artist', 'Album', 'Song'], function (modelName) {
    return mongoose.model(modelName).remove();
  });
};

function formatSize (bytes) {
  return Math.round(bytes/1000)/1000 + ' MB';
}

connectToDb.bind({ docsToSave: {} })
.then(function () { // get song metadata and clear db at same time
  console.log('reading file metadata and emptying database');
  return Promise.join(extractMetaData(dir), clearDb());
})
.spread(function (metaData, removeResponses) { // create the artists
  console.log('creating unique artists by name');
  this.files = metaData;
  let artists = _(this.files)
    .pluck('artist')
    .flatten()
    .uniq()
    .value();
  return Promise.map(artists, function (artist) {
    return mongoose.model('Artist').findOrCreate({ name: artist });
  });
})
.then(function (artists) { // create the albums
  console.log('creating albums by name');
  this.artists = _.indexBy(artists, 'name');
  let albums = _(this.files)
    .pluck('album')
    .uniq()
    .value();
  return Promise.map(albums, function (album) {
    return mongoose.model('Album').findOrCreate({ name: album });
  });
})
.then(function (albums) { // create the songs
  console.log('creating songs and reading in files');
  this.albums = _.indexBy(albums, 'name');
  this.totalSize = 0;
  let songs = this.files.map(function (file) {
    file.song = new Song({
      name: file.title,
      artists: file.artist.map(a => this.artists[a], this),
      genres: file.genre,
      extension: pathLib.extname(file.path),
    });
    return fs.readFileAsync(file.path)
    .then(buffer => {
      console.log(chalk.grey(file.song.name + ' — ' + formatSize(buffer.length)));
      this.totalSize += buffer.length;
      file.song.buffer = buffer;
      file.song.size = buffer.length;
      return file.song.save();
    });
  }, this);
  return Promise.all(songs);
})
.then(function () { //associate the songs with their albums
  // push into albums' song arrays
  console.log('seeded ' + this.files.length + ' songs (' + formatSize(this.totalSize) + ')');
  console.log('adding songs to each album');
  this.files.forEach(file => {
    var album = this.albums[file.album];
    album.songs.push(file.song);
    if (file.picture && file.picture.data) {
      album.cover = file.picture.data;
      album.coverType = file.picture.format;
    }
  });
  // save albums
  let albums = _(this.albums)
    .values()
    .invoke('save')
    .value();
  return Promise.all(albums);
})
.then(function () {
  console.log(chalk.green('seeding complete!'));
  process.exit(0);
})
.catch(function (err) {
  console.error(chalk.red(err));
  console.error(err.stack);
  process.exit(1);
});
