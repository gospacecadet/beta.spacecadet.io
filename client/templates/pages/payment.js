Template.payment.onCreated(function() {
  var self = this;
  var info = new Mart.AccountInfo("primaryStripeContract")
  info.retrieve(function(e,r){})
  self.autorun(function() {
    self.subscribe('mart/contracts')
  })
})

Template.payment.helpers({
  contracts: function() {
    return Mart.Contracts.find({})
  }
});
