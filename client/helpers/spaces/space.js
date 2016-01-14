Template.space.helpers({
  space: function() {
    var spaceId = FlowRouter.getParam('spaceId')
    return Mart.Products.findOne(spaceId)
  },
  currentImageUrl: function() {
    var image = Mart.Images.findOne({
      objectId: FlowRouter.getParam('spaceId'),
      objectCollection: "Products"
    })

    if(image)
      return image.optimizedUrl
  }
});
