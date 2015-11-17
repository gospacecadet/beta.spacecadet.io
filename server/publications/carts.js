Meteor.publish("cart", function() {
  return Carts.find({
    isCurrent: true,
    ownerId: this.userId,
  });
});
