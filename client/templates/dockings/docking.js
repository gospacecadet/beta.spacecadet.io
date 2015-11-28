Template.docking.onCreated(function() {
  var self = this
  self.autorun(function() {
    var stationId = FlowRouter.getParam('stationId')
    // Meteor.subscribe('mart/stations')
    Meteor.subscribe("mart/carts", stationId);
  });

  self.autorun(function() {
    var stationId = FlowRouter.getParam('stationId')
    // Meteor.subscribe('mart/stations')
    Meteor.subscribe("mart/products", stationId);
  });
})
