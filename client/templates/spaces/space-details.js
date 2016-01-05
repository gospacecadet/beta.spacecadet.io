Template.spaceDetailDetails.helpers({
  propertyDescription: function() {
    var p = Mart.Storefronts.findOne(FlowRouter.getParam('propertyId'))

    if(p)
      return p.description
  }
});
