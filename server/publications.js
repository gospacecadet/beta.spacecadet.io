Meteor.publish("adminSettings", function() {
  if(this.userId) {
    return AdminSettings.find({});
  }
  this.ready();
});
