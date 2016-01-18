Template.dock.onCreated(function() {
  Meteor.subscribe("mart/carts", [Mart.Cart.STATES.SHOPPING]);
  Meteor.subscribe("mart/cards");
})
