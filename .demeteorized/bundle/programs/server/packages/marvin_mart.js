(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var Random = Package.random.Random;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var _ = Package.underscore._;
var STRIPEMETEOR = Package['mrgalaxy:stripe'].STRIPEMETEOR;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Security = Package['ongoworks:security'].Security;
var moment = Package['momentjs:moment'].moment;
var Roles = Package['alanning:roles'].Roles;
var machina = Package['marvin:machina'].machina;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Mart, accountAttrs, storefront, Cart, canOpCartWaitingCartAcceptance, canOpCartShopping, getFirstStorefront, cardId;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/mart.js                                                                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart = {                                                                                                             // 1
  SERVICE_FEE_PCT: parseFloat(Meteor.settings["public"].SERVICE_FEE_PCT),                                            // 2
  HOUR_CONNECTION_FEE_PCT: parseFloat(Meteor.settings["public"].HOUR_CONNECTION_FEE_PCT),                            // 3
  DAY_CONNECTION_FEE_PCT: parseFloat(Meteor.settings["public"].DAY_CONNECTION_FEE_PCT),                              // 4
  MONTH_CONNECTION_FEE_PCT: parseFloat(Meteor.settings["public"].MONTH_CONNECTION_FEE_PCT),                          // 5
  TAX_PCT: parseFloat(Meteor.settings["public"].TAX_PCT),                                                            // 6
  STRIPE_PUBLIC_KEY: Meteor.settings["public"].STRIPE_PUBLIC_KEY                                                     // 7
};                                                                                                                   //
                                                                                                                     //
if (Meteor.isServer) {                                                                                               // 10
  _.extend(Mart, {                                                                                                   // 11
    STRIPE_SECRET_KEY: Meteor.settings.STRIPE_SECRET_KEY                                                             // 12
  });                                                                                                                //
}                                                                                                                    //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/errors.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.Errors = {                                                                                                      // 1
  UNAUTHORIZED: "mart-unauthorized",                                                                                 // 2
  CANNOT_PUBLISH: "mart-cannot-publish"                                                                              // 3
};                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/accounts/accounts.js                                                                     //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
_.extend(Mart, {                                                                                                     // 1
  ROLES: {                                                                                                           // 2
    GLOBAL: {                                                                                                        // 3
      SHOPPER: 'mart-roles-golbal-shopper',                                                                          // 4
      MERCHANT: 'mart-roles-golbal-merchant',                                                                        // 5
      ADMIN: 'mart-roles-global-admin',                                                                              // 6
      REP: 'mart-roles-global-rep'                                                                                   // 7
    },                                                                                                               //
    GROUPS: {                                                                                                        // 9
      GLOBAL: 'mart-roles-groups-global'                                                                             // 10
    }                                                                                                                //
  },                                                                                                                 //
  isAdmin: function () {                                                                                             // 13
    return this._isAdmin(Meteor.userId());                                                                           // 14
  },                                                                                                                 //
  isRep: function () {                                                                                               // 16
    return this._isRep(Meteor.userId());                                                                             // 17
  },                                                                                                                 //
  isMerchant: function () {                                                                                          // 19
    return this._isMerchant(Meteor.userId());                                                                        // 20
  },                                                                                                                 //
  canActAsMerchant: function () {                                                                                    // 22
    return this.isMerchant() || this.isRep() || this.isAdmin();                                                      // 23
  },                                                                                                                 //
  _isAdmin: function (userId) {                                                                                      // 25
    return Roles.userIsInRole(userId, [Mart.ROLES.GLOBAL.ADMIN], Mart.ROLES.GROUPS.GLOBAL);                          // 26
  },                                                                                                                 //
  _isRep: function (userId) {                                                                                        // 30
    return Roles.userIsInRole(userId, [Mart.ROLES.GLOBAL.REP], Mart.ROLES.GROUPS.GLOBAL);                            // 31
  },                                                                                                                 //
  _isMerchant: function (userId) {                                                                                   // 35
    return Roles.userIsInRole(userId, [Mart.ROLES.GLOBAL.MERCHANT], Mart.ROLES.GROUPS.GLOBAL);                       // 36
  },                                                                                                                 //
  _isShopper: function (userId) {                                                                                    // 40
    return Roles.userIsInRole(userId, [Mart.ROLES.GLOBAL.SHOPPER], Mart.ROLES.GROUPS.GLOBAL);                        // 41
  },                                                                                                                 //
  Accounts: {                                                                                                        // 45
    // traditional options, roles: [ROLE]                                                                            //
    createUser: function (options, callback) {                                                                       // 47
      if (!Meteor.userId()) {                                                                                        // 48
        Accounts.createUser(options, function (error) {                                                              // 49
          if (error) return callback(error);                                                                         // 50
                                                                                                                     //
          Meteor.call("mart/add-roles-and-terms", options.roles, callback);                                          // 53
        });                                                                                                          //
      } else {                                                                                                       //
        callback(new Meteor.Error('signup-error', "You must log out before creating another account."));             // 56
      }                                                                                                              //
    },                                                                                                               //
    SignInSchema: new SimpleSchema({                                                                                 // 59
      email: {                                                                                                       // 60
        type: String                                                                                                 // 61
      },                                                                                                             //
      password: {                                                                                                    // 63
        type: String                                                                                                 // 64
      },                                                                                                             //
      termsAccepted: {                                                                                               // 66
        type: Boolean                                                                                                // 67
      }                                                                                                              //
    })                                                                                                               //
                                                                                                                     //
  }                                                                                                                  //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/security-helpers.js                                                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Security.defineMethod('ifRoles', {                                                                                   // 1
  fetch: [],                                                                                                         // 2
  deny: function (type, roles, userId, doc) {                                                                        // 3
    return !userId || !Roles.userIsInRole(userId, roles, Mart.ROLES.GROUPS.GLOBAL);                                  // 4
  }                                                                                                                  //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/storefronts/storefronts.js                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.Storefronts = new Mongo.Collection("MartStorefronts", {                                                         // 1
  transform: function (doc) {                                                                                        // 2
    return new Storefront(doc);                                                                                      // 2
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
var Storefront = function (doc) {                                                                                    // 5
  _.extend(this, doc);                                                                                               // 6
};                                                                                                                   //
                                                                                                                     //
_.extend(Storefront.prototype, {                                                                                     // 9
  products: function () {                                                                                            // 10
    return Mart.Products.find({ storefrontId: this._id });                                                           // 11
  }                                                                                                                  //
});                                                                                                                  //
Mart.Storefronts.attachSchema(new SimpleSchema({                                                                     // 14
  name: {                                                                                                            // 15
    type: String,                                                                                                    // 16
    label: "Name",                                                                                                   // 17
    max: 50                                                                                                          // 18
  },                                                                                                                 //
  description: {                                                                                                     // 20
    type: String,                                                                                                    // 21
    label: "Description",                                                                                            // 22
    optional: true,                                                                                                  // 23
    max: 1000                                                                                                        // 24
  },                                                                                                                 //
  isPublished: {                                                                                                     // 26
    type: Boolean,                                                                                                   // 27
    label: "Ready to be published?",                                                                                 // 28
    autoValue: function () {                                                                                         // 29
      // Should only be able to publish from server if several conditions are met                                    //
      this.unset();                                                                                                  // 31
      if (this.isInsert) {                                                                                           // 32
        return false;                                                                                                // 33
      }                                                                                                              //
    }                                                                                                                //
  },                                                                                                                 //
  isDeleted: {                                                                                                       // 37
    type: Boolean,                                                                                                   // 38
    autoValue: function () {                                                                                         // 39
      // Should only be able to publish from server if several conditions are met                                    //
      this.unset();                                                                                                  // 41
      if (this.isInsert) {                                                                                           // 42
        return false;                                                                                                // 43
      }                                                                                                              //
    }                                                                                                                //
  },                                                                                                                 //
  userId: {                                                                                                          // 47
    type: String,                                                                                                    // 48
    // Reps and Admins can create Storefronts on behalf of Merchants                                                 //
    // Don't allow reassignment for security                                                                         //
    autoValue: function () {                                                                                         // 51
      if (this.isInsert) {                                                                                           // 52
        if (Roles.userIsInRole(this.userId, [Mart.ROLES.GLOBAL.REP, Mart.ROLES.GLOBAL.ADMIN], Mart.ROLES.GROUPS.GLOBAL)) {
          return;                                                                                                    // 57
        } else if (Mart._isMerchant(this.userId)) {                                                                  //
          return this.userId;                                                                                        // 59
        }                                                                                                            //
      }                                                                                                              //
      this.unset();                                                                                                  // 62
    },                                                                                                               //
    denyUpdate: true                                                                                                 // 64
  },                                                                                                                 //
  repId: {                                                                                                           // 66
    type: String,                                                                                                    // 67
    optional: true,                                                                                                  // 68
    autoValue: function () {                                                                                         // 69
      if (this.isInsert && Roles.userIsInRole(this.userId, [Mart.ROLES.GLOBAL.REP], Mart.ROLES.GROUPS.GLOBAL)) {     // 70
        return this.userId;                                                                                          // 74
      } else if (Roles.userIsInRole(this.userId, [Mart.ROLES.GLOBAL.ADMIN], Mart.ROLES.GROUPS.GLOBAL)) {             //
        return this.value || this.userId;                                                                            // 79
      }                                                                                                              //
                                                                                                                     //
      this.unset();                                                                                                  // 82
    }                                                                                                                //
  },                                                                                                                 //
  address: {                                                                                                         // 85
    type: String                                                                                                     // 86
  },                                                                                                                 //
  address2: {                                                                                                        // 88
    type: String,                                                                                                    // 89
    optional: true                                                                                                   // 90
  },                                                                                                                 //
  city: {                                                                                                            // 92
    type: String                                                                                                     // 93
  },                                                                                                                 //
  state: {                                                                                                           // 95
    type: String                                                                                                     // 96
  },                                                                                                                 //
  zip: {                                                                                                             // 98
    type: String                                                                                                     // 99
  },                                                                                                                 //
  createdAt: {                                                                                                       // 101
    type: Date,                                                                                                      // 102
    autoValue: function () {                                                                                         // 103
      if (this.isInsert) {                                                                                           // 104
        return new Date();                                                                                           // 105
      }                                                                                                              //
                                                                                                                     //
      this.unset();                                                                                                  // 108
    }                                                                                                                //
  }                                                                                                                  //
}));                                                                                                                 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/images/images.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.Images = new Mongo.Collection("MartImages");                                                                    // 1
                                                                                                                     //
Mart.Images.attachSchema(new SimpleSchema({                                                                          // 3
  objectId: {                                                                                                        // 4
    type: String,                                                                                                    // 5
    denyUpdate: true                                                                                                 // 6
  },                                                                                                                 //
  objectCollection: {                                                                                                // 8
    type: String,                                                                                                    // 9
    denyUpdate: true,                                                                                                // 10
    allowedValues: ['Storefronts', 'Products']                                                                       // 11
  },                                                                                                                 //
  originalUrl: {                                                                                                     // 13
    type: String,                                                                                                    // 14
    denyUpdate: true                                                                                                 // 15
  },                                                                                                                 //
  thumbnailUrl: {                                                                                                    // 17
    type: String,                                                                                                    // 18
    denyUpdate: true                                                                                                 // 19
  },                                                                                                                 //
  optimizedUrl: {                                                                                                    // 21
    type: String,                                                                                                    // 22
    denyUpdate: true                                                                                                 // 23
  },                                                                                                                 //
  index: {                                                                                                           // 25
    type: Number                                                                                                     // 26
  }                                                                                                                  //
}));                                                                                                                 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/gateways/gateways.js                                                                     //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.Gateways = new Mongo.Collection("MartGateways");                                                                // 1
Mart.GatewayTypes = {};                                                                                              // 2
                                                                                                                     //
Mart.Gateways.attachSchema(new SimpleSchema({                                                                        // 4
  gatewayType: {                                                                                                     // 5
    type: String,                                                                                                    // 6
    allowedValues: ['Test', 'Stripe']                                                                                // 7
  },                                                                                                                 //
  businessName: {                                                                                                    // 9
    type: String                                                                                                     // 10
  },                                                                                                                 //
  businessURL: {                                                                                                     // 12
    type: String                                                                                                     // 13
  },                                                                                                                 //
  detailsSubmitted: {                                                                                                // 15
    type: Boolean                                                                                                    // 16
  },                                                                                                                 //
  chargesEnabled: {                                                                                                  // 18
    type: Boolean                                                                                                    // 19
  },                                                                                                                 //
  transfersEnabled: {                                                                                                // 21
    type: Boolean                                                                                                    // 22
  }                                                                                                                  //
}));                                                                                                                 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/payment_methods/cards/cards.js                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.Cards = new Mongo.Collection("MartCards");                                                                      // 1
Mart.Card = {                                                                                                        // 2
  card: function (cardId) {                                                                                          // 3
    return Mart.Cards.findOne(cardId);                                                                               // 4
  },                                                                                                                 //
  gateway: function (cardId) {                                                                                       // 6
    return Mart.Gateways.findOne(this.card(cardId).gatewayId);                                                       // 7
  }                                                                                                                  //
};                                                                                                                   //
                                                                                                                     //
Mart.Cards.attachSchema(new SimpleSchema({                                                                           // 11
  userId: {                                                                                                          // 12
    type: String,                                                                                                    // 13
    autoValue: function () {                                                                                         // 14
      return this.userId;                                                                                            // 15
    },                                                                                                               //
    denyUpdate: true,                                                                                                // 17
    optional: true                                                                                                   // 18
  },                                                                                                                 //
  guestId: {                                                                                                         // 20
    type: String,                                                                                                    // 21
    denyUpdate: true,                                                                                                // 22
    optional: true                                                                                                   // 23
  },                                                                                                                 //
  gateway: {                                                                                                         // 25
    type: String,                                                                                                    // 26
    denyUpdate: true,                                                                                                // 27
    allowedValues: ['Test', 'Stripe']                                                                                // 28
  },                                                                                                                 //
  gatewayToken: {                                                                                                    // 30
    type: String,                                                                                                    // 31
    denyUpdate: true                                                                                                 // 32
  },                                                                                                                 //
  last4: {                                                                                                           // 34
    type: Number,                                                                                                    // 35
    min: 1000,                                                                                                       // 36
    max: 9999,                                                                                                       // 37
    denyUpdate: true                                                                                                 // 38
  },                                                                                                                 //
  expMonth: {                                                                                                        // 40
    type: Number,                                                                                                    // 41
    min: 0,                                                                                                          // 42
    max: 12,                                                                                                         // 43
    denyUpdate: true                                                                                                 // 44
  },                                                                                                                 //
  expYear: {                                                                                                         // 46
    type: Number,                                                                                                    // 47
    min: new Date().getFullYear(),                                                                                   // 48
    max: new Date().getFullYear() + 100,                                                                             // 49
    denyUpdate: true                                                                                                 // 50
  },                                                                                                                 //
  nameOnCard: {                                                                                                      // 52
    type: String,                                                                                                    // 53
    denyUpdate: true,                                                                                                // 54
    max: 100                                                                                                         // 55
  },                                                                                                                 //
  brand: {                                                                                                           // 57
    type: String,                                                                                                    // 58
    denyUpdate: true,                                                                                                // 59
    allowedValues: ['Visa', 'Mastercard']                                                                            // 60
  }                                                                                                                  //
}));                                                                                                                 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/gateways/stripe/stripe.js                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.GatewayTypes.Stripe = {                                                                                         // 1
  getSecretKey: function (options) {                                                                                 // 2
    return options.secretKey || Mart.STRIPE_SECRET_KEY;                                                              // 3
  },                                                                                                                 //
  getPublicKey: function (options) {                                                                                 // 5
    return options.publicKey || Mart.STRIPE_PUBLIC_KEY.StripePublicKey;                                              // 6
  }                                                                                                                  //
};                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/gateways/test/test.js                                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.GatewayTypes.Test = {                                                                                           // 1
  retrieveAccountInfo: function (options) {                                                                          // 2
    accountAttrs = {                                                                                                 // 3
      gatewayType: "Test",                                                                                           // 4
      businessName: "Test Gateway Business Name",                                                                    // 5
      businessURL: "example.com",                                                                                    // 6
      detailsSubmitted: false,                                                                                       // 7
      chargesEnabled: false,                                                                                         // 8
      transfersEnabled: false                                                                                        // 9
    };                                                                                                               //
                                                                                                                     //
    Mart.Gateways.upsert({}, { $set: accountAttrs });                                                                // 12
    return Mart.Gateways.findOne()._id;                                                                              // 13
  }                                                                                                                  //
};                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/products/products.js                                                                     //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.Products = new Mongo.Collection("MartProducts");                                                                // 1
                                                                                                                     //
Mart.Products.attachSchema(new SimpleSchema({                                                                        // 3
  storefrontId: {                                                                                                    // 4
    type: String                                                                                                     // 5
  },                                                                                                                 //
  name: {                                                                                                            // 7
    type: String,                                                                                                    // 8
    label: "Name",                                                                                                   // 9
    max: 50                                                                                                          // 10
  },                                                                                                                 //
  description: {                                                                                                     // 12
    type: String,                                                                                                    // 13
    label: "Description",                                                                                            // 14
    optional: true,                                                                                                  // 15
    max: 1000                                                                                                        // 16
  },                                                                                                                 //
  isPublished: {                                                                                                     // 18
    type: Boolean,                                                                                                   // 19
    label: "Ready to be published?",                                                                                 // 20
    autoValue: function () {                                                                                         // 21
      // Should only be able to publish from server if several conditions are met                                    //
      this.unset();                                                                                                  // 23
      if (this.isInsert) {                                                                                           // 24
        return false;                                                                                                // 25
      }                                                                                                              //
    }                                                                                                                //
  },                                                                                                                 //
  isDeleted: {                                                                                                       // 29
    type: Boolean,                                                                                                   // 30
    autoValue: function () {                                                                                         // 31
      // Should only be able to publish from server if several conditions are met                                    //
      this.unset();                                                                                                  // 33
      if (this.isInsert) {                                                                                           // 34
        return false;                                                                                                // 35
      }                                                                                                              //
    }                                                                                                                //
  },                                                                                                                 //
  createdAt: {                                                                                                       // 39
    type: Date,                                                                                                      // 40
    autoValue: function () {                                                                                         // 41
      if (this.isInsert) {                                                                                           // 42
        return new Date();                                                                                           // 43
      }                                                                                                              //
                                                                                                                     //
      this.unset();                                                                                                  // 46
    }                                                                                                                //
  },                                                                                                                 //
  occupancy: {                                                                                                       // 49
    type: Number,                                                                                                    // 50
    optional: true                                                                                                   // 51
  },                                                                                                                 //
  size: {                                                                                                            // 53
    type: String,                                                                                                    // 54
    optional: true                                                                                                   // 55
  }                                                                                                                  //
}));                                                                                                                 //
                                                                                                                     //
Mart.Product = {                                                                                                     // 59
  UNITS: {                                                                                                           // 60
    HOUR: "hour",                                                                                                    // 61
    DAY: "day",                                                                                                      // 62
    MONTH: "month"                                                                                                   // 63
  },                                                                                                                 //
  _UNITS: function () {                                                                                              // 65
    return _.keys(_.invert(this.UNITS));                                                                             // 66
  }                                                                                                                  //
};                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/prices/prices.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.Prices = new Mongo.Collection("MartPrices");                                                                    // 1
                                                                                                                     //
Mart.Prices.attachSchema(new SimpleSchema({                                                                          // 3
  productId: {                                                                                                       // 4
    type: String                                                                                                     // 5
  },                                                                                                                 //
  unit: {                                                                                                            // 7
    type: String,                                                                                                    // 8
    allowedValues: Mart.Product._UNITS()                                                                             // 9
  },                                                                                                                 //
  priceInCents: {                                                                                                    // 11
    type: Number                                                                                                     // 12
  }                                                                                                                  //
}));                                                                                                                 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/line_items/line_items.js                                                                 //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.LineItems = new Mongo.Collection("MartLineItems", {                                                             // 1
  transform: function (doc) {                                                                                        // 2
    return new LineItem(doc);                                                                                        // 2
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
var LineItem = function (doc) {                                                                                      // 5
  _.extend(this, doc);                                                                                               // 6
};                                                                                                                   //
                                                                                                                     //
_.extend(LineItem.prototype, {                                                                                       // 9
  subtotal: function () {                                                                                            // 10
    return this.quantity * this.unitPriceAtCheckout;                                                                 // 11
  },                                                                                                                 //
  connectionFee: function () {                                                                                       // 13
    var connectionFeePct;                                                                                            // 14
    if (this._.unit === Mart.Product.UNITS.HOUR) {                                                                   // 15
      connectionFeePct = Mart.HOUR_CONNECTION_FEE_PCT;                                                               // 16
    } else if (this._.unit === Mart.Product.UNITS.DAY) {                                                             //
      connectionFeePct = Mart.DAY_CONNECTION_FEE_PCT;                                                                // 18
    } else if (this._.unit === Mart.Product.UNITS.MONTH) {                                                           //
      connectionFeePct = Mart.MONTH_CONNECTION_FEE_PCT;                                                              // 20
    } else {                                                                                                         //
      throw new Meteor.error('invalid-unit', "Invalid unit selected");                                               // 22
    }                                                                                                                //
    return this.subtotal() * connectionFeePct;                                                                       // 24
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Mart.LineItems.after.remove(function (userId, doc) {                                                                 // 28
  var cart = Mart.Carts.findOne({ _id: doc.cartId, state: Mart.Cart.STATES.SHOPPING });                              // 29
  if (cart && cart.lineItems().length === 0) Mart.Carts.remove(cart._id);                                            // 30
});                                                                                                                  //
                                                                                                                     //
Mart.LineItem = {                                                                                                    // 34
  lineItem: function (lineItemId) {                                                                                  // 35
    return Mart.LineItems.findOne(lineItemId);                                                                       // 36
  },                                                                                                                 //
  remove: function (lineItemId) {                                                                                    // 38
    return Mart.LineItems.remove(lineItemId);                                                                        // 39
  }                                                                                                                  //
};                                                                                                                   //
                                                                                                                     //
Mart.LineItems.attachSchema(new SimpleSchema({                                                                       // 43
  cartId: {                                                                                                          // 44
    type: String,                                                                                                    // 45
    denyUpdate: true,                                                                                                // 46
    autoValue: function () {                                                                                         // 47
      if (Meteor.isServer) {                                                                                         // 48
        var productId = this.field("productId").value;                                                               // 49
        var product = Mart.Products.findOne(productId);                                                              // 50
        var storefront = Mart.Storefronts.findOne(product.storefrontId);                                             // 51
        // If user logged in, find or create cart for this shopper and                                               //
        // the merchant the product belongs to                                                                       //
        if (!!this.userId) {                                                                                         // 54
          var cart = Mart.Carts.findOne({                                                                            // 55
            storefrontId: storefront._id,                                                                            // 56
            state: Mart.Cart.STATES.SHOPPING,                                                                        // 57
            userId: this.userId                                                                                      // 58
          });                                                                                                        //
                                                                                                                     //
          if (cart) return cart._id;                                                                                 // 61
                                                                                                                     //
          var cartId = Mart.Carts.insert({                                                                           // 64
            storefrontId: storefront._id,                                                                            // 65
            merchantId: storefront.userId,                                                                           // 66
            state: Mart.Cart.STATES.SHOPPING,                                                                        // 67
            userId: this.userId                                                                                      // 68
          });                                                                                                        //
                                                                                                                     //
          return cartId;                                                                                             // 71
        } else {                                                                                                     //
          var guestId = this.field("guestId").value;                                                                 // 73
          // Find or create cart for guest                                                                           //
          if (!!guestId) {                                                                                           // 75
            var cart = Mart.Carts.upsert({                                                                           // 76
              storefrontId: storefrontId,                                                                            // 77
              state: Mart.Cart.STATES.SHOPPING,                                                                      // 78
              guestId: guestId                                                                                       // 79
            }, { $set: {                                                                                             //
                storefrontId: storefront._id,                                                                        // 81
                merchantId: storefront.userId,                                                                       // 82
                state: Mart.Cart.STATES.SHOPPING,                                                                    // 83
                guestId: guestId                                                                                     // 84
              } });                                                                                                  //
            return cart.insertedId;                                                                                  // 86
          } else {                                                                                                   //
            // No user or guest to associate to                                                                      //
            return undefined;                                                                                        // 89
          }                                                                                                          //
        }                                                                                                            //
      }                                                                                                              //
    }                                                                                                                //
  },                                                                                                                 //
  guestId: {                                                                                                         // 95
    type: String,                                                                                                    // 96
    optional: true                                                                                                   // 97
  },                                                                                                                 //
  productId: {                                                                                                       // 99
    type: String,                                                                                                    // 100
    denyUpdate: true                                                                                                 // 101
  },                                                                                                                 //
  unit: {                                                                                                            // 103
    type: String,                                                                                                    // 104
    allowedValues: Mart.Product._UNITS()                                                                             // 105
  },                                                                                                                 //
  quantity: {                                                                                                        // 107
    type: Number                                                                                                     // 108
  },                                                                                                                 //
  startAtDate: {                                                                                                     // 110
    type: Date                                                                                                       // 111
  },                                                                                                                 //
  startAtHour: {                                                                                                     // 113
    type: Number                                                                                                     // 114
  },                                                                                                                 //
  startAtMinute: {                                                                                                   // 116
    type: Number                                                                                                     // 117
  },                                                                                                                 //
  productNameAtCheckout: {                                                                                           // 119
    type: String,                                                                                                    // 120
    autoValue: function () {                                                                                         // 121
                                                                                                                     //
      if (this.isInsert) {                                                                                           // 123
        if (Meteor.isServer) {                                                                                       // 124
          var productId = this.field("productId").value;                                                             // 125
          var product = Mart.Products.findOne(productId);                                                            // 126
          return product.name;                                                                                       // 127
        }                                                                                                            //
        return "Loading...";                                                                                         // 129
      }                                                                                                              //
                                                                                                                     //
      this.unset();                                                                                                  // 132
    },                                                                                                               //
    denyUpdate: true                                                                                                 // 134
  },                                                                                                                 //
  storefrontIdAtCheckout: {                                                                                          // 136
    type: String,                                                                                                    // 137
    autoValue: function () {                                                                                         // 138
      if (this.isInsert) {                                                                                           // 139
        if (Meteor.isServer) {                                                                                       // 140
          // In case not subscribed to product on client side                                                        //
          var productId = this.field("productId").value;                                                             // 141
          return storefrontVal(productId, "_id");                                                                    // 142
        }                                                                                                            //
        return "Loading...";                                                                                         // 144
      }                                                                                                              //
      this.unset();                                                                                                  // 146
    }                                                                                                                //
  },                                                                                                                 //
  storefrontNameAtCheckout: {                                                                                        // 149
    type: String,                                                                                                    // 150
    autoValue: function () {                                                                                         // 151
      if (this.isInsert) {                                                                                           // 152
        if (Meteor.isServer) {                                                                                       // 153
          // In case not subscribed to product on client side                                                        //
          var productId = this.field("productId").value;                                                             // 154
          return storefrontVal(productId, "name");                                                                   // 155
        }                                                                                                            //
        return "Loading...";                                                                                         // 157
      }                                                                                                              //
      this.unset();                                                                                                  // 159
    }                                                                                                                //
  },                                                                                                                 //
  addressAtCheckout: {                                                                                               // 162
    type: String,                                                                                                    // 163
    autoValue: function () {                                                                                         // 164
      if (this.isInsert) {                                                                                           // 165
        if (Meteor.isServer) {                                                                                       // 166
          // In case not subscribed to product on client side                                                        //
          var productId = this.field("productId").value;                                                             // 167
          return storefrontVal(productId, "address");                                                                // 168
        }                                                                                                            //
        return "Loading...";                                                                                         // 170
      }                                                                                                              //
      this.unset();                                                                                                  // 172
    }                                                                                                                //
  },                                                                                                                 //
  address2AtCheckout: {                                                                                              // 175
    type: String,                                                                                                    // 176
    autoValue: function () {                                                                                         // 177
      if (this.isInsert) {                                                                                           // 178
        if (Meteor.isServer) {                                                                                       // 179
          // In case not subscribed to product on client side                                                        //
          var productId = this.field("productId").value;                                                             // 180
          return storefrontVal(productId, "address2");                                                               // 181
        }                                                                                                            //
      }                                                                                                              //
      this.unset();                                                                                                  // 184
    },                                                                                                               //
    optional: true                                                                                                   // 186
  },                                                                                                                 //
  cityAtCheckout: {                                                                                                  // 188
    type: String,                                                                                                    // 189
    autoValue: function () {                                                                                         // 190
      if (this.isInsert) {                                                                                           // 191
        if (Meteor.isServer) {                                                                                       // 192
          // In case not subscribed to product on client side                                                        //
          var productId = this.field("productId").value;                                                             // 193
          return storefrontVal(productId, "city");                                                                   // 194
        }                                                                                                            //
        return "Loading...";                                                                                         // 196
      }                                                                                                              //
      this.unset();                                                                                                  // 198
    }                                                                                                                //
  },                                                                                                                 //
  stateAtCheckout: {                                                                                                 // 201
    type: String,                                                                                                    // 202
    autoValue: function () {                                                                                         // 203
      if (this.isInsert) {                                                                                           // 204
        if (Meteor.isServer) {                                                                                       // 205
          // In case not subscribed to product on client side                                                        //
          var productId = this.field("productId").value;                                                             // 206
          return storefrontVal(productId, "state");                                                                  // 207
        }                                                                                                            //
        return "Loading...";                                                                                         // 209
      }                                                                                                              //
      this.unset();                                                                                                  // 211
    }                                                                                                                //
  },                                                                                                                 //
  zipAtCheckout: {                                                                                                   // 214
    type: String,                                                                                                    // 215
    autoValue: function () {                                                                                         // 216
      if (this.isInsert) {                                                                                           // 217
        if (Meteor.isServer) {                                                                                       // 218
          // In case not subscribed to product on client side                                                        //
          var productId = this.field("productId").value;                                                             // 219
          return storefrontVal(productId, "zip");                                                                    // 220
        }                                                                                                            //
        return "Loading...";                                                                                         // 222
      }                                                                                                              //
      this.unset();                                                                                                  // 224
    }                                                                                                                //
  },                                                                                                                 //
  unitPriceAtCheckout: {                                                                                             // 227
    type: Number,                                                                                                    // 228
    autoValue: function () {                                                                                         // 229
      if (this.isInsert) {                                                                                           // 230
        if (Meteor.isServer) {                                                                                       // 231
          // In case not subscribed to product on client side                                                        //
          var productId = this.field("productId").value;                                                             // 232
          var unit = this.field("unit").value;                                                                       // 233
                                                                                                                     //
          var price = Mart.Prices.findOne({ productId: productId, unit: unit });                                     // 235
                                                                                                                     //
          return price.priceInCents;                                                                                 // 237
        }                                                                                                            //
        return 0;                                                                                                    // 239
      }                                                                                                              //
      this.unset();                                                                                                  // 241
    }                                                                                                                //
  },                                                                                                                 //
  // denyUpdate: true                                                                                                //
  createdAt: {                                                                                                       // 245
    type: Date,                                                                                                      // 246
    autoValue: function () {                                                                                         // 247
      if (this.isInsert) {                                                                                           // 248
        return new Date();                                                                                           // 249
      }                                                                                                              //
      this.unset();                                                                                                  // 251
    },                                                                                                               //
    denyUpdate: true                                                                                                 // 253
  }                                                                                                                  //
}));                                                                                                                 //
                                                                                                                     //
var storefrontVal = function (productId, attrName) {                                                                 // 257
  var product = Mart.Products.findOne(productId);                                                                    // 258
                                                                                                                     //
  if (product) {                                                                                                     // 260
    storefront = Mart.Storefronts.findOne(product.storefrontId);                                                     // 261
    return storefront[attrName];                                                                                     // 262
  }                                                                                                                  //
};                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/bank-accounts/bank-accounts.js                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.BankAccounts = new Mongo.Collection("MartBankAccounts");                                                        // 1
                                                                                                                     //
// only admins + merchants can see accoutns - publications                                                           //
// needs a method to add account with a                                                                              //
// allow update of name and isDefault - secutiry                                                                     //
                                                                                                                     //
Mart.BankAccounts.attachSchema(new SimpleSchema({                                                                    // 7
  userId: {                                                                                                          // 8
    type: String,                                                                                                    // 9
    denyUpdate: true,                                                                                                // 10
    autoValue: function () {                                                                                         // 11
      return Meteor.userId();                                                                                        // 12
    }                                                                                                                //
  },                                                                                                                 //
  name: {                                                                                                            // 15
    type: String                                                                                                     // 16
  },                                                                                                                 //
  bankName: {                                                                                                        // 18
    type: String,                                                                                                    // 19
    denyUpdate: true                                                                                                 // 20
  },                                                                                                                 //
  last4: {                                                                                                           // 22
    type: String,                                                                                                    // 23
    denyUpdate: true                                                                                                 // 24
  },                                                                                                                 //
  routingNumber: {                                                                                                   // 26
    type: String,                                                                                                    // 27
    denyUpdate: true                                                                                                 // 28
  },                                                                                                                 //
  isDefault: {                                                                                                       // 30
    type: Boolean                                                                                                    // 31
  },                                                                                                                 //
  gateway: {                                                                                                         // 33
    type: String                                                                                                     // 34
  },                                                                                                                 //
  gatewayToken: {                                                                                                    // 36
    type: String                                                                                                     // 37
  },                                                                                                                 //
  country: {                                                                                                         // 39
    type: String                                                                                                     // 40
  },                                                                                                                 //
  currency: {                                                                                                        // 42
    type: String                                                                                                     // 43
  }                                                                                                                  //
}));                                                                                                                 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/carts/carts.js                                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.Carts = new Mongo.Collection("MartCarts", {                                                                     // 1
  transform: function (doc) {                                                                                        // 2
    return new Cart(doc);                                                                                            // 2
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Cart = function (doc) {                                                                                              // 5
  _.extend(this, doc);                                                                                               // 6
};                                                                                                                   //
                                                                                                                     //
_.extend(Cart.prototype, {                                                                                           // 9
  subtotal: function () {                                                                                            // 10
    var lines = Mart.LineItems.find({ cartId: this._id }).fetch();                                                   // 11
    return _.reduce(lines, function (sum, line) {                                                                    // 12
      return sum + line.subtotal();                                                                                  // 13
    }, 0);                                                                                                           //
  },                                                                                                                 //
  connectionFee: function () {                                                                                       // 16
    var lines = Mart.LineItems.find({ cartId: this._id }).fetch();                                                   // 17
    return Math.floor(_.reduce(lines, function (sum, line) {                                                         // 18
      return sum + line.connectionFee();                                                                             // 19
    }, 0));                                                                                                          //
  },                                                                                                                 //
  serviceFee: function () {                                                                                          // 22
    return this.subtotal() * Mart.SERVICE_FEE_PCT;                                                                   // 23
  },                                                                                                                 //
  preTaxTotal: function () {                                                                                         // 25
    return this.subtotal() + this.serviceFee();                                                                      // 26
  },                                                                                                                 //
  total: function () {                                                                                               // 28
    return this.preTaxTotal() + this.tax();                                                                          // 29
  },                                                                                                                 //
  lineItems: function () {                                                                                           // 31
    return Mart.LineItems.find({ cartId: this._id }).fetch();                                                        // 32
  },                                                                                                                 //
  tax: function () {                                                                                                 // 34
    return this.preTaxTotal() * Mart.TAX_PCT;                                                                        // 35
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
canOpCartWaitingCartAcceptance = function (cartId) {                                                                 // 39
  var firstStorefront = getFirstStorefront(cartId);                                                                  // 40
  return Mart.isAdmin() || // is admin                                                                               // 41
  Mart.isMerchant() && firstStorefront.userId === Meteor.userId() || // storefront belongs to merchant               // 42
  Mart.isRep() && firstStorefront.repId === Meteor.userId(); // belongs to rep                                       // 43
};                                                                                                                   //
                                                                                                                     //
canOpCartShopping = function (cartId) {                                                                              // 46
  var cart = Mart.Carts.findOne(cartId);                                                                             // 47
  return !!cart.userId && cart.userId === Meteor.userId() || // cart belongs to user                                 // 48
  cart.guestId && !cart.userId; // cart doesn't belong to anybody                                                    // 49
};                                                                                                                   //
                                                                                                                     //
getFirstStorefront = function (cartId) {                                                                             // 52
  var firstLineItem = Mart.LineItems.findOne({ cartId: cartId });                                                    // 53
  var firstProduct = Mart.Products.findOne(firstLineItem.productId);                                                 // 54
  return Mart.Storefronts.findOne(firstProduct.storefrontId);                                                        // 55
};                                                                                                                   //
                                                                                                                     //
Mart.Cart = {                                                                                                        // 58
  GUEST_ID: 'mart-cart-guest-id',                                                                                    // 59
  SESSION_ID: 'mart-cart-session-id',                                                                                // 60
  STATES: {                                                                                                          // 61
    SHOPPING: "mart-cart-state-shopping",                                                                            // 62
    WAITING_CART_ACCEPTANCE: "mart-cart-state-waiting-cart-acceptance",                                              // 63
    MAKING_PAYMENT: 'mart-cart-state-making-payment',                                                                // 64
    WAITING_TRANSFER_ACCEPTANCE: 'mart-cart-state-waiting-transfer-acceptance',                                      // 65
    PROCESSING_TRANSFER: 'mart-cart-state-processing-transfer',                                                      // 66
    SETTLED: 'mart-cart-state-settled',                                                                              // 67
    CANCELLED_BY_MERCHANT: 'mart-cart-state-cancelled-by-merchant',                                                  // 68
    CANCELLED_BY_PAYMENT: 'mart-cart-state-cancelled-by-payment',                                                    // 69
    CANCELLED_BY_ADMIN: 'mart-cart-state-cancelled-by-admin'                                                         // 70
  }                                                                                                                  //
};                                                                                                                   //
                                                                                                                     //
Mart.Carts.attachSchema(new SimpleSchema({                                                                           // 74
  state: {                                                                                                           // 75
    type: String                                                                                                     // 76
  },                                                                                                                 //
  merchantId: {                                                                                                      // 78
    type: String                                                                                                     // 79
  },                                                                                                                 //
  storefrontId: {                                                                                                    // 81
    type: String                                                                                                     // 82
  },                                                                                                                 //
  userId: {                                                                                                          // 84
    type: String,                                                                                                    // 85
    optional: true                                                                                                   // 86
  },                                                                                                                 //
  guestId: {                                                                                                         // 88
    type: String,                                                                                                    // 89
    optional: true                                                                                                   // 90
  },                                                                                                                 //
  cardId: {                                                                                                          // 92
    type: String,                                                                                                    // 93
    optional: true                                                                                                   // 94
  },                                                                                                                 //
  cardToken: {                                                                                                       // 96
    type: String,                                                                                                    // 97
    optional: true                                                                                                   // 98
  },                                                                                                                 //
  contactRentingOnBehalfBiz: {                                                                                       // 100
    type: Boolean,                                                                                                   // 101
    optional: true                                                                                                   // 102
  },                                                                                                                 //
  contactFirstName: {                                                                                                // 104
    type: String,                                                                                                    // 105
    optional: true                                                                                                   // 106
  },                                                                                                                 //
  contactLastName: {                                                                                                 // 108
    type: String,                                                                                                    // 109
    optional: true                                                                                                   // 110
  },                                                                                                                 //
  contactEmail: {                                                                                                    // 112
    type: String,                                                                                                    // 113
    optional: true                                                                                                   // 114
  },                                                                                                                 //
  contactPhone: {                                                                                                    // 116
    type: String,                                                                                                    // 117
    optional: true                                                                                                   // 118
  },                                                                                                                 //
  contactBusiness: {                                                                                                 // 120
    type: String,                                                                                                    // 121
    optional: true                                                                                                   // 122
  },                                                                                                                 //
  contactAddress: {                                                                                                  // 124
    type: String,                                                                                                    // 125
    optional: true                                                                                                   // 126
  },                                                                                                                 //
  contactAddress2: {                                                                                                 // 128
    type: String,                                                                                                    // 129
    optional: true                                                                                                   // 130
  },                                                                                                                 //
  contactCity: {                                                                                                     // 132
    type: String,                                                                                                    // 133
    optional: true                                                                                                   // 134
  },                                                                                                                 //
  contactZIP: {                                                                                                      // 136
    type: String,                                                                                                    // 137
    optional: true                                                                                                   // 138
  },                                                                                                                 //
  serviceFee: {                                                                                                      // 140
    type: Number,                                                                                                    // 141
    optional: true                                                                                                   // 142
  },                                                                                                                 //
  connectionFee: {                                                                                                   // 144
    type: Number,                                                                                                    // 145
    optional: true                                                                                                   // 146
  },                                                                                                                 //
  merchantCut: {                                                                                                     // 148
    type: Number,                                                                                                    // 149
    optional: true                                                                                                   // 150
  },                                                                                                                 //
  tax: {                                                                                                             // 152
    type: Number,                                                                                                    // 153
    optional: true                                                                                                   // 154
  },                                                                                                                 //
  paymentAt: {                                                                                                       // 156
    type: Date,                                                                                                      // 157
    optional: true                                                                                                   // 158
  },                                                                                                                 //
  paymentConfirmation: {                                                                                             // 160
    type: String,                                                                                                    // 161
    optional: true                                                                                                   // 162
  },                                                                                                                 //
  paymentAmount: {                                                                                                   // 164
    type: Number,                                                                                                    // 165
    optional: true                                                                                                   // 166
  },                                                                                                                 //
  cartAcceptedAt: {                                                                                                  // 168
    type: Date,                                                                                                      // 169
    optional: true                                                                                                   // 170
  },                                                                                                                 //
  submittedAt: {                                                                                                     // 172
    type: Date,                                                                                                      // 173
    optional: true                                                                                                   // 174
  },                                                                                                                 //
  transferredAt: {                                                                                                   // 176
    type: Date,                                                                                                      // 177
    optional: true                                                                                                   // 178
  },                                                                                                                 //
  transferredToBankAccountId: {                                                                                      // 180
    type: String,                                                                                                    // 181
    optional: true                                                                                                   // 182
  },                                                                                                                 //
  transferredToManagedAccountId: {                                                                                   // 184
    type: String,                                                                                                    // 185
    optional: true                                                                                                   // 186
  },                                                                                                                 //
  transferAcceptedAt: {                                                                                              // 188
    type: Date,                                                                                                      // 189
    optional: true                                                                                                   // 190
  },                                                                                                                 //
  transferConfirmation: {                                                                                            // 192
    type: String,                                                                                                    // 193
    optional: true                                                                                                   // 194
  },                                                                                                                 //
  transferAmount: {                                                                                                  // 196
    type: Number,                                                                                                    // 197
    optional: true                                                                                                   // 198
  },                                                                                                                 //
  settledAt: {                                                                                                       // 200
    type: Date,                                                                                                      // 201
    optional: true                                                                                                   // 202
  },                                                                                                                 //
  transferAcceptedByAdminId: {                                                                                       // 204
    type: String,                                                                                                    // 205
    optional: true                                                                                                   // 206
  }                                                                                                                  //
}));                                                                                                                 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/storefronts/server/storefronts-publications.js                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.publish("mart/storefronts", function () {                                                                     // 1
  // console.log("mart/storefronts");                                                                                //
  if (Mart._isAdmin(this.userId)) {                                                                                  // 3
    // Admins can view everything                                                                                    //
    return [Mart.Storefronts.find(), Mart.Images.find({ objectCollection: "Storefronts" })];                         // 5
  } else if (Mart._isMerchant(this.userId)) {                                                                        //
    // Merchants can view everything they created that hasn't been deleted                                           //
    return [Mart.Storefronts.find({ userId: this.userId, isDeleted: false }), Mart.Images.find({ objectCollection: "Storefronts" })];
  } else if (Mart._isRep(this.userId)) {                                                                             //
    // Merchants can view everything they created that hasn't been deleted                                           //
    return [Mart.Storefronts.find({ repId: this.userId, isDeleted: false }), Mart.Images.find({ objectCollection: "Storefronts" })];
  } else {                                                                                                           //
    // No role or user required to view published stores stores                                                      //
    return [Mart.Storefronts.find({ isPublished: true, isDeleted: false }, { fields: {                               // 23
        _id: 1,                                                                                                      // 27
        name: 1,                                                                                                     // 28
        description: 1,                                                                                              // 29
        address: 1,                                                                                                  // 30
        address2: 1,                                                                                                 // 31
        city: 1,                                                                                                     // 32
        state: 1,                                                                                                    // 33
        zip: 1,                                                                                                      // 34
        userId: 1                                                                                                    // 35
      } }), Mart.Images.find()];                                                                                     //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Meteor.publish("mart/storefront", function (storefrontId) {                                                          // 43
  check(storefrontId, String);                                                                                       // 44
  var storefront = Mart.Storefronts.findOne(storefrontId);                                                           // 45
                                                                                                                     //
  if (!storefront) return;                                                                                           // 47
                                                                                                                     //
  if (Mart._isAdmin(this.userId)) {                                                                                  // 50
    // Admins can view everything                                                                                    //
    return [Mart.Storefronts.find({ _id: storefrontId }), Mart.Products.find({ storefrontId: storefrontId }), Mart.Images.find({ objectId: storefrontId, objectCollection: "Storefronts" }), Meteor.users.find(storefront.userId, { fields: {
        profile: 1                                                                                                   // 57
      } })];                                                                                                         //
  } else if (Mart._isMerchant(this.userId)) {                                                                        //
    // Merchants can view everything they created that hasn't been deleted                                           //
    return [Mart.Storefronts.find({ userId: this.userId, isDeleted: false, _id: storefrontId }), Mart.Products.find({ storefrontId: storefrontId }), Mart.Images.find({ objectId: storefrontId, objectCollection: "Storefronts" }), Meteor.users.find(storefront.userId, { fields: {
        profile: 1                                                                                                   // 67
      } })];                                                                                                         //
  } else if (Mart._isRep(this.userId)) {                                                                             //
    // Merchants can view everything they created that hasn't been deleted                                           //
    return [Mart.Storefronts.find({ repId: this.userId, isDeleted: false, _id: storefrontId }), Mart.Products.find({ storefrontId: storefrontId }), Mart.Images.find({ objectId: storefrontId, objectCollection: "Storefronts" }), Meteor.users.find(storefront.userId, { fields: {
        profile: 1                                                                                                   // 77
      } })];                                                                                                         //
  } else {                                                                                                           //
    return [Mart.Storefronts.find({ isPublished: true, isDeleted: false, _id: storefrontId }, { fields: {            // 81
        _id: 1,                                                                                                      // 85
        name: 1,                                                                                                     // 86
        description: 1,                                                                                              // 87
        address: 1,                                                                                                  // 88
        address2: 1,                                                                                                 // 89
        city: 1,                                                                                                     // 90
        state: 1,                                                                                                    // 91
        zip: 1,                                                                                                      // 92
        userId: 1                                                                                                    // 93
      } }), Mart.Products.find({                                                                                     //
      isPublished: true,                                                                                             // 96
      isDeleted: false,                                                                                              // 97
      storefrontId: storefrontId                                                                                     // 98
    }, { fields: {                                                                                                   //
        _id: 1,                                                                                                      // 101
        name: 1,                                                                                                     // 102
        description: 1,                                                                                              // 103
        storefrontId: 1,                                                                                             // 104
        occupancy: 1,                                                                                                // 105
        size: 1                                                                                                      // 106
      } }), Mart.Images.find({ objectId: storefrontId, objectCollection: "Storefronts" }), Meteor.users.find(storefront.userId, { fields: {
        profile: 1                                                                                                   // 110
      } })];                                                                                                         //
  }                                                                                                                  //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/storefronts/server/storefronts-security.js                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.Storefronts.permit(['insert', 'update']).ifRoles([Mart.ROLES.GLOBAL.MERCHANT, Mart.ROLES.GLOBAL.ADMIN, Mart.ROLES.GLOBAL.REP]).apply();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/accounts/accounts-server.js                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Cannot already be logged in if creating a new user                                                                //
Accounts.validateNewUser(function (user) {                                                                           // 2
  if (this.userId) {                                                                                                 // 3
    throw new Meteor.Error(403, "Not authorized to create new users");                                               // 4
  } else {                                                                                                           //
    return true;                                                                                                     // 6
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
// Only Shoppers and Merchants can be created                                                                        //
var areRolesValid = function (roles) {                                                                               // 11
  var allowedRolesWithoutLogin = [Mart.ROLES.GLOBAL.SHOPPER, Mart.ROLES.GLOBAL.MERCHANT];                            // 12
                                                                                                                     //
  var sanitizedRoles = _.intersection(roles, allowedRolesWithoutLogin);                                              // 17
  return sanitizedRoles.length === roles.length;                                                                     // 18
};                                                                                                                   //
var clientIP = function () {                                                                                         // 20
  // var env = process.env.NODE_ENV;                                                                                 //
  var env = false;                                                                                                   // 22
                                                                                                                     //
  if (env === 'production') {                                                                                        // 24
    return this.connection.clientAddress;                                                                            // 25
  } else {                                                                                                           //
    return '127.0.0.1';                                                                                              // 27
  }                                                                                                                  //
};                                                                                                                   //
                                                                                                                     //
Meteor.methods({                                                                                                     // 31
  'mart/add-roles-and-terms': function (roles) {                                                                     // 32
    check(roles, Match.OneOf([String], undefined, null));                                                            // 33
    roles = roles || [Mart.ROLES.GLOBAL.SHOPPER];                                                                    // 34
                                                                                                                     //
    if (areRolesValid(roles)) {                                                                                      // 36
      _.each(roles, function (role) {                                                                                // 37
        Roles.addUsersToRoles(Meteor.userId(), roles, Mart.ROLES.GROUPS.GLOBAL);                                     // 38
      });                                                                                                            //
      Meteor.users.update(Meteor.userId(), { $set: {                                                                 // 40
          termsAcceptedIP: clientIP(),                                                                               // 41
          termsAcceptedAt: Math.floor(Date.now() / 1000)                                                             // 42
        } });                                                                                                        //
                                                                                                                     //
      Accounts.sendVerificationEmail(Meteor.userId());                                                               // 45
    } else {                                                                                                         //
      throw new Meteor.Error(403, "You do not have permission to assume that role.");                                // 47
    }                                                                                                                //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Meteor.publish("mart/user-terms-data", function () {                                                                 // 52
  if (this.userId) {                                                                                                 // 53
    return Meteor.users.find({ _id: this.userId }, { fields: { 'termsAcceptedAt': 1, 'termsAcceptedIP': 1 } });      // 54
  } else {                                                                                                           //
    this.ready();                                                                                                    // 58
  }                                                                                                                  //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/accounts/accounts-publications.js                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.publish("mart/user", function (userId) {                                                                      // 1
  check(userId, String);                                                                                             // 2
                                                                                                                     //
  if (userId === this.userId) {                                                                                      // 4
    return Meteor.users.find(userId, { fields: {                                                                     // 5
        emails: 1,                                                                                                   // 6
        profile: 1,                                                                                                  // 7
        roles: 1                                                                                                     // 8
      } });                                                                                                          //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Meteor.publish("mart/profile", function (userId) {                                                                   // 13
  check(userId, String);                                                                                             // 14
  return Meteor.users.find(userId, { fields: {                                                                       // 15
      profile: 1                                                                                                     // 16
    } });                                                                                                            //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/payment_methods/cards/cards_server.js                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.publish("mart/cards", function (guestId) {                                                                    // 1
  check(guestId, Match.OneOf(String, null, undefined));                                                              // 2
                                                                                                                     //
  var selector;                                                                                                      // 4
  if (this.userId) {                                                                                                 // 5
    selector = { userId: this.userId };                                                                              // 6
  } else {                                                                                                           //
    selector = { guestId: guestId };                                                                                 // 8
  }                                                                                                                  //
                                                                                                                     //
  return Mart.Cards.find(selector, { fields: {                                                                       // 11
      _id: 1,                                                                                                        // 12
      last4: 1,                                                                                                      // 13
      expMonth: 1,                                                                                                   // 14
      expYear: 1,                                                                                                    // 15
      nameOnCard: 1,                                                                                                 // 16
      brand: 1                                                                                                       // 17
    } });                                                                                                            //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/products/products-publications.js                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.publish("mart/products", function (storefrontId) {                                                            // 1
  return Mart.Products.find({                                                                                        // 2
    isActive: true,                                                                                                  // 3
    isDeleted: false,                                                                                                // 4
    storefrontId: storefrontId                                                                                       // 5
  }, { fields: {                                                                                                     //
      _id: 1,                                                                                                        // 8
      name: 1,                                                                                                       // 9
      description: 1,                                                                                                // 10
      occupancy: 1,                                                                                                  // 11
      size: 1                                                                                                        // 12
    } });                                                                                                            //
});                                                                                                                  //
                                                                                                                     //
Meteor.publish("mart/product", function (productId) {                                                                // 16
  check(productId, String);                                                                                          // 17
                                                                                                                     //
  var product = Mart.Products.findOne(productId);                                                                    // 19
                                                                                                                     //
  return [Mart.Products.find({                                                                                       // 21
    isPublished: true,                                                                                               // 23
    isDeleted: false,                                                                                                // 24
    _id: productId                                                                                                   // 25
  }, { fields: {                                                                                                     //
      _id: 1,                                                                                                        // 28
      name: 1,                                                                                                       // 29
      description: 1,                                                                                                // 30
      occupancy: 1,                                                                                                  // 31
      size: 1                                                                                                        // 32
    } }), Mart.Storefronts.find({                                                                                    //
    isPublished: true,                                                                                               // 36
    isDeleted: false,                                                                                                // 37
    _id: product.storefrontId                                                                                        // 38
  }, { fields: {                                                                                                     //
      _id: 1,                                                                                                        // 41
      name: 1,                                                                                                       // 42
      description: 1,                                                                                                // 43
      address: 1,                                                                                                    // 44
      address2: 1,                                                                                                   // 45
      city: 1,                                                                                                       // 46
      state: 1,                                                                                                      // 47
      zip: 1                                                                                                         // 48
    } }), Mart.Images.find({                                                                                         //
    objectId: productId,                                                                                             // 52
    objectCollection: "Products"                                                                                     // 53
  }), Mart.Prices.find({                                                                                             //
    productId: productId                                                                                             // 57
  })];                                                                                                               //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/products/products-security.js                                                            //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Security.defineMethod("ifStorefrontBelongsToCurrentUser", {                                                          // 1
  fetch: [],                                                                                                         // 2
  transform: null,                                                                                                   // 3
  deny: function (type, arg, userId, doc) {                                                                          // 4
    var storefront = Mart.Storefronts.findOne({                                                                      // 5
      _id: doc.storefrontId,                                                                                         // 6
      isDeleted: false                                                                                               // 7
    });                                                                                                              //
                                                                                                                     //
    if (!!storefront) return userId !== storefront.userId;                                                           // 10
                                                                                                                     //
    return true;                                                                                                     // 13
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Security.defineMethod("ifStorefrontManagedByCurrentUser", {                                                          // 17
  fetch: [],                                                                                                         // 18
  transform: null,                                                                                                   // 19
  deny: function (type, arg, userId, doc) {                                                                          // 20
    var storefront = Mart.Storefronts.findOne({                                                                      // 21
      _id: doc.storefrontId,                                                                                         // 22
      isDeleted: false                                                                                               // 23
    });                                                                                                              //
                                                                                                                     //
    if (!!storefront) return userId !== storefront.repId;                                                            // 26
                                                                                                                     //
    return true;                                                                                                     // 29
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Mart.Products.permit(['insert', 'update']).ifRoles([Mart.ROLES.GLOBAL.MERCHANT]).ifStorefrontBelongsToCurrentUser().apply();
                                                                                                                     //
Mart.Products.permit(['insert', 'update']).ifRoles([Mart.ROLES.GLOBAL.ADMIN, Mart.ROLES.GLOBAL.REP]).ifStorefrontManagedByCurrentUser().apply();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/prices/prices-security.js                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Security.defineMethod("ifProductBelongsToCurrentUser", {                                                             // 1
  fetch: [],                                                                                                         // 2
  transform: null,                                                                                                   // 3
  deny: function (type, arg, userId, doc) {                                                                          // 4
    var product = Mart.Products.findOne({                                                                            // 5
      _id: doc.productId,                                                                                            // 6
      isDeleted: false                                                                                               // 7
    });                                                                                                              //
                                                                                                                     //
    if (!!product) {                                                                                                 // 10
      var storefront = Mart.Storefronts.findOne({                                                                    // 11
        _id: product.storefrontId,                                                                                   // 12
        isDeleted: false                                                                                             // 13
      });                                                                                                            //
                                                                                                                     //
      if (!!storefront) return userId !== storefront.userId;                                                         // 16
    }                                                                                                                //
    return true;                                                                                                     // 19
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Security.defineMethod("ifProductManagedByCurrentUser", {                                                             // 23
  fetch: [],                                                                                                         // 24
  transform: null,                                                                                                   // 25
  deny: function (type, arg, userId, doc) {                                                                          // 26
    var product = Mart.Products.findOne({                                                                            // 27
      _id: doc.productId,                                                                                            // 28
      isDeleted: false                                                                                               // 29
    });                                                                                                              //
                                                                                                                     //
    if (!!product) {                                                                                                 // 32
      var storefront = Mart.Storefronts.findOne({                                                                    // 33
        _id: product.storefrontId,                                                                                   // 34
        isDeleted: false                                                                                             // 35
      });                                                                                                            //
                                                                                                                     //
      if (!!storefront) return userId !== storefront.repId;                                                          // 38
    }                                                                                                                //
                                                                                                                     //
    return true;                                                                                                     // 42
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Security.defineMethod("ifOnlyUnitPrice", {                                                                           // 46
  fetch: [],                                                                                                         // 47
  transform: null,                                                                                                   // 48
  deny: function (type, arg, userId, doc) {                                                                          // 49
    var price = Mart.Prices.findOne({                                                                                // 50
      unit: doc.unit,                                                                                                // 51
      productId: doc.productId                                                                                       // 52
    });                                                                                                              //
                                                                                                                     //
    return !!price;                                                                                                  // 55
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Mart.Prices.permit(['insert']).ifRoles([Mart.ROLES.GLOBAL.MERCHANT]).ifProductBelongsToCurrentUser().ifOnlyUnitPrice().apply();
                                                                                                                     //
Mart.Prices.permit(['insert']).ifRoles([Mart.ROLES.GLOBAL.ADMIN, Mart.ROLES.GLOBAL.REP]).ifProductManagedByCurrentUser().ifOnlyUnitPrice().apply();
                                                                                                                     //
Mart.Prices.permit(['update']).ifRoles([Mart.ROLES.GLOBAL.MERCHANT]).ifProductBelongsToCurrentUser().apply();        // 77
                                                                                                                     //
Mart.Prices.permit(['update']).ifRoles([Mart.ROLES.GLOBAL.ADMIN, Mart.ROLES.GLOBAL.REP]).ifProductManagedByCurrentUser().apply();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/gateways/gateways_server.js                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.publish("mart/gateways", function () {                                                                        // 1
  return Mart.Gateways.find({});                                                                                     // 2
});                                                                                                                  //
                                                                                                                     //
Meteor.methods({                                                                                                     // 5
  'mart/update-gateway-info': function (gatewayTypeName) {                                                           // 6
    check(gatewayTypeName, String);                                                                                  // 7
                                                                                                                     //
    return Mart.GatewayTypes[gatewayTypeName].retrieveAccountInfo();                                                 // 9
  }                                                                                                                  //
});                                                                                                                  //
// 'mart/charge-card': function (gatewayTypeName, cardId, cartId, options) {                                         //
//   check(gatewayTypeName, String)                                                                                  //
//   return gatewayType.chargeCard(cardId, cartId, options);                                                         //
// },                                                                                                                //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/gateways/stripe/stripe_server.js                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
                                                                                                                     //
_.extend(Mart.GatewayTypes.Stripe, {                                                                                 // 2
  // Get account info, create a gateway if none exists                                                               //
  // return gateway._id                                                                                              //
  retrieveAccountInfo: function () {                                                                                 // 5
    var retrieveAccount = Meteor.wrapAsync(Stripe.accounts.retrieve, Stripe.accounts);                               // 6
    try {                                                                                                            // 7
      var result = retrieveAccount();                                                                                // 8
                                                                                                                     //
      accountAttrs = {                                                                                               // 10
        gatewayType: "Stripe",                                                                                       // 11
        businessName: result.business_name,                                                                          // 12
        businessURL: result.business_url,                                                                            // 13
        detailsSubmitted: result.details_submitted,                                                                  // 14
        chargesEnabled: result.charges_enabled,                                                                      // 15
        transfersEnabled: result.transfers_enabled                                                                   // 16
      };                                                                                                             //
                                                                                                                     //
      Mart.Gateways.upsert({}, { $set: accountAttrs });                                                              // 19
      return Mart.Gateways.findOne()._id;                                                                            // 20
    } catch (error) {                                                                                                //
      throw new Meteor.Error("stripe-charge-error", error.message);                                                  // 22
    }                                                                                                                //
  },                                                                                                                 //
  createCard: function (stripeToken, card) {                                                                         // 25
    console.log('server#createCard');                                                                                // 26
    var customerToken = this.getCustomerToken();                                                                     // 27
    console.log(customerToken);                                                                                      // 28
    var Stripe = StripeAPI(Mart.STRIPE_SECRET_KEY);                                                                  // 29
    console.log('Stripe');                                                                                           // 30
    console.log(Stripe);                                                                                             // 31
    console.log(Stripe.customers);                                                                                   // 32
    var createSource = Meteor.wrapAsync(Stripe.customers.createSource, Stripe.customers);                            // 33
    console.log('createSource');                                                                                     // 34
    console.log(createSource);                                                                                       // 35
    console.log('final');                                                                                            // 36
    console.log(stripeToken);                                                                                        // 37
    console.log(customerToken);                                                                                      // 38
    try {                                                                                                            // 39
      // Add Card to Stripe                                                                                          //
      var result = createSource(customerToken, { source: stripeToken });                                             // 41
      console.log(card);                                                                                             // 42
      card["gatewayToken"] = result.id;                                                                              // 43
      console.log('result');                                                                                         // 44
      console.log(result);                                                                                           // 45
      // Add Card to Collection                                                                                      //
      var cardId = Mart.Cards.insert(card);                                                                          // 47
      return cardId;                                                                                                 // 48
    } catch (error) {                                                                                                //
      console.log(error);                                                                                            // 50
      throw new Meteor.Error("stripe-customer-source-error", error.message);                                         // 51
    }                                                                                                                //
  },                                                                                                                 //
  getCustomerToken: function () {                                                                                    // 54
    console.log('getCustomerToken');                                                                                 // 55
    var Stripe = StripeAPI(Mart.STRIPE_SECRET_KEY);                                                                  // 56
    var existingCustomer = this.Customers.findOne({ userId: Meteor.userId() }),                                      // 57
        customerToken;                                                                                               //
                                                                                                                     //
    // Stripe cards must be added to a customer, see if one exists                                                   //
    if (existingCustomer) {                                                                                          // 61
      customerToken = existingCustomer.stripeToken;                                                                  // 62
    } else {                                                                                                         //
      // Customer for this user does noes exist, create one                                                          //
      var createCustomer = Meteor.wrapAsync(Stripe.customers.create, Stripe.customers);                              // 65
                                                                                                                     //
      try {                                                                                                          // 67
        // Create on Stripe                                                                                          //
        var result = createCustomer({ description: "Customer for user " + Meteor.userId() });                        // 69
        customerToken = result.id;                                                                                   // 70
                                                                                                                     //
        // Create in Collection                                                                                      //
        var t = this.Customers.insert({ stripeToken: customerToken, userId: Meteor.userId() });                      // 73
      } catch (error) {                                                                                              //
        throw new Meteor.Error("stripe-customer-create-error", error.message);                                       // 75
      }                                                                                                              //
    }                                                                                                                //
    return customerToken;                                                                                            // 78
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Meteor.methods({                                                                                                     // 82
  'mart/stripe/create-card': function (stripeToken, card) {                                                          // 83
    check(stripeToken, String);                                                                                      // 84
    check(card, {                                                                                                    // 85
      last4: String,                                                                                                 // 86
      expMonth: Number,                                                                                              // 87
      expYear: Number,                                                                                               // 88
      nameOnCard: String,                                                                                            // 89
      brand: String,                                                                                                 // 90
      gateway: String                                                                                                // 91
    });                                                                                                              //
                                                                                                                     //
    cardId = Mart.GatewayTypes.Stripe.createCard(stripeToken, card);                                                 // 94
    return cardId;                                                                                                   // 95
  },                                                                                                                 //
  'mart/stripe/create-bank-account': function (bankAccountToken, bankAccount) {                                      // 97
    check(bankAccountToken, String);                                                                                 // 98
    check(bankAccount, {                                                                                             // 99
      name: String,                                                                                                  // 100
      last4: String,                                                                                                 // 101
      bankName: String,                                                                                              // 102
      routingNumber: String,                                                                                         // 103
      country: String,                                                                                               // 104
      currency: String,                                                                                              // 105
      recipientType: String                                                                                          // 106
    });                                                                                                              //
                                                                                                                     //
    // Find the current user's managed account                                                                       //
    var managedAccount = Mart.GatewayTypes.Stripe.ManagedAccounts.findOne({ userId: Meteor.userId() }),              // 110
        Stripe = StripeAPI(Mart.STRIPE_SECRET_KEY);                                                                  //
                                                                                                                     //
    // Create a new managed account on stripe if one doesn't exist                                                   //
    if (!managedAccount) {                                                                                           // 114
      var acctId = createManagedAccount();                                                                           // 115
      managedAccount = Mart.GatewayTypes.Stripe.ManagedAccounts.findOne({                                            // 116
        userId: Meteor.userId(),                                                                                     // 117
        _id: acctId                                                                                                  // 118
      });                                                                                                            //
    }                                                                                                                //
                                                                                                                     //
    // Create a bank account corresponding belonging to the managed account we just created                          //
    return createBankAccount(bankAccountToken, bankAccount, managedAccount);                                         // 123
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
var createBankAccount = function (bankAccountToken, bankAccount, managedAccount) {                                   // 127
  var Stripe = StripeAPI(Mart.STRIPE_SECRET_KEY);                                                                    // 128
  var createBankAccount = Meteor.wrapAsync(Stripe.accounts.createExternalAccount, Stripe.accounts);                  // 129
                                                                                                                     //
  try {                                                                                                              // 131
    var result = createBankAccount(managedAccount.stripeToken, { external_account: bankAccountToken });              // 132
                                                                                                                     //
    return Mart.BankAccounts.insert(_.extend(bankAccount, {                                                          // 135
      gateway: "Stripe",                                                                                             // 136
      isDefault: result.default_for_currency,                                                                        // 137
      gatewayToken: result.id                                                                                        // 138
    }));                                                                                                             //
  } catch (error) {                                                                                                  //
    throw new Meteor.Error("stripe-external-account-create-error", error.message);                                   // 142
  }                                                                                                                  //
};                                                                                                                   //
                                                                                                                     //
// returns returns managed accountId                                                                                 //
var createManagedAccount = function () {                                                                             // 147
  var Stripe = StripeAPI(Mart.STRIPE_SECRET_KEY);                                                                    // 148
  var createAccount = Meteor.wrapAsync(Stripe.accounts.create, Stripe.accounts);                                     // 149
  try {                                                                                                              // 150
    // Create on Stripe                                                                                              //
    var result = createAccount({                                                                                     // 152
      country: 'US',                                                                                                 // 153
      managed: true,                                                                                                 // 154
      email: Meteor.user().emails[0].address                                                                         // 155
    });                                                                                                              //
                                                                                                                     //
    // Create in Collection                                                                                          //
    return Mart.GatewayTypes.Stripe.ManagedAccounts.insert({                                                         // 159
      stripeToken: result.id,                                                                                        // 160
      stripePublicKey: result.keys.publishable,                                                                      // 161
      stripePrivateKey: result.keys.secret,                                                                          // 162
      isLegalEntityVerified: isLegalEntityVerified(result.legal_entity.verification),                                // 163
      isAccountVerified: result.transfers_enabled                                                                    // 164
    });                                                                                                              //
  } catch (error) {                                                                                                  //
    throw new Meteor.Error("stripe-managed-account-create-error", error.message);                                    // 167
  }                                                                                                                  //
};                                                                                                                   //
                                                                                                                     //
var isLegalEntityVerified = function (stripeDesc) {                                                                  // 171
  return stripeDesc === "verified" ? true : false;                                                                   // 172
};                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/line_items/line_items_server.js                                                          //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Security.defineMethod("ifCartBelongsToCurrentUser", {                                                                // 1
  fetch: [],                                                                                                         // 2
  transform: null,                                                                                                   // 3
  deny: function (type, arg, userId, doc) {                                                                          // 4
    var cart = Mart.Carts.findOne({ _id: doc.cartId, state: Mart.Cart.STATES.SHOPPING });                            // 5
    if (cart) {                                                                                                      // 6
      if (!!userId) {                                                                                                // 7
        return userId !== cart.userId;                                                                               // 8
      } else {                                                                                                       //
        // TODO prevent not logged in users from adding to somebody else's cart                                      //
        return cart.guestId === undefined;                                                                           // 11
      }                                                                                                              //
    }                                                                                                                //
    return true;                                                                                                     // 14
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Mart.LineItems.permit(['insert', 'update', 'remove']).ifCartBelongsToCurrentUser().apply();                          // 18
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/carts/carts-publications.js                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.publish('mart/cart', function (cartId) {                                                                      // 1
  check(cartId, String);                                                                                             // 2
  if (this.userId) {                                                                                                 // 3
    return Mart.Carts.find({ _id: cartId });                                                                         // 4
  }                                                                                                                  //
  this.ready();                                                                                                      // 6
});                                                                                                                  //
                                                                                                                     //
Meteor.publish('mart/carts', function (states, guestId) {                                                            // 9
  check(states, [String]);                                                                                           // 10
  check(guestId, Match.OneOf(String, null, undefined));                                                              // 11
                                                                                                                     //
  var sub = this,                                                                                                    // 13
      productHandles = [],                                                                                           //
      lineItemHandles = [],                                                                                          //
      storefrontHandles = [],                                                                                        //
      cartHandle = null,                                                                                             //
      lineItemHandle = null;                                                                                         //
                                                                                                                     //
  // send over all line items for a specific cart                                                                    //
  function publishCartLineItems(cartId) {                                                                            // 17
    var lineItemsCursor = Mart.LineItems.find({ cartId: cartId });                                                   // 18
                                                                                                                     //
    lineItemHandles[cartId] = Mongo.Collection._publishCursor(lineItemsCursor, sub, 'MartLineItems');                // 20
                                                                                                                     //
    lineItemHandle = Mart.LineItems.find({ cartId: cartId }).observeChanges({                                        // 23
      added: function (id, lineItem) {                                                                               // 24
        publishLineItemProductsAndStorefronts(lineItem);                                                             // 25
        sub.added('MartLineItems', id, lineItem);                                                                    // 26
      },                                                                                                             //
      changed: function (id, fields) {                                                                               // 28
        sub.changed('MartLineItems', id, fields);                                                                    // 29
      },                                                                                                             //
      removed: function (id) {                                                                                       // 31
        productHandles[id] && productHandles[id].stop();                                                             // 32
        storefrontHandles[id] && storefrontHandles[id].stop();                                                       // 33
                                                                                                                     //
        sub.removed('MartLineItems', id);                                                                            // 35
      }                                                                                                              //
    });                                                                                                              //
  }                                                                                                                  //
                                                                                                                     //
  function publishLineItemProductsAndStorefronts(lineItem) {                                                         // 40
    // var lineItem = Mart.LineItems.findOne(lineItemId)                                                             //
    var lineItemId = lineItem._id;                                                                                   // 42
                                                                                                                     //
    var productsCursor = Mart.Products.find({ _id: lineItem.productId });                                            // 44
    productHandles[lineItemId] = Mongo.Collection._publishCursor(productsCursor, sub, "MartProducts");               // 45
                                                                                                                     //
    var product = Mart.Products.findOne(lineItem.productId);                                                         // 48
    var storefrontsCursor = Mart.Storefronts.find({ _id: product.storefrontId });                                    // 49
    storefrontHandles[lineItemId] = Mongo.Collection._publishCursor(storefrontsCursor, sub, "MartStorefronts");      // 50
  }                                                                                                                  //
                                                                                                                     //
  var cartsCursor;                                                                                                   // 54
  if (Mart._isAdmin(this.userId)) {                                                                                  // 55
                                                                                                                     //
    cartsCursor = Mart.Carts.find();                                                                                 // 57
  } else if (Mart._isRep(this.userId)) {                                                                             //
                                                                                                                     //
    var reppedStorefronts = Mart.Storefronts.find({                                                                  // 61
      repId: this.userId                                                                                             // 62
    }).fetch();                                                                                                      //
                                                                                                                     //
    var reppedStorefrontIds = _.map(reppedStorefronts, function (storefront) {                                       // 65
      return storefront._id;                                                                                         // 66
    });                                                                                                              //
                                                                                                                     //
    cartsCursor = Mart.Carts.find({ storefrontId: { $in: reppedStorefrontIds } });                                   // 69
  } else if (Mart._isShopper(this.userId)) {                                                                         //
    cartsCursor = Mart.Carts.find({                                                                                  // 72
      $and: [{ userId: this.userId }, { state: { $in: states } }]                                                    // 73
    });                                                                                                              //
  } else if (Mart._isMerchant(this.userId)) {                                                                        //
                                                                                                                     //
    cartsCursor = Mart.Carts.find({ merchantId: this.userId });                                                      // 81
  } else {                                                                                                           //
    // guest                                                                                                         //
    cartsCursor = Mart.Carts.find({                                                                                  // 84
      $and: [{ guestId: guestId }, { state: { $in: states } }]                                                       // 85
    });                                                                                                              //
  }                                                                                                                  //
                                                                                                                     //
  cartHandle = cartsCursor.observeChanges({                                                                          // 92
    added: function (id, cart) {                                                                                     // 93
      publishCartLineItems(id);                                                                                      // 94
      sub.added('MartCarts', id, cart);                                                                              // 95
    },                                                                                                               //
    changed: function (id, fields) {                                                                                 // 97
      sub.changed('MartCarts', id, fields);                                                                          // 98
    },                                                                                                               //
    removed: function (id) {                                                                                         // 100
      // stop observing changes on the cart's line items                                                             //
      lineItemHandles[id] && lineItemHandles[id].stop();                                                             // 102
      // delete the cart                                                                                             //
      sub.removed('MartCarts', id);                                                                                  // 104
    }                                                                                                                //
  });                                                                                                                //
                                                                                                                     //
  sub.ready();                                                                                                       // 108
                                                                                                                     //
  // make sure we clean everything up (note `_publishCursor`                                                         //
  //   does this for us with the comment observers)                                                                  //
  sub.onStop(function () {                                                                                           // 112
    cartHandle.stop();                                                                                               // 113
    if (lineItemHandle) lineItemHandle.stop();                                                                       // 114
  });                                                                                                                //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/carts/carts-security.js                                                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Security.defineMethod("inShoppingState", {                                                                           // 1
  fetch: [],                                                                                                         // 2
  transform: null,                                                                                                   // 3
  deny: function (type, arg, userId, doc, fields, modifier) {                                                        // 4
    // console.log("inShoppingState " + doc.state + "  " + userId + "   " + doc.userId)                              //
    return doc.state !== Mart.Cart.STATES.SHOPPING || userId !== doc.userId;                                         // 6
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Security.defineMethod("ownsCreditCard", {                                                                            // 10
  fetch: [],                                                                                                         // 11
  transform: null,                                                                                                   // 12
  deny: function (type, arg, userId, doc, fields, modifier) {                                                        // 13
    if (type === "update") {                                                                                         // 14
      var cardId = modifier.$set.cardId;                                                                             // 15
      var card = Mart.Cards.findOne(cardId);                                                                         // 16
    }                                                                                                                //
                                                                                                                     //
    return card === undefined || card.userId !== userId;                                                             // 19
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Mart.Carts.permit(['update']).inShoppingState().ownsCreditCard().onlyProps(['cardId', 'contactName', 'contactEmail', 'contactPhone', 'contactEntity']).apply();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/carts/carts-machina.js                                                                   //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
_.extend(Cart.prototype, {                                                                                           // 1
  machina: function () {                                                                                             // 2
    var fsm = {                                                                                                      // 3
      _: this,                                                                                                       // 4
      initialize: function () {},                                                                                    // 5
      namespace: "mart-cart",                                                                                        // 7
      initialState: this.state || "uninitialized",                                                                   // 8
      states: {                                                                                                      // 9
        uninitialized: {                                                                                             // 10
          "*": function () {                                                                                         // 11
            this.deferUntilTransition();                                                                             // 12
            this.transition(Mart.Cart.STATES.SHOPPING);                                                              // 13
          }                                                                                                          //
        }                                                                                                            //
      }                                                                                                              //
    };                                                                                                               //
                                                                                                                     //
    ///////////////////                                                                                              //
    // SHOPPING                                                                                                      //
    ///////////////////                                                                                              //
    fsm.states[Mart.Cart.STATES.SHOPPING] = {                                                                        // 22
      _onEnter: function () {                                                                                        // 23
        Mart.Carts.update(this._._id, { $set: { state: Mart.Cart.STATES.SHOPPING } });                               // 24
      },                                                                                                             //
      "submitCart": Mart.Cart.STATES.WAITING_CART_ACCEPTANCE,                                                        // 26
      _onExit: function () {                                                                                         // 27
        // create new cart?                                                                                          //
      }                                                                                                              //
    };                                                                                                               //
                                                                                                                     //
    ///////////////////                                                                                              //
    // WAITING CART ACCEPTANCE                                                                                       //
    ///////////////////                                                                                              //
    fsm.states[Mart.Cart.STATES.WAITING_CART_ACCEPTANCE] = {                                                         // 35
      _onEnter: function () {                                                                                        // 36
        Mart.Carts.update(this._._id, { $set: {                                                                      // 37
            state: Mart.Cart.STATES.WAITING_CART_ACCEPTANCE,                                                         // 38
            cartAcceptedAt: new Date()                                                                               // 39
          } });                                                                                                      //
                                                                                                                     //
        var serviceFeePct = Mart.SERVICE_FEE_PCT;                                                                    // 42
        var taxPct = Mart.TAX_PCT;                                                                                   // 43
                                                                                                                     //
        // Whenever object is accessed, this will be called w/ no arguments                                          //
        if (!!connectionFeePct && !!serviceFeePct && !!taxPct) {                                                     // 46
          var subtotal = this._.subtotal();                                                                          // 47
          var connectionFee = this._.connectionFee();                                                                // 48
          var merchantCut = Math.ceil(subtotal - connectionFee);                                                     // 49
          var serviceFee = Math.floor(serviceFeePct * subtotal);                                                     // 50
          var tax = Math.floor(taxPct * (subtotal + serviceFee));                                                    // 51
                                                                                                                     //
          Mart.Carts.update(this._._id, { $set: {                                                                    // 53
              state: Mart.Cart.STATES.WAITING_CART_ACCEPTANCE,                                                       // 54
              connectionFee: connectionFee,                                                                          // 55
              merchantCut: merchantCut,                                                                              // 56
              serviceFee: serviceFee,                                                                                // 57
              tax: tax                                                                                               // 58
            } });                                                                                                    //
        }                                                                                                            //
      },                                                                                                             //
      "rejectCart": Mart.Cart.STATES.CANCELLED_BY_MERCHANT,                                                          // 62
      "makePayment": Mart.Cart.STATES.MAKING_PAYMENT,                                                                // 63
      _onExit: function () {}                                                                                        // 64
    };                                                                                                               //
                                                                                                                     //
    ///////////////////                                                                                              //
    // MAKING PAYMENT                                                                                                //
    ///////////////////                                                                                              //
    fsm.states[Mart.Cart.STATES.MAKING_PAYMENT] = {                                                                  // 71
      _onEnter: function () {                                                                                        // 72
        Mart.Carts.update(this._._id, { $set: { state: Mart.Cart.STATES.MAKING_PAYMENT } });                         // 73
        var Stripe = StripeAPI(Meteor.settings.STRIPE_SECRET_KEY);                                                   // 74
        var charge = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges);                                        // 75
                                                                                                                     //
        var chargeDetails = {                                                                                        // 77
          amount: this._.total(),                                                                                    // 78
          currency: 'usd'                                                                                            // 79
        };                                                                                                           //
                                                                                                                     //
        if (!!this._.cardId) {                                                                                       // 82
          var card = Mart.Cards.findOne(this._.cardId);                                                              // 83
          var cardToken = card.gatewayToken;                                                                         // 84
          var customer = Mart.GatewayTypes.Stripe.Customers.findOne({ userId: this._.userId });                      // 85
                                                                                                                     //
          _.extend(chargeDetails, {                                                                                  // 87
            source: cardToken,                                                                                       // 88
            customer: customer.stripeToken                                                                           // 89
          });                                                                                                        //
        } else if (!!this._.cardToken) {                                                                             //
          _.extend(chargeDetails, {                                                                                  // 92
            source: this._.cardToken                                                                                 // 93
          });                                                                                                        //
        }                                                                                                            //
                                                                                                                     //
        try {                                                                                                        // 97
          var resp = charge(chargeDetails);                                                                          // 98
          Mart.Carts.update(this._._id, { $set: {                                                                    // 99
              paymentAt: new Date(),                                                                                 // 100
              paymentConfirmation: resp.id,                                                                          // 101
              paymentAmount: resp.amount                                                                             // 102
            } });                                                                                                    //
          this.handle('requestTransferAcceptance');                                                                  // 104
        } catch (error) {                                                                                            //
          console.log(error.message);                                                                                // 106
          this.handle('failPayment');                                                                                // 107
        }                                                                                                            //
      },                                                                                                             //
      "requestTransferAcceptance": Mart.Cart.STATES.WAITING_TRANSFER_ACCEPTANCE,                                     // 110
      "failPayment": Mart.Cart.STATES.CANCELLED_BY_PAYMENT,                                                          // 111
      _onExit: function () {}                                                                                        // 112
    };                                                                                                               //
                                                                                                                     //
    ///////////////////                                                                                              //
    // WAITING TRANSFER ACCEPTANCE                                                                                   //
    ///////////////////                                                                                              //
    fsm.states[Mart.Cart.STATES.WAITING_TRANSFER_ACCEPTANCE] = {                                                     // 120
      _onEnter: function () {                                                                                        // 121
        Mart.Carts.update(this._._id, { $set: { state: Mart.Cart.STATES.WAITING_TRANSFER_ACCEPTANCE } });            // 122
      },                                                                                                             //
      "processTransfer": Mart.Cart.STATES.PROCESSING_TRANSFER,                                                       // 124
      _onExit: function () {}                                                                                        // 125
    };                                                                                                               //
                                                                                                                     //
    ///////////////////                                                                                              //
    // PROCESSING TRANSFER                                                                                           //
    ///////////////////                                                                                              //
    fsm.states[Mart.Cart.STATES.PROCESSING_TRANSFER] = {                                                             // 132
      _onEnter: function () {                                                                                        // 133
        Mart.Carts.update(this._._id, { $set: {                                                                      // 134
            state: Mart.Cart.STATES.PROCESSING_TRANSFER,                                                             // 135
            transferAcceptedAt: new Date()                                                                           // 136
          } });                                                                                                      //
        var Stripe = StripeAPI(Meteor.settings.STRIPE_SECRET_KEY);                                                   // 138
                                                                                                                     //
        var transfer = Meteor.wrapAsync(Stripe.transfers.create, Stripe.transfers);                                  // 140
                                                                                                                     //
        // Currently assuming that all items in cart belong to the same merchant                                     //
        var firstStorefront = getFirstStorefront(this._._id);                                                        // 143
        var managedAccount = Mart.GatewayTypes.Stripe.ManagedAccounts.findOne({                                      // 144
          userId: firstStorefront.userId                                                                             // 145
        });                                                                                                          //
                                                                                                                     //
        if (!!managedAccount) {                                                                                      // 148
          try {                                                                                                      // 149
            // Make the transfer                                                                                     //
            var result = transfer({                                                                                  // 151
              amount: this._.merchantCut,                                                                            // 152
              currency: "usd",                                                                                       // 153
              destination: managedAccount.stripeToken,                                                               // 154
              description: "Transfer for cart " + this._._id                                                         // 155
            });                                                                                                      //
                                                                                                                     //
            // Update the cart                                                                                       //
            Mart.Carts.update(this._._id, { $set: {                                                                  // 159
                transferredAt: new Date(),                                                                           // 160
                transferAcceptedByAdminId: Meteor.userId(),                                                          // 161
                transferConfirmation: result.id,                                                                     // 162
                transferAmount: result.amount,                                                                       // 163
                transferredToManagedAccountId: managedAccount._id                                                    // 164
              } });                                                                                                  //
                                                                                                                     //
            this.handle('settle');                                                                                   // 167
          } catch (error) {                                                                                          //
            console.log(error.message);                                                                              // 169
            throw new Meteor.Error("stripe-transfer-error", error.message);                                          // 170
          }                                                                                                          //
        } else {                                                                                                     //
          var msg = "Could not find a managed account for this cart";                                                // 173
          throw new Meteor.Error("carts-state-processing-transfer", msg);                                            // 174
        }                                                                                                            //
      },                                                                                                             //
      "settle": Mart.Cart.STATES.SETTLED,                                                                            // 178
      "failTransfer": Mart.Cart.STATES.WAITING_TRANSFER_ACCEPTANCE,                                                  // 179
      _onExit: function () {                                                                                         // 180
        //                                                                                                           //
      }                                                                                                              //
    };                                                                                                               //
                                                                                                                     //
    ///////////////////                                                                                              //
    // SETTLED                                                                                                       //
    ///////////////////                                                                                              //
    fsm.states[Mart.Cart.STATES.SETTLED] = {                                                                         // 188
      _onEnter: function () {                                                                                        // 189
        Mart.Carts.update(this._._id, { $set: {                                                                      // 190
            state: Mart.Cart.STATES.SETTLED,                                                                         // 191
            settledAt: new Date()                                                                                    // 192
          } });                                                                                                      //
      },                                                                                                             //
      _onExit: function () {                                                                                         // 195
        //                                                                                                           //
      }                                                                                                              //
    };                                                                                                               //
                                                                                                                     //
    ///////////////////                                                                                              //
    // Cancelled BY MERCHANT                                                                                         //
    ///////////////////                                                                                              //
    fsm.states[Mart.Cart.STATES.CANCELLED_BY_MERCHANT] = {                                                           // 203
      _onEnter: function () {                                                                                        // 204
        Mart.Carts.update(this._._id, { $set: { state: Mart.Cart.STATES.CANCELLED_BY_MERCHANT } });                  // 205
      },                                                                                                             //
      _onExit: function () {                                                                                         // 207
        //                                                                                                           //
      }                                                                                                              //
    };                                                                                                               //
                                                                                                                     //
    ///////////////////                                                                                              //
    // Cancelled BY PAYMENT                                                                                          //
    ///////////////////                                                                                              //
    fsm.states[Mart.Cart.STATES.CANCELLED_BY_PAYMENT] = {                                                            // 215
      _onEnter: function () {                                                                                        // 216
        Mart.Carts.update(this._._id, { $set: { state: Mart.Cart.STATES.CANCELLED_BY_PAYMENT } });                   // 217
      },                                                                                                             //
      _onExit: function () {                                                                                         // 219
        //                                                                                                           //
      }                                                                                                              //
    };                                                                                                               //
                                                                                                                     //
    ///////////////////                                                                                              //
    // Cancelled BY ADMIN                                                                                            //
    ///////////////////                                                                                              //
    fsm.states[Mart.Cart.STATES.CANCELLED_BY_ADMIN] = {                                                              // 227
      _onEnter: function () {                                                                                        // 228
        Mart.Carts.update(this._._id, { $set: { state: Mart.Cart.STATES.CANCELLED_BY_ADMIN } });                     // 229
      },                                                                                                             //
      _onExit: function () {                                                                                         // 231
        //                                                                                                           //
      }                                                                                                              //
    };                                                                                                               //
                                                                                                                     //
    return new machina.Fsm(fsm);                                                                                     // 236
  },                                                                                                                 //
  submitCart: function () {                                                                                          // 238
    this.machina().handle('submitCart');                                                                             // 239
  },                                                                                                                 //
  rejectCart: function () {                                                                                          // 241
    this.machina().handle('rejectCart');                                                                             // 242
  },                                                                                                                 //
  makePayment: function () {                                                                                         // 244
    this.machina().handle('makePayment');                                                                            // 245
  },                                                                                                                 //
  processTransfer: function () {                                                                                     // 247
    this.machina().handle('processTransfer');                                                                        // 248
  }                                                                                                                  //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/bank-accounts/bank-accounts-server.js                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.publish("mart/bank-accounts", function () {                                                                   // 1
  return Mart.BankAccounts.find({ userId: this.userId });                                                            // 2
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/gateways/stripe/stripe-customers.js                                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.GatewayTypes.Stripe.Customers = new Mongo.Collection("MartStripeCustomers");                                    // 1
                                                                                                                     //
Mart.GatewayTypes.Stripe.Customers.attachSchema(new SimpleSchema({                                                   // 3
  userId: {                                                                                                          // 4
    type: String,                                                                                                    // 5
    autoValue: function () {                                                                                         // 6
      return this.userId;                                                                                            // 7
    }                                                                                                                //
  },                                                                                                                 //
  stripeToken: {                                                                                                     // 10
    type: String                                                                                                     // 11
  }                                                                                                                  //
}));                                                                                                                 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/gateways/stripe/stripe-managed-accounts.js                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Mart.GatewayTypes.Stripe.ManagedAccounts = new Mongo.Collection("MartStripeManagedAccounts");                        // 1
Mart.GatewayTypes.Stripe.ManagedAccounts.attachSchema(new SimpleSchema({                                             // 2
  userId: {                                                                                                          // 3
    type: String,                                                                                                    // 4
    autoValue: function () {                                                                                         // 5
      return this.userId;                                                                                            // 6
    }                                                                                                                //
  },                                                                                                                 //
  stripeToken: {                                                                                                     // 9
    type: String                                                                                                     // 10
  },                                                                                                                 //
  stripePublicKey: {                                                                                                 // 12
    type: String                                                                                                     // 13
  },                                                                                                                 //
  stripePrivateKey: {                                                                                                // 15
    type: String                                                                                                     // 16
  },                                                                                                                 //
  isLegalEntityVerified: {                                                                                           // 18
    type: Boolean                                                                                                    // 19
  },                                                                                                                 //
  isAccountVerified: {                                                                                               // 21
    type: Boolean                                                                                                    // 22
  },                                                                                                                 //
  dobDay: {                                                                                                          // 24
    type: Number,                                                                                                    // 25
    optional: true                                                                                                   // 26
  },                                                                                                                 //
  dobMonth: {                                                                                                        // 28
    type: Number,                                                                                                    // 29
    optional: true                                                                                                   // 30
  },                                                                                                                 //
  dobYear: {                                                                                                         // 32
    type: Number,                                                                                                    // 33
    optional: true                                                                                                   // 34
  },                                                                                                                 //
  firstName: {                                                                                                       // 36
    type: String,                                                                                                    // 37
    optional: true                                                                                                   // 38
  },                                                                                                                 //
  lastName: {                                                                                                        // 40
    type: String,                                                                                                    // 41
    optional: true                                                                                                   // 42
  },                                                                                                                 //
  legalEntityType: {                                                                                                 // 44
    type: String,                                                                                                    // 45
    optional: true                                                                                                   // 46
  }                                                                                                                  //
}));                                                                                                                 //
                                                                                                                     //
Meteor.methods({                                                                                                     // 50
  "mart/stripe/verify": function (details) {                                                                         // 51
    var Stripe = StripeAPI(Mart.STRIPE_SECRET_KEY);                                                                  // 52
    var managedAccount = Mart.GatewayTypes.Stripe.ManagedAccounts.findOne({ userId: Meteor.userId() });              // 53
    var updateAccount = Meteor.wrapAsync(Stripe.accounts.update, Stripe.accounts);                                   // 54
    try {                                                                                                            // 55
      // Create on Stripe                                                                                            //
      var result = updateAccount(managedAccount.stripeToken, _.extend(details, {                                     // 57
        tos_acceptance: {                                                                                            // 58
          date: Meteor.user().termsAcceptedAt,                                                                       // 59
          ip: Meteor.user().termsAcceptedIP                                                                          // 60
        }                                                                                                            //
      }));                                                                                                           //
                                                                                                                     //
      return result.transfers_enabled;                                                                               // 64
    } catch (error) {                                                                                                //
      throw new Meteor.Error("stripe-managed-account-create-error", error.message);                                  // 66
    }                                                                                                                //
  }                                                                                                                  //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/carts/carts-methods.js                                                                   //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
  'mart/submit-carts': function (options) {                                                                          // 2
    check(options, {                                                                                                 // 3
      cardId: Match.Optional(String),                                                                                // 4
      cardTokens: Match.Optional([String]),                                                                          // 5
      contactName: String,                                                                                           // 6
      contactEmail: String,                                                                                          // 7
      contactPhone: String,                                                                                          // 8
      contactEntity: String,                                                                                         // 9
      guestId: Match.Optional(String)                                                                                // 10
    });                                                                                                              //
                                                                                                                     //
    // Get selector for user or guest                                                                                //
    var userGuestSelector;                                                                                           // 14
    if (!!Meteor.userId()) {                                                                                         // 15
      userGuestSelector = { userId: Meteor.userId() };                                                               // 16
    } else if (!!options.guestId) {                                                                                  //
      userGuestSelector = { guestId: options.guestId };                                                              // 18
    } else {                                                                                                         //
      throw new Meteor.Error('invalid-guest', "User not logged in and did not provide a guest ID while trying to check out.");
    }                                                                                                                //
                                                                                                                     //
    // Ensure card belongs to the person trying to checkout                                                          //
    var cardSelector = _.extend({ _id: options.cardId }, userGuestSelector);                                         // 24
    var card = Mart.Cards.findOne(cardSelector);                                                                     // 25
    if (!!card) {                                                                                                    // 26
      var shoppingCartsSelector = _.extend({ state: Mart.Cart.STATES.SHOPPING }, userGuestSelector);                 // 27
      var shoppingCarts = Mart.Carts.find(shoppingCartsSelector);                                                    // 28
                                                                                                                     //
      // Submit each cart individually to respective Merchants                                                       //
      if (shoppingCarts.count() > 0) {                                                                               // 31
        _.each(shoppingCarts.fetch(), function (shoppingCart) {                                                      // 32
          Mart.Carts.update(shoppingCart._id, { $set: options });                                                    // 33
          Meteor.call("mart/submit-cart", shoppingCart._id);                                                         // 34
        });                                                                                                          //
                                                                                                                     //
        return true;                                                                                                 // 37
      }                                                                                                              //
    } else if (!!options.cardTokens) {                                                                               //
      var cardTokens = options.cardTokens;                                                                           // 40
      delete options.cardTokens;                                                                                     // 41
      var shoppingCartsSelector = _.extend({ state: Mart.Cart.STATES.SHOPPING }, userGuestSelector);                 // 42
      var shoppingCarts = Mart.Carts.find(shoppingCartsSelector);                                                    // 43
                                                                                                                     //
      // Submit each cart individually to respective Merchants with a different card token                           //
      if (shoppingCarts.count() > 0) {                                                                               // 46
        shoppingCarts = shoppingCarts.fetch();                                                                       // 47
        for (var i = 0; i < shoppingCarts.length; i++) {                                                             // 48
          var shoppingCart = shoppingCarts[i];                                                                       // 49
          Mart.Carts.update(shoppingCart._id, {                                                                      // 50
            $set: _.extend({ cardToken: cardTokens[i] }, options)                                                    // 51
          });                                                                                                        //
          Meteor.call("mart/submit-cart", shoppingCart._id);                                                         // 53
        }                                                                                                            //
                                                                                                                     //
        return true;                                                                                                 // 56
      }                                                                                                              //
    }                                                                                                                //
                                                                                                                     //
    throw new Meteor.Error('invalid-card', "Trying to checkout with a card that does not belong to user or guest.");
  },                                                                                                                 //
  'mart/submit-cart': function (cartId) {                                                                            // 62
    check(cartId, String);                                                                                           // 63
                                                                                                                     //
    if (canOpCartShopping(cartId)) {                                                                                 // 65
      var cart = Mart.Carts.findOne(cartId);                                                                         // 66
      cart.submitCart();                                                                                             // 67
      return cart._id;                                                                                               // 68
    }                                                                                                                //
                                                                                                                     //
    throw new Meteor.Error('invalid-cart', "Don't fuck with other people's carts");                                  // 71
  },                                                                                                                 //
  'mart/make-payment': function (cartId) {                                                                           // 73
    check(cartId, String);                                                                                           // 74
    if (canOpCartWaitingCartAcceptance(cartId)) {                                                                    // 75
      var cart = Mart.Carts.findOne(cartId);                                                                         // 76
      cart.makePayment();                                                                                            // 77
      return cart._id;                                                                                               // 78
    }                                                                                                                //
                                                                                                                     //
    throw new Meteor.Error(1, "");                                                                                   // 81
  },                                                                                                                 //
  'mart/process-transfer': function (cartId) {                                                                       // 83
    check(cartId, String);                                                                                           // 84
    if (Mart.isAdmin()) {                                                                                            // 85
      var cart = Mart.Carts.findOne(cartId);                                                                         // 86
      cart.processTransfer();                                                                                        // 87
      return cart._id;                                                                                               // 88
    }                                                                                                                //
                                                                                                                     //
    throw new Meteor.Error(1, "Only admins can process transfers");                                                  // 91
  },                                                                                                                 //
  'mart/reject-transfer': function (cartId) {}                                                                       // 93
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/images/images-publications.js                                                            //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.publish("mart/images/product", function (productId) {                                                         // 1
  check(productId, String);                                                                                          // 2
                                                                                                                     //
  var product = Mart.Products.findOne({                                                                              // 4
    _id: productId,                                                                                                  // 5
    isPublished: true,                                                                                               // 6
    isDeleted: false                                                                                                 // 7
  });                                                                                                                //
                                                                                                                     //
  if (product) return Mart.Images.find({ objectId: productId, objectCollection: "Products" });                       // 10
});                                                                                                                  //
                                                                                                                     //
Meteor.publish("mart/images/storefront", function (storefrontId) {                                                   // 14
  check(storefrontId, String);                                                                                       // 15
                                                                                                                     //
  var storefront = Mart.Storefronts.findOne({                                                                        // 17
    _id: storefrontId,                                                                                               // 18
    isPublished: true,                                                                                               // 19
    isDeleted: false                                                                                                 // 20
  });                                                                                                                //
                                                                                                                     //
  if (storefront) return Mart.Images.find({ objectId: storefrontId, objectCollection: "Storefronts" });              // 23
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/images/images-security.js                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Security.defineMethod("ownsObject", {                                                                                // 1
  fetch: [],                                                                                                         // 2
  transform: null,                                                                                                   // 3
  deny: function (type, arg, userId, doc, fields, modifier) {                                                        // 4
    if (!!userId) {                                                                                                  // 5
      var collection = doc.objectCollection;                                                                         // 6
      var objectId = doc.objectId;                                                                                   // 7
      if (Roles.userIsInRole(userId, [Mart.ROLES.GLOBAL.MERCHANT], Mart.ROLES.GROUPS.GLOBAL)) {                      // 8
                                                                                                                     //
        if (collection === "Storefronts") {                                                                          // 13
          var storefront = Mart.Storefronts.findOne({                                                                // 14
            _id: objectId,                                                                                           // 15
            userId: userId                                                                                           // 16
          });                                                                                                        //
                                                                                                                     //
          return !storefront;                                                                                        // 19
        } else if (collection === "Products") {                                                                      //
          var product = Mart.Products.findOne(objectId);                                                             // 21
                                                                                                                     //
          if (!!product) {                                                                                           // 23
            var storefront = Mart.Storefronts.findOne({                                                              // 24
              _id: product.storefrontId,                                                                             // 25
              userId: userId                                                                                         // 26
            });                                                                                                      //
                                                                                                                     //
            return !storefront;                                                                                      // 29
          }                                                                                                          //
        }                                                                                                            //
      }                                                                                                              //
    }                                                                                                                //
                                                                                                                     //
    return true;                                                                                                     // 36
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Mart.Images.permit(['insert', 'update']).ownsObject().apply();                                                       // 40
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/storefronts/server/storefronts-methods.js                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
  'mart/storefront/publish': function (storefrontId) {                                                               // 2
    // console.log('mart/storefront/publish');                                                                       //
    check(storefrontId, String);                                                                                     // 4
                                                                                                                     //
    // make sure user has edit permission                                                                            //
    var operationAllowed = Security.can(Meteor.userId()).update(storefrontId, { $set: { isPublished: true } })["for"](Mart.Storefronts).check();
                                                                                                                     //
    if (operationAllowed) {                                                                                          // 11
      // if store has at least one published product                                                                 //
      var publishedProduct = Mart.Products.findOne({                                                                 // 13
        storefrontId: storefrontId,                                                                                  // 14
        isPublished: true,                                                                                           // 15
        isDeleted: false                                                                                             // 16
      });                                                                                                            //
                                                                                                                     //
      if (!!publishedProduct) {                                                                                      // 19
        Mart.Storefronts.update(storefrontId, { $set: { isPublished: true } }, { getAutoValues: false });            // 20
      } else {                                                                                                       //
        throw new Meteor.Error(Mart.Errors.CANNOT_PUBLISH, "There must be at least one published product first.");   // 24
      }                                                                                                              //
    } else {                                                                                                         //
      throw new Meteor.Error(Mart.Errors.UNAUTHORIZED, "You are not allowed to do that.");                           // 27
    }                                                                                                                //
  }                                                                                                                  //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/products/products-methods.js                                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
  'mart/product/publish': function (productId) {                                                                     // 2
    check(productId, String);                                                                                        // 3
                                                                                                                     //
    var product = Mart.Products.findOne(productId);                                                                  // 5
    if (!product) throw new Meteor.Error(Mart.Errors.UNAUTHORIZED, "You are not allowed to do that.");               // 6
                                                                                                                     //
    // make sure user has edit permission                                                                            //
    var operationAllowed = Security.can(Meteor.userId()).update(product, { $set: { isPublished: true } })["for"](Mart.Products).check();
                                                                                                                     //
    if (operationAllowed) {                                                                                          // 14
      // all prices set                                                                                              //
      _.each(Mart.Product._UNITS(), function (unit) {                                                                // 16
        var price = Mart.Prices.findOne({                                                                            // 17
          productId: productId,                                                                                      // 18
          unit: unit                                                                                                 // 19
        });                                                                                                          //
                                                                                                                     //
        if (!price) {                                                                                                // 22
          throw new Meteor.Error(Mart.Errors.CANNOT_PUBLISH, "You must give this product prices in all units.");     // 23
        }                                                                                                            //
      });                                                                                                            //
                                                                                                                     //
      return Mart.Products.update(productId, { $set: { isPublished: true } }, { getAutoValues: false });             // 27
    } else {                                                                                                         //
      throw new Meteor.Error(Mart.Errors.UNAUTHORIZED, "You are not allowed to do that.");                           // 32
    }                                                                                                                //
  }                                                                                                                  //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/marvin_mart/lib/prices/prices-publications.js                                                            //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.publish("mart/prices", function (productId) {                                                                 // 1
  console.log(productId);                                                                                            // 2
  check(productId, String);                                                                                          // 3
                                                                                                                     //
  var cursor = Mart.Prices.find({ productId: productId });                                                           // 5
  var product = Mart.Products.findOne(productId);                                                                    // 6
  if (!product) return;                                                                                              // 7
                                                                                                                     //
  var storefront = Mart.Storefronts.findOne({                                                                        // 10
    _id: product.storefrontId,                                                                                       // 11
    isDeleted: false                                                                                                 // 12
  });                                                                                                                //
  if (!storefront) return;                                                                                           // 14
                                                                                                                     //
  if (Mart._isAdmin(this.userId)) {                                                                                  // 17
    return cursor;                                                                                                   // 18
  } else if (Mart._isRep(this.userId)) {                                                                             //
    if (this.userId === storefront.repId) return cursor;                                                             // 21
  } else if (Mart._isMerchant(this.userId)) {                                                                        //
    if (this.userId === storefront.userId) return cursor;                                                            // 25
  }                                                                                                                  //
                                                                                                                     //
  var storefront = Mart.Storefronts.findOne({                                                                        // 29
    _id: product.storefrontId,                                                                                       // 30
    isDeleted: false,                                                                                                // 31
    isPublished: true                                                                                                // 32
  });                                                                                                                //
                                                                                                                     //
  if (storefront) {                                                                                                  // 35
    return cursor;                                                                                                   // 36
  }                                                                                                                  //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['marvin:mart'] = {
  Mart: Mart
};

})();

//# sourceMappingURL=marvin_mart.js.map
