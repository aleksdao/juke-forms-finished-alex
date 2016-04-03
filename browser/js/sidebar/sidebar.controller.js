'use strict';

juke.controller('SidebarCtrl', function ($scope, PlaylistFactory) {

  PlaylistFactory.fetchAll()
    .then(function (playlists) {
      $scope.playlists = playlists;
    })


});
