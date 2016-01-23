Meteor.startup(function() {
  Migrator.migrateMerchants(true)

  Seed.seedAdmins()
  if(Mart.Products.find().count() < 100) {
    Seed.seedIpsum()
  }
});
