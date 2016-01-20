Template.transferFunds.onCreated(function() {
  Meteor.subscribe("mart/carts", [Mart.Cart.STATES.WAITING_TRANSFER_ACCEPTANCE]);
})

Template.transferFundsApproval.onCreated(function() {
  Meteor.subscribe("mart/images/storefront", Template.currentData().storefrontIdAtCheckout);
  Meteor.subscribe("mart/bank-accounts-for", Template.currentData().merchantId);
})
