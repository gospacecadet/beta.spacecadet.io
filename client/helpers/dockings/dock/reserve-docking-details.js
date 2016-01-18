Template.reserveDockingDetails.helpers({
  carts: function() {
    Tracker.autorun(function() {
      var shoppingCarts = Mart.Carts.find({state: Mart.Cart.STATES.SHOPPING}).fetch()

      Session.set('shopping-carts-grouped-by-property', groupCartsByProperty(shoppingCarts))
    });

    return Session.get('shopping-carts-grouped-by-property')
  }
});

var groupCartsByProperty = function(ungroupedCarts) {
  var groupedCarts = {}

  _.each(ungroupedCarts, function(cart) {
    _.each(cart.lineItems(), function(line) {
      var storefrontId = line.storefrontIdAtCheckout
      if(groupedCarts[storefrontId]) {
        groupedCarts[storefrontId].lineItems.push(line)
      } else {
        // First item in cart for this property.
        // use this line's details as master reference
        groupedCarts[storefrontId] = {
          propertyName: line.storefrontNameAtCheckout,
          address: line.addressAtCheckout,
          address2: line.address2AtCheckout,
          lineItems: [line]
        }
      }

    })
  })

  // convert to array
  return _.map(groupedCarts, function(cart, propertyId) {
    return cart
  })
}

var cartsHasStorefrontId = function(storefrontId) {
  return _.find(carts, function(cart) {
    return cart["storefrontId"] === storefrontId
  })
}
