PaymentProcessors.permit(['insert', 'update', 'remove']).never().apply();

Meteor.methods({
  updatePaymentProcessors: function() {
    var stripeAPIKey = AdminSettings.findOne({"key": "stripeAPIKey"})
    Stripe = StripeAPI(stripeAPIKey.value);
    var retrieveAccount = Meteor.wrapAsync(Stripe.accounts.retrieve, Stripe.accounts);

    try {
      var paymentProcessor = PaymentProcessors.findOne({processorName: "Stripe"});
      var result = retrieveAccount();
      // var external_account = result.external_accounts.data
      console.log(result);
      var paymentProcessorAttrs = {
        processorName: "Stripe",
        businessName: result.business_name,
        businessURL: result.business_url,
        detailsSubmitted: result.details_submitted,
        chargesEnabled: result.charge_enabled,
        transfersEnabled: result.transfer_enabled
      }

      if(paymentProcessor) {
        PaymentProcessors.update(paymentProcessor._id, { $set: paymentProcessorAttrs })
      } else {
        PaymentProcessors.insert(paymentProcessorAttrs);
      }
    } catch (error) {
      throw new Meteor.Error("stripe-charge-error", error.message);
    }
  }
});
