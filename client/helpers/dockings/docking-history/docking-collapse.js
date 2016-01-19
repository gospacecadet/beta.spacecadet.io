Template.dockingCollapse.helpers({
  address3AtCheckout: function() {
    return this.cityAtCheckout + ", " + this.stateAtCheckout + " " + this.zipAtCheckout
  },
  startDockingOn: function() {
    var cart = Mart.Carts.findOne(this._id)
    if(cart)
      return cart.firstBookingStarts()
  },
  totalAtCheckout: function() {
    var cart = Mart.Carts.findOne(this._id)
    if(cart)
      return cart.total()
  },
});
