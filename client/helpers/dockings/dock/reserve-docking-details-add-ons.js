Template.reserveDockingDetailsAddOns.helpers({
  cartsSubtotal: function() {
    if(currentCart())
      return currentCart().subtotal()
  },
  serviceFee: function() {
    if(currentCart())
      return currentCart().subtotal() * Mart.SERVICE_FEE_PCT
  },
  tax: function() {
    if(currentCart())
      return currentCart().subtotal() * Mart.TAX_PCT
  },
  total: function() {
    if(currentCart())
      return currentCart().total()
  }
});

var currentCart = function() {
  var lineItemId = FlowRouter.getParam('lineItemId')
  var lineItem = Mart.LineItems.findOne(lineItemId)
  if(!lineItem)
    return

  var cart = Mart.Carts.findOne(lineItem.cartId)
  if(!cart || (cart.userId !== Meteor.userId()))
    return

  return cart
}
