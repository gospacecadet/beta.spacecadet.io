Tinytest.add('Storefronts - migrate', function (test) {
  Mart.Storefronts.remove({})
  Meteor.users.remove({})

  SpaceCadetMigration.migrateStations()

  test.equal(Mart.Storefronts.find().count(), 4);
});
