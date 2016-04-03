'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
module.exports = router;

router.get('/', function (req, res, next) {
  mongoose.model('Artist')
  .find(req.query)
  .then(function (artists) {
    res.json(artists);
  })
  .then(null, next);
});

router.param('artistId', function (req, res, next, id) {
  mongoose.model('Artist')
  .findById(id)
  .then(function (artist) {
    if (!artist) throw new Error('not found!');
    req.artist = artist;
    next();
  })
  .then(null, next);
});

router.get('/:artistId', function (req, res) {
  res.json(req.artist);
});

router.get('/:artistId/albums', function (req, res, next) {
  req.artist.getAlbums()
  .then(function (albums) {
    res.json(albums);
  })
  .then(null, next);
});

router.get('/:artistId/songs', function (req, res, next) {
  req.artist.getSongs()
  .then(function (songs) {
    res.json(songs);
  })
  .then(null, next);
});
