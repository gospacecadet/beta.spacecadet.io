Template.space.onCreated(function() {
  this.autorun(function() {
    var spaceId = FlowRouter.getParam('spaceId')
    Meteor.subscribe("mart/product", spaceId);
  });
})
