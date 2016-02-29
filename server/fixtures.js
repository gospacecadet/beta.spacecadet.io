Meteor.startup(function() {
  Migrator.migrateMerchants(true)
  Seed.seedAdmins()

  if((Meteor.settings.AUTO_PUBLISH === "true") &&
    (Mart.Products.find().count() < 100)) {

    Seed.seedIpsum()
  }
});
