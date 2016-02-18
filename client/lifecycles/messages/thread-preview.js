Template.threadPreview.onCreated(function() {
  this.subscribe("mart/profile", Template.currentData().recipientId());
})
