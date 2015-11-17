Meteor.publish("stations", function() {
  return Stations.find({
    isActive: true,
    isDeleted: false
  });
});
