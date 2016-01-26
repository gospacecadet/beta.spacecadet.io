Template.manageProperty.onCreated(function() {
  var template = this
  Tracker.autorun(function(){
    var propertyId = FlowRouter.getParam('propertyId')
    template.subscribe("mart/storefront", propertyId); 
  });
})
