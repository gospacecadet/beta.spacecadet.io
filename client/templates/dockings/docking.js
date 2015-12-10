Template.docking.helpers({
  docking: function() {
    var dockingId = FlowRouter.getParam('dockingId')
    return Mart.Carts.findOne(dockingId)
  },
  dockings: function() {
    return Mart.Cart.lineItems(FlowRouter.getParam('dockingId'))
  },
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
