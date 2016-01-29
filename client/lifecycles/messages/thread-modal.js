Template.threadModal.onCreated(function() {
  var threadId = Template.currentData()._id
  this.subscribe("talk/messages", threadId);
})
