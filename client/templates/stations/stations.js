Template.stations.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('mart/merchants')
  })
})

Template.stations.helpers({
  stations: function() {
    return Mart.Merchants.find({})
  },
  pathForStation: function() {
    var station = this;

    var path = FlowRouter.path('station', {stationId: station._id})
    return path
  }
});
