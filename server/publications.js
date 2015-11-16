Meteor.publish("adminSettings", function() {
  if(this.userId) {
    return AdminSettings.find({});
  }
  this.ready();
});

Meteor.publish("paymentProcessors", function() {
  if(this.userId) {
    return PaymentProcessors.find({});
  }
  this.ready();
});

Meteor.publish("stations", function() {
  return Stations.find({isActive: true});
});
