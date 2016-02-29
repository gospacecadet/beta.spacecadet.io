Template.manageDockingsUpcoming.helpers({
  upcomingDockings: function() {
    var states = [
      Mart.Cart.STATES.WAITING_TRANSFER_ACCEPTANCE,
      Mart.Cart.STATES.PROCESSING_TRANSFER,
      Mart.Cart.STATES.SETTLED,
    ]

    return Mart.Carts.find({merchantId: Meteor.userId(), state: {$in: states}})
  },
});

Template.upcomingDocking.helpers({
  renterThread: function() {
    return Talk.thread(this.userId)
  }
});
