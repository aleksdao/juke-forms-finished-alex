'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
module.exports = router;

router.get('/', function (req, res, next) {
  mongoose.model('Playlist')
  .find(req.query)
  .then(function (playlists) {
    res.json(playlists);
  })
  .then(null, next);
});

router.post('/', function (req, res, next) {
  mongoose.model('Playlist')
  .create(req.body)
  .then(function (playlist) {
    res.status(201).json(playlist);
  })
  .then(null, next);
});

router.param('playlistId', function (req, res, next, id) {
  mongoose.model('Playlist')
  .findById(id)
  .populate('artists songs')
  .deepPopulate('songs.artists')
  .then(function (playlist) {
    if(!playlist) throw new Error('not found!');
    req.playlist = playlist;
    next();
  })
  .then(null, next);
});

router.get('/:playlistId', function (req, res) {
  res.json(req.playlist);
});

router.put('/:playlistId', function (req, res, next) {
  console.log("req.body", req.body);
  req.playlist.set(req.body);
  req.playlist.save()
  .then(function (playlist) {
    console.log("updated playlist", playlist)
    res.status(200).json(playlist);
  })
  .then(null, next);
});

router.delete('/:playlistId', function (req, res, next) {
  req.playlist.remove()
  .then(function () {
    res.status(204).end();
  })
  .then(null, next);
});

router.get('/:playlistId/songs', (req, res) => res.json(req.playlist.songs) );

router.post('/:playlistId/songs', function (req, res, next) {
  req.playlist.songs.addToSet(req.body.song);
  req.playlist.save()
  .then( () => mongoose.model('Song').findById(req.body.song._id || req.body.song).populate('artists') )
  .then( song => res.status(201).json(song) )
  .then(null, next);
});

router.delete('/:playlistId/songs/:songId', function (req, res, next) {
  req.playlist.songs.pull(req.params.songId);
  req.playlist.save()
  .then(function () {
    res.status(204).end();
  })
  .then(null, next);
});
