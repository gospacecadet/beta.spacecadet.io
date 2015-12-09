Template.reserveDocking.events({
  "click .removeBooking": function(event, template) {
    Mart.LineItem.remove(this._id)
  }
});

Template.reserveDockingDetails.helpers({
  // Link to station for current LI or home if not found
  stationPath: function() {
    var product = Mart.Products.findOne(this.productId)
    if(product) {
      var storefront = Mart.Storefronts.findOne(product.storefrontId)
      if (storefront)
        return FlowRouter.path("station", {stationId: storefront._id})
    }
    return flowRouterPath("homepage")
  },
  awaitingPaymentState: function() {
    return Mart.Cart.STATES.AWAITING_PAYMENT
  }
});

Template.reserveDocking.onCreated(function() {
  var hooksObject = {
    // Called when any submit operation succeeds
    onSuccess: function(formType, result) {
      // FlowRouter.redirect(dockingPath(this.docId))
      // try to charge card,
      // if successful change state, redirect
      // else, display error, move to new state
    },
    // Called when any submit operation fails
    onError: function(formType, error) {},
  };

  AutoForm.addHooks(['updateCartForm'], hooksObject);

  var dockingPath = function(dockingId) {
    return FlowRouter.path("docking", {dockingId: dockingId})
  }
})
