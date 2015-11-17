Security.defineMethod("ifStationBelongsToCurrentUser", {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc) {
    var station = Stations.findOne({_id: doc.stationId, isActive: true, isDeleted: false})

    if(station) {
      return userId !== station.ownerId
    }
    return true;
  }
});

LandingPads.permit(['insert', 'update', 'remove']).never().apply();
LandingPads.permit(['insert', 'update'])
  .ifStationBelongsToCurrentUser()
  .apply();
