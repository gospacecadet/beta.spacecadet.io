Meteor.publish("landingPads", function(stationId) {
  return LandingPads.find({
    isActive: true,
    isDeleted: false,
    stationId: stationId
  });
});
