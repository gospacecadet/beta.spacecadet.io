Template.property.onCreated(function() {
  var template = this
  this.autorun(function() {
    var propertyId = FlowRouter.getParam('propertyId')
    template.subscribe("mart/storefront", propertyId);
  });
})
