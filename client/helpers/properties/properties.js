Template.properties.helpers({
  properties: function() {
    return Mart.Storefronts.find({isPublished: true}, {sort: {updatedAt: -1}})
  },
  propertyPath: function() {
    return FlowRouter.path('property', {propertyId: this._id})
  },
  thumbnailUrl: function() {
    var img = Mart.Images.findOne({
      objectId: this._id,
      objectCollection: "Storefronts",
    })

    if(img)
      return img.thumbnailUrl
  },
});
