Template.spaceDetails.helpers({
  propertyName: function() {
    var propertyId = FlowRouter.getParam('propertyId')
    var property = Mart.Storefronts.findOne(propertyId)

    if(property)
      return property.name
  }
});
