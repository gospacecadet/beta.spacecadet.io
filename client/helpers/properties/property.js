Template.property.helpers({
  property: function() {
    var propertyId = FlowRouter.getParam('propertyId')
    return Mart.Storefronts.findOne(propertyId)
  },
  currentImageUrl: function() {
    let img = Mart.Images.findOne({objectId: this._id, objectCollection: "Storefronts"})

    if(img)
      return img.optimizedUrl
  },
  propertyImages() {
    return Mart.Images.find({objectCollection: "Storefronts", objectId: this._id})
  },
  isActive(index) {
    const sessionId = 'storefront' + this.objectId
    console.log(sessionId);
    if(!Session.get(sessionId) || (Session.get(sessionId) === this._id)) {
      Session.set(sessionId, this._id);
      return "active"
    } else {
      return "";
    }
  },
  carouselId() {
    return "carousel-property-" + this._id
  }
});
