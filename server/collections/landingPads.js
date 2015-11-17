Security.defineMethod("ifBelongsToCurrentUser", {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc) {
    var station = Stations.findOne(doc.stationId)

    if(station) {
      return userId !== station.ownerId
    }
    return true;
  }
});

LandingPads.permit(['insert', 'update', 'remove']).never().apply();
LandingPads.permit(['insert', 'update']).ifBelongsToCurrentUser().apply();
