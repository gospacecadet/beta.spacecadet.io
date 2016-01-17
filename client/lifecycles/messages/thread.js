Template.thread.onCreated(function() {
  Meteor.subscribe("talk/messages", this._id);
})
