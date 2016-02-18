Template.transferFunds.helpers({
  dockingsWaitingTransfer: function() {
    return Mart.Carts.find({state: Mart.Cart.STATES.WAITING_TRANSFER_ACCEPTANCE})
  },
  hasDockingsWaitingTransfer: function() {
    return Mart.Carts.find({state: Mart.Cart.STATES.WAITING_TRANSFER_ACCEPTANCE}).count() > 0
  },
});
