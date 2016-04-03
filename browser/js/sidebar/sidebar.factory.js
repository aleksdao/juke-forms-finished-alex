'use strict'

juke.factory("SidebarFactory", function ($http) {
  var factory = {};
  factory.fetchAll = function () {
    return $http.get("/api/playlists")
      .then(function (response) {
        var playlists = response.data;
        return playlists;
      })
  }
  return factory;
})
