Template.properties.helpers({
  properties: function() {
    var locationFilter = Session.get('location-filter')
    var filter = {isPublished: true}

    if(locationFilter) {
      if(locationFilter === "USA") {
        _.extend(filter, {$and: [
          {city: {$ne: "San Antonio"}},
          {city: {$ne: "Austin"}}
        ]})
      } else {
        _.extend(filter, {city: locationFilter})
      }
    }

    return Mart.Storefronts.find(filter,
      {sort: {updatedAt: -1}})
  },
  locationFilter() {
    return Session.get('location-filter')
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
