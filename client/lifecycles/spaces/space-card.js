Template.spaceCard.onCreated(function() {
  Meteor.subscribe("mart/images/product", Template.currentData()._id);
})
