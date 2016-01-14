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

var unitPrice = function(productId, unit) {
  var p = Mart.Prices.findOne({
    productId: productId,
    unit: unit
  })

  if(p)
    return p.priceInCents

  return 0
}
