Template.editStation.onCreated(function() {
  // var thiz = this
  // Tracker.autorun(function() {
  //   if(thiz.subscriptionsReady() && Roles.userIsInRole(Meteor.user(), [
  //       Mart.ROLES.GLOBAL.ADMIN,
  //       Mart.ROLES.GLOBAL.MERCHANT,
  //       Mart.ROLES.GLOBAL.REP,
  //     ], Mart.ROLES.GROUPS.GLOBAL)) {
  //       return
  //   } else {
  //     // FlowRouter.go('homepage')
  //   }
  // });

  Tracker.autorun(function() {
    var stationId = FlowRouter.getParam('stationId')
    Meteor.subscribe("mart/storefront", stationId);
  });

});

Template.editStation.helpers({
  station: function() {
    var stationId = FlowRouter.getParam('stationId')
    return Mart.Storefronts.findOne(stationId)
  },
  uploader: function(directiveName, index, objectId) {
    let metaContext = {
      index: index,
      objectId: objectId,
    }

    return new Slingshot.Upload(directiveName, metaContext);
  },
})
