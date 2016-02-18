Template.manageSpace.helpers({
  space: function() {
    var spaceId = FlowRouter.getParam("spaceId")
    return Mart.Products.findOne(spaceId)
  }
});
