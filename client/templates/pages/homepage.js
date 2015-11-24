var accountLookup = "stripeDetails"
Session.setDefault(accountLookup, {})

Template.paymentProcessor.helpers({
  processorName: function() {
    return Session.get(accountLookup).processorName
  },
  businessName: function() {
    return Session.get(accountLookup).businessName
  },
  businessURL: function() {
    return Session.get(accountLookup).businessURL
  },
  detailsSubmitted: function() {
    return Session.get(accountLookup).detailsSubmitted
  },
  chargesEnabled: function() {
    return Session.get(accountLookup).chargesEnabled
  },
  transfersEnabled: function() {
    return Session.get(accountLookup).transfersEnabled
  }
});

Template.paymentProcessor.onCreated(function() {
  accountInfo = new Mart.AccountInfo("primaryStripeContract")

  accountInfo.retrieve(function(err, resp) {
    Session.set(accountLookup, resp)
  })
})
