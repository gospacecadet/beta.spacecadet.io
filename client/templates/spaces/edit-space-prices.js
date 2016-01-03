Template.editSpacePrices.onCreated(function() {
  var productId = Template.currentData()._id

  Meteor.subscribe("mart/prices", productId);

  _.each(Mart.Product._UNITS(), function(unit) {
    var hooksObject = {
      after: {
        insert: function(error, result) {
          console.log('inserted');
        }
      },
      onError: function(operation, error) {
        if(error) {
          console.log(error);
          sAlert.error('Could not add price')
        }
      }
    };
    AutoForm.addHooks([formId(productId, unit)], hooksObject);
  })
})

Template.editSpacePrices.helpers({
  hourlyPrice: function() {
    return Mart.Prices.findOne({productId: this._id, unit: Mart.Product.UNITS.HOUR})
  },
  dailyPrice: function() {
    return Mart.Prices.findOne({productId: this._id, unit: Mart.Product.UNITS.DAY})
  },
  monthlyPrice: function() {
    return Mart.Prices.findOne({productId: this._id, unit: Mart.Product.UNITS.MONTH})
  }
});

Template.newPrice.helpers({
  id: function() {
    return formId(this.productId, this.unit)
  }
});

var formId = function(productId, unit) {
  return "insertPrice-" + productId + "-" + unit
}
