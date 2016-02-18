Template.managePropertySpaces.helpers({
  hasSpaces: function() {
    var propertyId = FlowRouter.getParam('propertyId')
    return !!Mart.Products.findOne({storefrontId: propertyId})
  }
});
