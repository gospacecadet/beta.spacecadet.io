Template.spaceTopImageAndButtons.helpers({
  thumbnailUrl: function() {
    let img = Mart.Images.findOne({objectId: this._id, objectCollection: "Products"})

    if(img)
      return img.thumbnailUrl
  }
});

Template.space.onCreated(function() {
  var propertyId = FlowRouter.getParam('propertyId')
  var productId = Template.currentData()._id
  Meteor.subscribe("mart/images/product", productId);
  Meteor.subscribe("mart/prices", productId);

  // By default, see daily price
  Session.setDefault(unitSession(propertyId), Mart.Product.UNITS.DAY)
  Session.setDefault(detailsSession(propertyId), "details")
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
     Session.set(unitSession(FlowRouter.getParam('propertyId')), Mart.Product.UNITS.HOUR)
  },
  "click #daily-price": function(event, template) {
     event.preventDefault()
     Session.set(unitSession(FlowRouter.getParam('propertyId')), Mart.Product.UNITS.DAY)

  },
  "click #monthly-price": function(event, template) {
     event.preventDefault()
     Session.set(unitSession(FlowRouter.getParam('propertyId')), Mart.Product.UNITS.MONTH)
  },
});

Template.spaceDetails.helpers({
  detailsSelected: function() {
    return Session.get(detailsSession(FlowRouter.getParam('propertyId'))) === "details"
  },
  locationSelected: function() {
    return Session.get(detailsSession(FlowRouter.getParam('propertyId'))) === "location"
  },
  reviewsSelected: function() {
    return Session.get(detailsSession(FlowRouter.getParam('propertyId'))) === "reviews"
  }
});

Template.spaceDetails.events({
  "click #details-details": function(event, template) {
    event.preventDefault()
    Session.set(detailsSession(FlowRouter.getParam('propertyId')), "details")
    $(event.target).tab('show')
  },
  "click #details-location": function(event, template) {
    event.preventDefault()
    Session.set(detailsSession(FlowRouter.getParam('propertyId')), "location")
    $(event.target).tab('show')
  },
  "click #details-reviews": function(event, template) {
    event.preventDefault()
    Session.set(detailsSession(FlowRouter.getParam('propertyId')), "reviews")
    $(event.target).tab('show')
  },
});

Template.spaceTopForUnit.helpers({
  hourlySelected: function() {
    return Session.get(unitSession(FlowRouter.getParam('propertyId'))) === Mart.Product.UNITS.HOUR
  },
  dailySelected: function() {
    return Session.get(unitSession(FlowRouter.getParam('propertyId'))) === Mart.Product.UNITS.DAY
  },
  monthlySelected: function() {
    return Session.get(unitSession(FlowRouter.getParam('propertyId'))) === Mart.Product.UNITS.MONTH
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

const DETAILS_SESSION_PREFIX = "details"
var detailsSession = function(propertyId) {
  return DETAILS_SESSION_PREFIX + propertyId
}

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
