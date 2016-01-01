Template.stationCarousel.helpers({
  images: function() {
    return Mart.Images.find({
      objectId: this._id,
      objectCollection: "Storefronts",
      // index: {$gt: 1}
    })
  },
  i: function() {
    return this.index - 1
  },
  active: function() {
    return (this.index === 1) ? "active" : ""
  },
  isActive: function() {
    return (this.index === 1)
  },
  firstOptimizedUrl: function() {
    var first = Mart.Images.find({
      objectId: this._id,
      objectCollection: "Storefronts",
      index: 1
    })

    if(!!first)
      return first.optimizedUrl

    return "/"
  }
});
