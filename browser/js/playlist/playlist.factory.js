'use strict'

juke.factory("PlaylistFactory", function ($http, SongFactory) {
  var cachedPlaylists = [];

  var PlaylistFactory = {};

  PlaylistFactory.fetchAll = function () {
    return $http.get('/api/playlists')
    .then(function (response) {
      angular.copy(response.data, cachedPlaylists);
      return cachedPlaylists;
    });
  };

  PlaylistFactory.create = function (data) {
    return $http.post('/api/playlists', data)
    .then(function (response) {
      var playlist = response.data
      cachedPlaylists.push(playlist);
      return playlist;
    });
  };

  PlaylistFactory.fetchById = function (playlistId) {
    return $http.get("/api/playlists/" + playlistId)
      .then(function (response) {
        var playlist = response.data;
        playlist.songs.map(function (song) {
          song.playlistIndex = playlist.songs.indexOf(song);
          return SongFactory.convert(song);
        })
        return playlist;
      })
  }

  PlaylistFactory.addSong = function (playlist, song) {
    console.log(song);
    return $http.post("/api/playlists/" + playlist._id + "/songs", { song: song })
      .then(function (response) {
        var addedSong = response.data;
        // cachedPlaylistSongs.push(addedSong);
        return addedSong;
      })
  }

  PlaylistFactory.removeSong = function (playlist, song) {
    return $http.delete("/api/playlists/" + playlist._id + "/songs/" + song._id);
  }

  PlaylistFactory.updatePlaylist = function (playlist) {
    return $http.put("/api/playlists/" + playlist._id, playlist)
      .then(function (response) {
        var updatedPlaylist = response.data;
        return updatedPlaylist;
      })
  }
  // PlaylistFactory.fetchAllSongs = function (playlist) {
  //   return $http.get("/api/playlists/" + playlist._id + "/songs")
  //     .then(function (response) {
  //       angular.copy(response.data, cachedPlaylistSongs);
  //       return cachedPlaylistSongs;
  //     })
  // }

  return PlaylistFactory;
})
