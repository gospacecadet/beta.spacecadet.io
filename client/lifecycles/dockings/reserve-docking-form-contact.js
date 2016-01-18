Template.reserveDockingFormContact.helpers({
  contactFirstName: function() {
    var user = Meteor.user()

    if(user && user.profile) {
      return user.firstName
    }
  }
});
