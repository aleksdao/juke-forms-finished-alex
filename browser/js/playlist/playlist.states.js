'use strict'

juke.config(function ($stateProvider) {
  $stateProvider
    .state("createPlaylist", {
      url: "/createplaylist",
      templateUrl: "/js/playlist/templates/createplaylist.html",
      controller: "NewPlaylistCtrl"
    })
    .state("onePlaylist", {
      url: "/playlists/:id",
      templateUrl: "/js/playlist/templates/playlist.html",
      controller: "PlaylistCtrl",
      resolve: {
        playlist: function ($stateParams, PlaylistFactory) {
          return PlaylistFactory.fetchById($stateParams.id);
        },
        songs: function (SongFactory) {
          return SongFactory.fetchAll()
        }
        // playlistSongs: function ($stateParams, PlaylistFactory) {
        //   return PlaylistFactory.fetchAllSongs($stateParams.id)
        // }
      }
    })
})
