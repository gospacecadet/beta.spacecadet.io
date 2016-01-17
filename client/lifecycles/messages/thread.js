Template.thread.onCreated(function() {
  Meteor.subscribe("talk/messages", Template.currentData()._id);
  Meteor.subscribe("mart/profile", Template.currentData().recipientId());
})
