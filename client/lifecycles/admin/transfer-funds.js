Template.transferFunds.onCreated(function() {
  this.subscribe("mart/carts", [Mart.Cart.STATES.WAITING_TRANSFER_ACCEPTANCE]);
})

Template.transferFundsApproval.onCreated(function() {
  this.subscribe("mart/images/storefront", Template.currentData().storefrontIdAtCheckout);
  this.subscribe("mart/bank-accounts-for", Template.currentData().merchantId);
})
