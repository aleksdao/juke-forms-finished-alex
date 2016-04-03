/*
  - this module is a mongoose plugin
  - it gets passed a schema and modifies it
  - it adds two fields: songs and artists
  - it ensures that songs are unique
  - when documents are saved
    if songs are modified, it populates them,
    concats their artists all together,
    ensures that they're unique
*/
const _ = require('lodash')
const mongoose = require('mongoose')

module.exports = function(schema) {
  schema.add({
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }]
  })

  schema.pre('validate', function(next) {
    if(!this.isModified('songs')) return next()
    this.songs = _.uniq(this.songs)
    next()
  })

  // recompute artists array if songs change
  schema.pre('save', function(next) {
    // don't run this hook if songs haven't changed
    let self = this
    if(!this.isModified('songs')) return next()

    this
      .populate('songs')
      .execPopulate() //needed to get a promise
      .then(function(songListDoc) {
        return songListDoc.songs
          // pluck out each songs artist array
          .map( song => song.artists )
          // at this point the array is like this
          // -> [[artistId, artistId], [artistId], [artistId]]
          // flatten & concat them all together
          .reduce(function(albumArtists, songArtists) {
            return albumArtists.concat(songArtists)
          }, [])
      })
      // mongoose won't let us return a promise in presave hooks
      .then(function(artists) {
          // now the array is like
          // -> [artistId1, artistId1, artistId2, artistId2]
          // let's dedup it!
        self.artists = _.uniq(artists.map(String))
        self.markModified('artists')
        next()
      }, next)
  })
}
