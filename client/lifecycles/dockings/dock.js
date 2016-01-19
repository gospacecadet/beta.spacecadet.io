Template.dock.onCreated(function() {
  Tracker.autorun(function(){
    Meteor.subscribe("mart/carts", [Mart.Cart.STATES.SHOPPING]);
    Meteor.subscribe("mart/cards");
  });
})
