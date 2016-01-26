Template.manageSpace.onCreated(function() {
  Tracker.autorun(function() {
    var spaceId = FlowRouter.getParam('spaceId')
    Meteor.subscribe("mart/product", spaceId);
  });
})
