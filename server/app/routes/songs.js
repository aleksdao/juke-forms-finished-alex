'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const mime = require('mime');
const sendSeekable = require('./middleware/sendSeekable');

module.exports = router;

router.get('/', function (req, res, next) {
  mongoose.model('Song')
  .find(req.query)
  .then(function (songs) {
    res.json(songs);
  })
  .then(null, next);
});

router.param('songId', function (req, res, next, id) {
  mongoose.model('Song')
  .findById(id)
  .populate('artists')
  .then(function (song) {
    if(!song) throw new Error('not found!');
    req.song = song;
    next();
  })
  .then(null, next);
});

router.get('/:songId.audio', sendSeekable, function (req, res, next) {
  if(!req.song.extension) return next(new Error('No audio for song'));
  var options = {
    type: mime.lookup(req.song.extension),
    length: req.song.size
  };
  var stream = mongoose.model('Song')
  .findById(req.params.songId)
  .select('buffer')
  .stream({ transform: song => song.buffer });
  res.sendSeekable(stream, options);
});

router.get('/:songId.image', function (req, res, next) {
  req.song.getAlbums()
  .select('+cover +coverType')
  .then(function (albums) {
    let album = albums[0];
    if(!album.cover || !album.coverType) return next(new Error('no cover'));
    res.set('Content-Type', mime.lookup(album.coverType));
    res.send(album.cover);
  })
  .then(null, next);
});

router.get('/:songId', function (req, res) {
  res.json(req.song);
});
