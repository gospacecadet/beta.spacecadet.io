Template.inbox.onCreated(function() {
  this.subscribe("talk/all-messages");
  this.subscribe("talk/threads");
})
