Template.spaceCard.helpers({
  propertyId: function() {
    return this.storefrontId
  },
  currentImageUrl: function() {
    var image =  Mart.Image.nP(1, this._id)

    if(image)
      return image.thumbnailUrl
  }
});
