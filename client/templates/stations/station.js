Template.station.onCreated(function() {
  var self = this
  self.autorun(function() {
    var stationId = FlowRouter.getParam('stationId')
    Meteor.subscribe("mart/storefront", stationId);
  });

  self.autorun(function() {
    var stationId = FlowRouter.getParam('stationId')
  });
})

Template.station.helpers({
  station: function() {
    var stationId = FlowRouter.getParam('stationId')
    return Mart.Storefronts.findOne(stationId)
  },
  landingPads: function() {
    return Mart.Products.find()
  },
  canEdit: function() {
    // return true
    return Roles.userIsInRole(Meteor.userId(), [
      Mart.ROLES.GLOBAL.MERCHANT,
      Mart.ROLES.GLOBAL.ADMIN,
      Mart.ROLES.GLOBAL.REP
    ], Mart.ROLES.GROUPS.GLOBAL)
  },
  currentImageUrl: function() {
    return Mart.Images.findOne().optimizedUrl
  }
});
