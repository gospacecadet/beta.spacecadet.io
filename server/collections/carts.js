Carts.permit(['insert', 'update', 'remove']).never().apply();

Meteor.methods({
  findOrCreateCurrentCart: function() {
    cartFields = {ownerId: Meteor.userId(), isCurrent: true}
    var cart = Carts.findOne(cartFields)
    if(cart === undefined)
      Carts.insert(cartFields)
  }
});
