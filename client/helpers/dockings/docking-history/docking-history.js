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

    return Mart.Carts.find({userId: Meteor.userId(), state: {$in: states}})
  },
  pendingDockings: function() {
    var states = [
      Mart.Cart.STATES.WAITING_CART_ACCEPTANCE,
      Mart.Cart.STATES.MAKING_PAYMENT,
    ]

    var carts = Mart.Carts.find({userId: Meteor.userId(), state: {$in: states}})
    return carts

  },
  rejectedDockings: function() {
    var states = [
      Mart.Cart.STATES.CANCELLED_BY_MERCHANT,
      Mart.Cart.STATES.CANCELLED_BY_PAYMENT,
      Mart.Cart.STATES.CANCELLED_BY_ADMIN,
    ]

    return Mart.Carts.find({userId: Meteor.userId(), state: {$in: states}})
  }
});
