Template.reserveDockingDetailsCart.helpers({
  subtotal: function() {
    return _.reduce(this.lineItems, function(sum, line) {
      var l = Mart.LineItems.findOne(line._id)
      return sum + l.subtotal()
    }, 0)
  }
});
