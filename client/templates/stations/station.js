Template.station.onCreated(function() {
  var self = this
  self.autorun(function() {
    var stationId = FlowRouter.getParam('stationId')
    // Meteor.subscribe('mart/stations')
    Meteor.subscribe("mart/storefront", stationId);
  });

  self.autorun(function() {
    var stationId = FlowRouter.getParam('stationId')
    // Meteor.subscribe('mart/stations')
    Meteor.subscribe("mart/products", stationId);
  });
})

Template.station.helpers({
  station: function() {
    var stationId = FlowRouter.getParam('stationId')
    var station = Mart.Storefronts.findOne(stationId)
    return station
  },
  landingPads: function() {
    return Mart.Products.find()
  }
});
