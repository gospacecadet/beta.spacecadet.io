Meteor.startup(function(){
  var importDB = new MongoInternals.RemoteCollectionDriver(Meteor.settings.IMPORT_MONGO_DB_URL);

  _.extend(Migrator, {
    ImportedStations: new Mongo.Collection('stations', { _driver: importDB }),
    ImportedUsers: new Mongo.Collection('backupUsers', { _driver: importDB }),
    ImportedPads: new Mongo.Collection('pads', { _driver: importDB }),
  })
});
