Template.reserveDocking.helpers({
  stationName: function() {
    var lp = Mart.Products.findOne(this.productId)
    if(lp) {
      var storefrontId = lp.storefrontId;
      return Mart.Storefronts.findOne(storefrontId).name
    }
    return "Unknown"
  },
  landingPadName: function() {
    var lp = Mart.Products.findOne(this.productId)
    if(lp) {
      return lp.name
    }
    return "Unknown"
  }
});
