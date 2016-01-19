Template.manageDockings.onCreated(function() {
  this.autorun(function() {
    var states = Mart.Cart._STATES()
    Meteor.subscribe("mart/carts", states);
  });
})
