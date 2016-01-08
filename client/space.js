Template.spaceTopImageAndButtons.helpers({
  thumbnailUrl: function() {

    let img = Mart.Images.findOne({objectId: this._id, objectCollection: "Products"})

    if(img)
      return img.thumbnailUrl
  },
  userId: function() {
    return Meteor.userId()
  },
  propertyOwnerId: function() {

    var storefront = Mart.Storefronts.findOne(this.storefrontId)

    if(storefront) {
      var owner = Meteor.users.findOne(storefront.userId)
    }
  }
});

Template.space.onCreated(function() {
  var propertyId = FlowRouter.getParam('propertyId')
  var productId = Template.currentData()._id
  Meteor.subscribe("mart/images/product", productId);
  Meteor.subscribe("mart/prices", productId);
})

Template.spaceTopUnitSelection.helpers({
  hourlyPrice: function() {
    return unitPrice(this._id, Mart.Product.UNITS.HOUR)
  },
  dailyPrice: function() {
    return unitPrice(this._id, Mart.Product.UNITS.DAY)
  },
  monthlyPrice: function() {
    return unitPrice(this._id, Mart.Product.UNITS.MONTH)
  }
});

Template.spaceTopName.helpers({
  propertyAddress: function() {
    var propertyId = FlowRouter.getParam('propertyId')
    var p = Mart.Storefronts.findOne(propertyId)

    if(p) {
      var a = [p.address, p.address2, p.city, p.state, p.zip]
      a = _.filter(a, function(e) { return e && e.length > 0})
      var a = a.join(", ")

      return a
    }
  },
  propertyName: function() {
    var propertyId = FlowRouter.getParam('propertyId')
    var p = Mart.Storefronts.findOne(propertyId)

    if(p) {
      return p.name
    }
  },
});

var unitPrice = function(productId, unit) {
  var p = Mart.Prices.findOne({
    productId: productId,
    unit: unit
  })

  if(p)
    return p.priceInCents

  return 0
}

Template.spaceDetailDetails.helpers({
  propertyDescription: function() {
    var property = Mart.Storefronts.findOne(this.storefrontId)

    if(property)
      return property.description
  }
});
