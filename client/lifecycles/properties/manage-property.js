Template.manageProperty.onCreated(function() {
  Tracker.autorun(function(){
    var propertyId = FlowRouter.getParam('propertyId')
    Meteor.subscribe("mart/storefront", propertyId); 
  });
})
