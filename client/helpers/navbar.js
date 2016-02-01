Template.navbarMdMerchant.helpers({
  pendingDockingsCount: function() {
    var count = Mart.Carts.find({state: Mart.Cart.STATES.WAITING_CART_ACCEPTANCE}).count()
    if(count > 0)
      return " ( " + count + " )"
  }
});

Template.navbarMdMerchant.onCreated(function() {
  var states = Mart.Cart._STATES()
  this.subscribe("mart/carts", states);
})
