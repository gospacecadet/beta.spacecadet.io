Template.editStation.onRendered(function() {
  var thiz = this
  Tracker.autorun(function() {
    if(thiz.subscriptionsReady() && Roles.userIsInRole(Meteor.user(), [
        Mart.ROLES.GLOBAL.ADMIN,
        Mart.ROLES.GLOBAL.MERCHANT,
        Mart.ROLES.GLOBAL.REP,
      ], Mart.ROLES.GROUPS.GLOBAL)) {
        return
    } else {
      // FlowRouter.go('homepage')
    }
  });

  // Meteor.subscribe("mart/images", "station", this._id);
});
