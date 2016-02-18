Template.reserveDockingFormContact.helpers({
  contactFirstName: function() {
    return Meteor.user().profile.firstName
  },
  contactFirstName: function() {
    return Meteor.user().profile.firstName
  },
  contactEmail: function() {
    return Meteor.user().emails[0].address
  },
  contactPhone: function() {
    return Meteor.user().profile.phone
  }
});
