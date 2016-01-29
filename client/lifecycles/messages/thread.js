Template.thread.onCreated(function() {
  var threadId = Template.currentData()._id
  var recipientId = Template.currentData().recipientId()
  this.subscribe("talk/messages", threadId);
  this.subscribe("mart/profile", recipientId);
})
