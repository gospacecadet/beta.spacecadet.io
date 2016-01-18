(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Random = Package.random.Random;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var Mart = Package['marvin:mart'].Mart;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var Slingshot = Package['edgee:slingshot'].Slingshot;
var Roles = Package['alanning:roles'].Roles;
var Security = Package['ongoworks:security'].Security;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;

/* Package-scope variables */
var Migrator, storefront;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/migrations.beta.spacecadet.io/lib/spacecadet-migrator.js                                  //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
Migrator = {};                                                                                        // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/migrations.beta.spacecadet.io/lib/imported-collections.js                                 //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
Meteor.startup(function () {                                                                          // 1
  var importDB = new MongoInternals.RemoteCollectionDriver(Meteor.settings.IMPORT_MONGO_DB_URL);      // 2
                                                                                                      //
  _.extend(Migrator, {                                                                                // 4
    ImportedStations: new Mongo.Collection('stations', { _driver: importDB }),                        // 5
    ImportedUsers: new Mongo.Collection('backupUsers', { _driver: importDB }),                        // 6
    ImportedPads: new Mongo.Collection('pads', { _driver: importDB })                                 // 7
  });                                                                                                 //
});                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/migrations.beta.spacecadet.io/lib/migrations.beta.spacecadet.io.js                        //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var credentials;                                                                                      // 1
                                                                                                      //
_.extend(Migrator, {                                                                                  // 3
  migrate: function () {                                                                              // 4
    if (Mart.Storefronts.find().count() === 0) {                                                      // 5
      credentials = [];                                                                               // 6
                                                                                                      //
      // Migrate Users and Properties                                                                 //
      _.each(Migrator.ImportedStations.find().fetch(), function (station) {                           // 9
        var merchantId = createNewUser(station.userId, station.name);                                 // 10
        var propertyId = createStorefront(station);                                                   // 11
      });                                                                                             //
                                                                                                      //
      // Migrate Spaces                                                                               //
      _.each(Migrator.ImportedPads.find().fetch(), function (pad) {                                   // 15
        var spaceId = createProduct(pad);                                                             // 16
      });                                                                                             //
                                                                                                      //
      sendEmail();                                                                                    // 19
    }                                                                                                 //
  },                                                                                                  //
  forceMigrate: function () {                                                                         // 22
    Mart.Storefronts.remove({});                                                                      // 23
    Meteor.users.remove({});                                                                          // 24
    Mart.Images.remove({});                                                                           // 25
    Mart.Products.remove({});                                                                         // 26
    Mart.Prices.remove({});                                                                           // 27
                                                                                                      //
    this.migrate();                                                                                   // 29
  }                                                                                                   //
});                                                                                                   //
                                                                                                      //
var sendEmail = function () {                                                                         // 33
  var text = "_id,email,password,property name\n";                                                    // 34
                                                                                                      //
  _.each(credentials, function (cred) {                                                               // 36
    text = text + cred._id + "," + cred.email + "," + cred.password + "," + cred.propertyName + "\n";
  });                                                                                                 //
                                                                                                      //
  Email.send({                                                                                        // 44
    from: "SpaceCadet <do-not-reply@spacecadet.io>",                                                  // 45
    to: Meteor.settings.EMAIL_RECIPIENTS,                                                             // 46
    subject: "SpaceCadet Migration Complete",                                                         // 47
    text: text                                                                                        // 48
  });                                                                                                 //
};                                                                                                    //
                                                                                                      //
var createProduct = function (oldProduct) {                                                           // 52
  var newProduct = {                                                                                  // 53
    _id: oldProduct._id,                                                                              // 54
    name: oldProduct.name,                                                                            // 55
    description: oldProduct.description,                                                              // 56
    storefrontId: oldProduct.stationId,                                                               // 57
    isPublished: Meteor.settings.AUTO_PUBLISH === "true",                                             // 58
    isDeleted: false,                                                                                 // 59
    size: oldProduct.size,                                                                            // 60
    occupancy: oldProduct.occupancy                                                                   // 61
  };                                                                                                  //
                                                                                                      //
  var newProductId = Mart.Products.insert(newProduct, { getAutoValues: false, validate: false });     // 64
                                                                                                      //
  if (oldProduct.imagePath) {                                                                         // 66
    Mart.Images.insert({                                                                              // 67
      objectCollection: "Products",                                                                   // 68
      objectId: newProductId,                                                                         // 69
      index: 1,                                                                                       // 70
      originalUrl: oldProduct.imagePath,                                                              // 71
      optimizedUrl: oldProduct.imagePath,                                                             // 72
      thumbnailUrl: oldProduct.imagePath                                                              // 73
    }, { validate: false });                                                                          //
  }                                                                                                   //
                                                                                                      //
  return newProductId;                                                                                // 77
};                                                                                                    //
                                                                                                      //
var createNewUser = function (oldUserId, propertyName) {                                              // 80
  var newUser = Meteor.users.findOne(oldUserId);                                                      // 81
                                                                                                      //
  if (!newUser) {                                                                                     // 83
    var oldUser = Migrator.ImportedUsers.findOne(oldUserId);                                          // 84
    var cred = {                                                                                      // 85
      _id: oldUserId,                                                                                 // 86
      email: oldUser.emails[0].address,                                                               // 87
      password: Random.id()                                                                           // 88
    };                                                                                                //
                                                                                                      //
    var newUserId = Meteor.users.insert(cred);                                                        // 91
    cred.propertyName = propertyName;                                                                 // 92
                                                                                                      //
    Roles.addUsersToRoles(newUserId, [Mart.ROLES.GLOBAL.MERCHANT], Mart.ROLES.GROUPS.GLOBAL);         // 94
                                                                                                      //
    credentials.push(cred);                                                                           // 96
    return newUserId;                                                                                 // 97
  }                                                                                                   //
                                                                                                      //
  return newUser._id;                                                                                 // 100
};                                                                                                    //
                                                                                                      //
var createStorefront = function (station) {                                                           // 103
  storefront = {                                                                                      // 104
    _id: station._id,                                                                                 // 105
    isPublished: Meteor.settings.AUTO_PUBLISH === "true",                                             // 106
    isDeleted: false,                                                                                 // 107
    userId: station.userId,                                                                           // 108
    name: station.name,                                                                               // 109
    description: station.description,                                                                 // 110
    address: station.address,                                                                         // 111
    city: station.city,                                                                               // 112
    state: station.state,                                                                             // 113
    zip: station.zip,                                                                                 // 114
    createdAt: new Date()                                                                             // 115
  };                                                                                                  //
  var storefrontId = Mart.Storefronts.insert(storefront, { getAutoValues: false, validate: false });  // 117
                                                                                                      //
  var bannerPath = station.bannerPath;                                                                // 119
  var previewPath = station.previewPath || bannerPath;                                                // 120
  bannerPath = bannerPath || previewPath;                                                             // 121
                                                                                                      //
  if (bannerPath) {                                                                                   // 123
    Mart.Images.insert({                                                                              // 124
      objectCollection: "Storefronts",                                                                // 125
      objectId: storefrontId,                                                                         // 126
      index: 1,                                                                                       // 127
      originalUrl: bannerPath,                                                                        // 128
      optimizedUrl: bannerPath,                                                                       // 129
      thumbnailUrl: previewPath                                                                       // 130
    });                                                                                               //
  }                                                                                                   //
                                                                                                      //
  return storefrontId;                                                                                // 135
};                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['migrations.beta.spacecadet.io'] = {
  Migrator: Migrator
};

})();

//# sourceMappingURL=migrations.beta.spacecadet.io.js.map
