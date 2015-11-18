Meteor.publish("lineItems", function() {
  var cursors = new Array();
  var cart = Carts.findOne({
    isCurrent: true,
    ownerId: this.userId,
  });

  var lineItemsCursor = LineItems.find({cartId: cart._id});
  cursors.push(lineItemsCursor);

  var lineItems = lineItemsCursor.fetch();

  var landingPadIds = _.map(lineItems, function(element, index, list) {
    return element.landingPadId;
  });

  cursors.push(LandingPads.find({
    _id: {$in: landingPadIds}
  }))

  return cursors;
});
