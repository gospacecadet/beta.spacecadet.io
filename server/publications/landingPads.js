Meteor.publish("landingPads", function(stationId) {
  return LandingPads.find({
    isActive: true,
    isDeleted: false,
    stationId: stationId
  });
});

Meteor.publish("allLandingPads", function() {
  return LandingPads.find({
    isActive: true,
    isDeleted: false
  });
});

Meteor.publish("aLandingPad", function(landingPadId) {
  return LandingPads.find({
    isActive: true,
    isDeleted: false,
    _id: landingPadId
  });
});
