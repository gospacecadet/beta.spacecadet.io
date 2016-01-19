Template.dockingHistory.onCreated(function() {
  console.log('dockingConfirmation');
  this.autorun(function() {
    var states = Mart.Cart._STATES()
    console.log(states);
    Meteor.subscribe("mart/carts", states);
  });
})
