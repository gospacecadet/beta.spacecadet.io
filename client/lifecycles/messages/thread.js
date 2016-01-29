Template.thread.onCreated(function() {
  var threadId = Template.currentData()._id
  var recipientId = Template.currentData().recipientId()
  this.subscribe("talk/messages", threadId);
  this.subscribe("mart/profile", recipientId);
})

Template.threadModal.onCreated(function() {
  this.subscribe("talk/messages", Template.currentData()._id);
})
