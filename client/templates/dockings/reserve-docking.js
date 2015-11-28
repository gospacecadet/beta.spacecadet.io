Template.reserveDocking.events({
  "click .removeBooking": function(event, template) {
    Mart.LineItem.remove(this._id)
  }
});

Template.reserveDocking.helpers({
  // Link to station for current LI or home if not found
  stationPath: function() {
    var product = Mart.Products.findOne(this.productId)
    if(product) {
      var storefront = Mart.Storefronts.findOne(product.storefrontId)
      if (storefront)
        return FlowRouter.path("station", {stationId: storefront._id})
    }
    return flowRouterPath("homepage")
  }
});
