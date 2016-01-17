Template.thread.onCreated(function() {
  console.log(Template.currentData().recipientId());
  Meteor.subscribe("talk/messages", Template.currentData()._id);
  Meteor.subscribe("mart/profile", Template.currentData().recipientId());
})
