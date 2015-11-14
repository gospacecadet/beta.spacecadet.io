Template.paymentProcessors.onRendered(function () {
  Meteor.call('updatePaymentProcessors');
});
