Template.dockingHistory.helpers({
  docking: function(accordionId) {
    var docking = _.extend(this, {accordionId: accordionId})
    return docking
  },
  acceptedDockings: function() {
    var states = [
      Mart.Cart.STATES.WAITING_TRANSFER_ACCEPTANCE,
      Mart.Cart.STATES.PROCESSING_TRANSFER,
      Mart.Cart.STATES.SETTLED,
    ]

    return Mart.Carts.find({state: {$in: states}})
  },
  pendingDockings: function() {
    console.log('pendingDockings');
    var states = [
      Mart.Cart.STATES.WAITING_CART_ACCEPTANCE,
      Mart.Cart.STATES.MAKING_PAYMENT,
    ]

    var carts = Mart.Carts.find({state: {$in: states}})
    console.log(carts.count());
    return carts

  },
  rejectedDockings: function() {
    var states = [
      Mart.Cart.STATES.CANCELLED_BY_MERCHANT,
      Mart.Cart.STATES.CANCELLED_BY_PAYMENT,
      Mart.Cart.STATES.CANCELLED_BY_ADMIN,
    ]

    return Mart.Carts.find({state: {$in: states}})
  }
});
