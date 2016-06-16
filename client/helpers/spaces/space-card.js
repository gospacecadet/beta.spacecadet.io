Template.spaceCard.helpers({
  propertyId: function() {
    return this.storefrontId
  },
  currentImageUrl: function() {
    var image =  Mart.Image.nP(1, this._id)

    if(image)
      return image.thumbnailUrl
  },
  spaceImages() {
    return Mart.Images.find({objectCollection: "Products", objectId: this._id})
  },
  isActive(index) {
    const sessionId = 'product' + this.objectId
    console.log(sessionId);
    if(!Session.get(sessionId) || (Session.get(sessionId) === this._id)) {
      Session.set(sessionId, this._id);
      return "active"
    } else {
      return "";
    }
  },
  carouselId() {
    return "carousel-space-" + this._id
  }
});
