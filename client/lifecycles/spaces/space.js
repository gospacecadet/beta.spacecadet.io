Template.space.onCreated(function() {
  this.autorun(function() {
    var propertyId = FlowRouter.getParam('propertyId')
    console.log('space');
    console.log(propertyId);
    Meteor.subscribe("mart/storefront", propertyId);
  });
})
