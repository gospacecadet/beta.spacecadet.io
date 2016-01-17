Template.threads.onCreated(function() {
  Meteor.subscribe("talk/threads");
})
