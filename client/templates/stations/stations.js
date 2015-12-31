Template.stations.onCreated(function() {
  Meteor.subscribe('mart/storefronts')
})

Template.stations.helpers({
  stations: function() {
    return Mart.Storefronts.find({})
  },
  stationPath: function() {
    return FlowRouter.path('station', {stationId: this._id})
  }
});
