Template.thread.onCreated(function() {
  var threadId = Template.currentData()._id
  var recipientId = Template.currentData().recipientId()
  this.subscribe("talk/messages", threadId);
  this.subscribe("mart/profile", recipientId);
})

Template.threadModal.onCreated(function() {
  this.subscribe("talk/messages", Template.currentData()._id);
})

Template.threadMessage.onCreated(function() {
  var messageId = Template.currentData()._id
  Meteor.call('talk/seen-message', messageId)
})
