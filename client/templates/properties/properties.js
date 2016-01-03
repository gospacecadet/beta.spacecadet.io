Template.properties.onCreated(function() {
  Meteor.subscribe('mart/storefronts')
})

Template.properties.helpers({
  properties: function() {
    return Mart.Storefronts.find({})
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
  spaces: function() {
    console.log(this._id);
    return Mart.Products.find({storefrontId: this._id})
  }
});
