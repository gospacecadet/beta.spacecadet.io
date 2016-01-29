Template.thread.onCreated(function() {
  this.subscribe("talk/messages", Template.currentData()._id);
  this.subscribe("mart/profile", Template.currentData().recipientId());
})
//
// Template.threadAttachFile.onCreated(function() {
//   Session.setDefault("threadFile")
// })
