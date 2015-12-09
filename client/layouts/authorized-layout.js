Template.authorizedLayout.helpers({
  authInProcess: function() {
    return Meteor.loggingIn();
  },
  canShow: function() {
    return !!Meteor.user()
    // Session.get('pageAllowed')
  }
});
