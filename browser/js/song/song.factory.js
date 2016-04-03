'use strict';

juke.factory('SongFactory', function ($http) {

  var factory = {}

  factory.convert = function (song) {
    song.audioUrl = '/api/songs/' + song._id + '.audio';
    return song;
  }

  factory.fetchAll = function () {
    return $http.get("/api/songs")
      .then(function (response) {
        var songs = response.data;
        return songs;
      })
  }

  return factory;

});
