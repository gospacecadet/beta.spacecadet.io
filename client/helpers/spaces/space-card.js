Template.spaceCard.helpers({
  propertyId: function() {
    return this.storefrontId
  },
  currentImageUrl: function() {
    console.log('currentImageUrl');
    var image =  Mart.Image.nP(1, this._id)
    console.log(image);

    if(image)
      return image.thumbnailUrl
  }
});
