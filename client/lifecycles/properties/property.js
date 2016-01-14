Template.property.onCreated(function() {
  this.autorun(function() {
    var propertyId = FlowRouter.getParam('propertyId')
    Meteor.subscribe("mart/storefront", propertyId);
  });
})
