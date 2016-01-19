Template.dockingHistoryDetails.helpers({
  totalAtCheckout: function() {
    var cart = Mart.Carts.findOne(this._id)
    if(cart)
      return cart.total()
  },
  subtotalAtCheckout: function() {
    var cart = Mart.Carts.findOne(this._id)
    if(cart)
      return cart.subtotal()
  },
  serviceFeeAtCheckout: function() {
    var cart = Mart.Carts.findOne(this._id)
    if(cart)
      return cart.serviceFee()
  },
  taxAtCheckout: function() {
    var cart = Mart.Carts.findOne(this._id)
    if(cart)
      return cart.tax()
  }
});
