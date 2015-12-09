Template.newStation.helpers({
  canShow: function() {
    return Roles.userIsInRole(Meteor.user(), [
      Mart.ROLES.GLOBAL.ADMIN,
      Mart.ROLES.GLOBAL.MERCHANT,
      Mart.ROLES.GLOBAL.REP,
    ], Mart.ROLES.GROUPS.GLOBAL)
  }
});
