Tinytest.add('MIGRATE ALL', function (test) {
  Mart.Storefronts.remove({})
  Meteor.users.remove({})
  Mart.Images.remove({})
  Mart.Products.remove({})
  Migrator._resetMigrationLog()

  Migrator.migrateMerchants(false)

  // All Properties have been created
  test.equal(Mart.Storefronts.find().count(), 25, "wrong number of properties created");
  test.equal(Mart.Images.find({objectCollection: "Storefronts"}).count(), 25, "wrong number of property images created");

  // All Spaces have been created
  test.equal(Mart.Products.find().count(), 69, "wrong number of spaces created");
  test.equal(Mart.Images.find({objectCollection: "Products"}).count(), 69, "wrong number of space images created");

  // All Users have been created
  test.isTrue(Meteor.users.find().count() > 0);
});
