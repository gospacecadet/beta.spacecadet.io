Meteor.publish("lineItems", function() {
  var cursors = new Array();
  var cart = Carts.findOne({
    isCurrent: true,
    ownerId: this.userId,
  });

  var lineItemsCursor = LineItems.find({cartId: cart._id});
  cursors.push(lineItemsCursor);

  var lineItems = lineItemsCursor.fetch();

  _.each(lineItems, function(lineItem, i, list) {
    cursors.push(LandingPads.find({_id: lineItem.landingPadId}))
  });

  return cursors;
});
