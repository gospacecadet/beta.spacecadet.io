// Write your tests here!
// Here is an example.
Tinytest.add('example', function (test) {
  Mart.Storefronts.remove({})
  Meteor.users.remove({})
  Mart.Images.remove({})
  Mart.Products.remove({})
  Mart.Prices.remove({})

  Seed.storefronts()
  test.equal(Mart.Storefronts.find().count(), 1);
});
