Template.navbarMdInbox.onCreated(function() {
  this.subscribe("talk/all-messages");
  this.subscribe("talk/threads");
})

Template.navbarSmInbox.onCreated(function() {
  this.subscribe("talk/all-messages");
  this.subscribe("talk/threads");
})
