
var resetDatabase = function () {
  // safety check
  if (!process.env.IS_MIRROR) {
    throw new Meteor.Error(
      'NOT_ALLOWED',
      'velocityReset is not allowed outside of a mirror. Something has gone wrong.'
    );
  }

  var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
  var collections = Meteor.wrapAsync(db.collections, db)();
  var appCollections = _.reject(collections, function (col) {
    return col.collectionName.indexOf('velocity') === 0 ||
      col.collectionName === 'system.indexes' ||
      col.collectionName === 'users';
  });

  _.each(appCollections, function (appCollection) {
    console.log('remove ' + appCollection.collectionName);
    Meteor.wrapAsync(appCollection.remove, appCollection)();
  });
};

var resetTestingEnvironment = function () {
  if (process.env.IS_MIRROR) {
    resetDatabase();
  } else {
    throw new Meteor.Error(
      'NOT_ALLOWED',
      'resetTestingEnvironment can only be executed in a Velocity mirror.'
    );
  }
};

var createShop = function () {
  var defaultShop = {
    name: "Test shop"
  }

  var shop = Shops.findOne(defaultShop)

  if (!shop) {
    var shopId = Shops.insert(defaultShop);
    shop = Shops.findOne(shopId)
  }

  return shop;
};

Meteor.methods({
  resetTestingEnvironment: resetTestingEnvironment,
  'fixtures/shops/create': createShop,
});
