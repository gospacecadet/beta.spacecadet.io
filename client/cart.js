Meteor.startup(function () {
  Meteor.call('findOrCreateCurrentCart');
});

Handlebars.registerHelper("cart", function() {
  return Carts.findOne();
});

Handlebars.registerHelper("cartId", function() {
  var cart = Carts.findOne();
  if(cart)
    return cart._id;
  return undefined;
});
