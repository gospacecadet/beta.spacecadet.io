Template.reserveDockingDetails.helpers({
  carts: function() {
    return Mart.Carts.find({state: Mart.Cart.STATES.SHOPPING})
  }
});
