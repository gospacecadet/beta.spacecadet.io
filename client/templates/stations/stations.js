Template.stations.onCreated(function() {
  Meteor.subscribe('mart/storefronts')
})

Template.stations.helpers({
  stations: function() {
    return Mart.Storefronts.find({})
  },
  stationPath: function() {
    return FlowRouter.path('station', {stationId: this._id})
  },
  thumbnailUrl: function() {
    var img = Mart.Images.findOne({
      objectId: this._id,
      objectCollection: "Storefronts",
    })

    if(img)
      return img.thumbnailUrl
  }
});
