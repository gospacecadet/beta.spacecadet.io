Template.manageDockingsApproval.helpers({
  dockingsRequiringApproval: function() {
    return Mart.Carts.find({merchantId: Meteor.userId(), state: Mart.Cart.STATES.WAITING_CART_ACCEPTANCE})
  }
});
