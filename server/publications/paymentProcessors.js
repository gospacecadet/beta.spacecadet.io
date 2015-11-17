Meteor.publish("paymentProcessors", function() {
  if(this.userId) {
    return PaymentProcessors.find({});
  }
  this.ready();
});
