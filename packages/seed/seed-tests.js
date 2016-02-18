function reset() {
  Mart.Storefronts.remove({})
  Meteor.users.remove({})
  Mart.Images.remove({})
  Mart.Products.remove({})
  Mart.Prices.remove({})
}

Tinytest.add('Storefront w/ one item', function (test) {
  reset()

  var propertyId = Seed.property()
  var numPropertyImages = Seed.images("Storefronts", propertyId)

  var spaceId = Seed.space(propertyId)
  var numPrices = Seed.prices(spaceId)
  var numSpaceImages = Seed.images("Products", spaceId)

  test.equal(Mart.Storefronts.find().count(), 1);
  test.equal(Mart.Products.find().count(), 1);
  test.equal(Mart.Prices.find().count(), numPrices);
  test.equal(Mart.Images.find({objectCollection: "Storefronts"}).count(), numPropertyImages);
  test.equal(Mart.Images.find({objectCollection: "Products"}).count(), numSpaceImages);
  test.equal(Mart.Prices.find().count(), numPrices);
  test.isTrue(numPrices > 0)
  test.isTrue(numPrices < 4)
});

Tinytest.add('Seed', function (test) {
  reset()

  Seed.seed()

  test.equal(Mart.Storefronts.find().count(), 20);
  test.equal(Mart.Products.find().count(), 20 * 5);
});
