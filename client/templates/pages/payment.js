Template.payment.onCreated(function() {
  Meteor.call('mart/update-gateway-info',
    "Stripe", {}, function(err, result) { }
  )
  this.subscribe('mart/gateways')
})

Template.payment.helpers({
  gateways: function() {
    return Mart.Gateways.find({})
  }
});
