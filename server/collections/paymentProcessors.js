Meteor.methods({
  updatePaymentProcessors: function() {
    var stripeAPIKey = AdminSettings.findOne({"key": "stripeAPIKey"})
    Stripe = StripeAPI(stripeAPIKey.value);
    var retrieveAccount = Meteor.wrapAsync(Stripe.accounts.retrieve, Stripe.accounts);

    try {
      var result = retrieveAccount();
      paymentProcessor = {
        processorName: "Stripe",
        businessName: result.business_name,
        businessURL: result.business_url,
        detailsSubmitted: result.details_submitted,
        // chargesEnabled: result.charges_enabled,
        // transfersEnabled: result.transfers_enabled,
        // transferSchedule: result.transfer_schedule.interval
      }

      PaymentProcessors.insert(paymentProcessor);
    } catch (error) {
      throw new Meteor.Error("stripe-charge-error", error.message);
    }
  }
});
