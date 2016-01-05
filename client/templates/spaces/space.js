Template.spaceTopImageAndButtons.helpers({
  thumbnailUrl: function() {
    let img = Mart.Images.findOne({objectId: this._id, objectCollection: "Products"})

    if(img)
      return img.thumbnailUrl
  }
});

Template.space.onCreated(function() {
  var productId = Template.currentData().spaceData._id
  Meteor.subscribe("mart/images/product", productId);
  Meteor.subscribe("mart/prices", productId);

  // By default, see daily price
  Session.setDefault(unitSession(this.propertyId), Mart.Product.UNITS.DAY)
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

const UNIT_SESSION_PREFIX = "unit-selected-"
Template.spaceTopUnitSelection.events({
  "click #hourly-price": function(event, template) {
     event.preventDefault()
     Session.set(unitSession(this.propertyId), Mart.Product.UNITS.HOUR)
  },
  "click #daily-price": function(event, template) {
     event.preventDefault()
     Session.set(unitSession(this.propertyId), Mart.Product.UNITS.DAY)

  },
  "click #monthly-price": function(event, template) {
     event.preventDefault()
     Session.set(unitSession(this.propertyId), Mart.Product.UNITS.MONTH)
  },
});

Template.spaceTopForUnit.helpers({
  hourlySelected: function() {
    return Session.get(unitSession(this.propertyId)) === Mart.Product.UNITS.HOUR
  },
  dailySelected: function() {
    return Session.get(unitSession(this.propertyId)) === Mart.Product.UNITS.DAY
  },
  monthlySelected: function() {
    return Session.get(unitSession(this.propertyId)) === Mart.Product.UNITS.MONTH
  }
});

var unitSession = function(propertyId) {
  return UNIT_SESSION_PREFIX + propertyId
}

var unitPrice = function(productId, unit) {
  var p = Mart.Prices.findOne({
    productId: productId,
    unit: unit
  })

  if(p)
    return p.priceInCents

  return 0
}
