Security.defineMethod("ifCartBelongsToCurrentUser", {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc) {
    var cart = Carts.findOne(doc.cartId)

    if(cart) {
      return userId !== cart.ownerId
    }
    return true;
  }
});

LineItems.permit(['insert', 'update', 'remove']).never().apply();
LineItems.permit(['insert', 'update']).ifCartBelongsToCurrentUser().apply();
