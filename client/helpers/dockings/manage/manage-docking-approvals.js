Template.manageDockingsApproval.helpers({
  dockingsRequiringApproval: function() {
    var dockings = Mart.Carts.find({merchantId: Meteor.userId(), state: Mart.Cart.STATES.WAITING_CART_ACCEPTANCE})
    console.log(dockings.count());
    return dockings
  }
});
