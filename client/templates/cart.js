Meteor.startup(function () {
  Meteor.call('mart/cart/findCurrentOrCreate', Mart.guestId())
  Meteor.subscribe("mart/carts", [Mart.Cart.STATES.SHOPPING], Mart.guestId());
});
