'use strict'

juke.controller("NewPlaylistCtrl", function ($scope, PlaylistFactory, $state) {

  $scope.createPlaylist = function (playlist) {
    PlaylistFactory.create(playlist)
      .then(function (createdPlaylist) {
        $scope.newPlaylist = null;
        $scope.newPlaylistForm.$setPristine();
        $state.go("onePlaylist", { id: createdPlaylist._id });
      })
  }


})

juke.controller("PlaylistCtrl", function ($scope, PlaylistFactory, playlist, songs, SongFactory, PlayerFactory) {

  $scope.playlist = playlist;
  console.log($scope.playlist.songs);
  $scope.songs = songs;
  $scope.addSong = function (song) {
    console.log("is it in there", song, $scope.songs.indexOf(song));
    PlaylistFactory.addSong($scope.playlist, song)
      .then(function (addedSong) {
        $scope.playlist.songs.push(addedSong);
        $scope.selected = null;
      })
  }

  $scope.toggle = function (song) {
    if (song !== PlayerFactory.getCurrentSong()) {
      PlayerFactory.start(song, $scope.playlist.songs);
    } else if ( PlayerFactory.isPlaying() ) {
      PlayerFactory.pause();
    } else {
      PlayerFactory.resume();
    }
  }

  $scope.removeSong = function (song) {
    PlaylistFactory.removeSong($scope.playlist, song)
      .then(function () {
        console.log(song, $scope.playlist.songs);
        var removedSongIndex = $scope.playlist.songs.indexOf(song);
        $scope.playlist.songs.splice(removedSongIndex, 1);
      })
  }

  $scope.isPlaying = function (song) {
    return PlayerFactory.isPlaying() && PlayerFactory.getCurrentSong() === song;
  };

  $scope.sortableOptions = {
    "ui-floating": true,
    update: function (event, ui) {
      // ui.item.playlistIndex = $scope.playlist.songs.indexOf(ui.item);
      // $scope.playlist.songs.map(function (song) {
      //   console.log("new index", $scope.playlist.songs.indexOf(song))
      //   return song.playlistIndex = $scope.playlist.songs.indexOf(song);
      // })
      console.log("inside update", $scope.playlist);
      PlaylistFactory.updatePlaylist($scope.playlist)
        .then(function (updatedPlaylist) {
          $scope.playlist = updatedPlaylist;
        })
    }
  };


})
