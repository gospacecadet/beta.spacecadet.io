Template.reserveDockingDetails.helpers({
  cart: function() {
    var lineItemId = FlowRouter.getParam('lineItemId')
    var lineItem = Mart.LineItems.findOne(lineItemId)
    if(!lineItem)
      return

    var cart = Mart.Carts.findOne(lineItem.cartId)
    if(!cart || (cart.userId !== Meteor.userId()))
      return

    return cart
  }
});

Template.reserveDockingDetailsLine.helpers({
  timeDetails: function() {
    return "@ " + this.startAtHour + ":" + this.startAtMinute
  }
});
