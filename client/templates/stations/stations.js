Template.stations.onCreated(function() {
  Meteor.subscribe('mart/storefronts')
})

Template.stations.helpers({
  stations: function() {
    return Mart.Storefronts.find({})
  },
  pathForStation: function() {
    var station = this;

    var path = FlowRouter.path('station', {stationId: station._id})
    return path
  }
});
