Template.stations.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('mart/storefronts')
  })
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
