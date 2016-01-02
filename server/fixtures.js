Meteor.startup(function(){
  Mart.Storefronts.remove({})
  Meteor.users.remove({})

  SpaceCadetMigration.migrateStations()
});
