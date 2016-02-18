Template.myProfile.helpers({
  profile: function() {
    return Meteor.user().profile
  }
});
