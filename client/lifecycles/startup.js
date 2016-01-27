Meteor.startup(function() {
  Meteor.subscribe("mart/carts",
   [Mart.Cart.STATES.SHOPPING],
   Mart.guestId())

   sAlert.config({
     offset: 90
   });
});
