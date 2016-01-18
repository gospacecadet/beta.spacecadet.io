Template.reserveDockingDetailsAddOns.helpers({
  cartsSubtotal: function() {
    var shoppingCarts = Mart.Carts.find({state: Mart.Cart.STATES.SHOPPING}).fetch()

    return _.reduce(shoppingCarts, function(sum, cart) {
      return sum + cart.subtotal()
    }, 0)
  },
  serviceFee: function() {
    var shoppingCarts = Mart.Carts.find({state: Mart.Cart.STATES.SHOPPING}).fetch()

    return _.reduce(shoppingCarts, function(sum, cart) {
      return sum + cart.subtotal()
    }, 0) * Mart.SERVICE_FEE_PCT
  },
  tax: function() {
    var shoppingCarts = Mart.Carts.find({state: Mart.Cart.STATES.SHOPPING}).fetch()

    return _.reduce(shoppingCarts, function(sum, cart) {
      return sum + cart.subtotal()
    }, 0) * Mart.TAX_PCT
  },
  total: function() {
    var shoppingCarts = Mart.Carts.find({state: Mart.Cart.STATES.SHOPPING}).fetch()

    return _.reduce(shoppingCarts, function(sum, cart) {
      console.log(cart.total());
      return sum + cart.total()
    }, 0)
  }
});
