Template.inbox.onCreated(function() {
  Meteor.subscribe("talk/all-messages");
  Meteor.subscribe("talk/threads");
})
