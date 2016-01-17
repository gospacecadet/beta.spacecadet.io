Template.spaceCard.onCreated(function() {
  Tracker.autorun(function() {
    var spaceId =  Template.currentData()._id
    Meteor.subscribe("mart/images/product", spaceId);
    Meteor.subscribe("mart/prices", spaceId);
  });
})
