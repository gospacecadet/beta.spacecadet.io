(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var Random = Package.random.Random;
var _ = Package.underscore._;
var loremIpsum = Package['marvin:lorem-ipsum'].loremIpsum;
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
var Seed;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/seed/seed.js                                                                        //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
Seed = {                                                                                        // 1
  seed: function (options) {                                                                    // 2
    options = options || {};                                                                    // 3
    _.defaults(options, {                                                                       // 4
      numProperties: 20, // number of properties to create                                      // 5
      numSpaces: 5 });                                                                          // 6
                                                                                                //
    // number of spaces at each property to create                                              //
    for (var i = 0; i < options.numProperties; i++) {                                           // 9
      var propertyId = this.property();                                                         // 10
      var numPropertyImages = Seed.images("Storefronts", propertyId);                           // 11
                                                                                                //
      for (var j = 0; j < options.numSpaces; j++) {                                             // 13
        var spaceId = Seed.space(propertyId);                                                   // 14
        var numPrices = Seed.prices(spaceId);                                                   // 15
        var numSpaceImages = Seed.images("Products", spaceId);                                  // 16
      }                                                                                         //
    }                                                                                           //
  },                                                                                            //
  images: function (objectCollection, objectId) {                                               // 21
    // Site currently has copy saying up to four images, but this is an arbitraty limit         //
    var n = _.sample([1, 2, 3, 4]);                                                             // 23
    var i;                                                                                      // 24
                                                                                                //
    for (i = 0; i < n; i++) {                                                                   // 26
      Seed.image(objectCollection, objectId, i + 1);                                            // 27
    }                                                                                           //
                                                                                                //
    return i;                                                                                   // 30
  },                                                                                            //
  image: function (objectCollection, objectId, index) {                                         // 32
    Mart.Images.insert({                                                                        // 33
      objectCollection: objectCollection,                                                       // 34
      objectId: objectId,                                                                       // 35
      originalUrl: this.randOriginalUrl(),                                                      // 36
      optimizedUrl: this.randOptimizedUrl(),                                                    // 37
      thumbnailUrl: this.randThumbnailUrl(),                                                    // 38
      index: index                                                                              // 39
    });                                                                                         //
  },                                                                                            //
  atLeastOne: function (array) {                                                                // 42
    return _.sample(array, Seed.randLimit(array.length));                                       // 43
  },                                                                                            //
  prices: function (spaceId) {                                                                  // 45
    // select 1-3 units from list                                                               //
    var units = this.atLeastOne(['hour', 'day', 'month']);                                      // 47
    var i = 0;                                                                                  // 48
                                                                                                //
    _.each(units, function (unit) {                                                             // 50
      Seed.price(spaceId, unit);                                                                // 51
      i++;                                                                                      // 52
    });                                                                                         //
                                                                                                //
    return i;                                                                                   // 55
  },                                                                                            //
  price: function (spaceId, unit) {                                                             // 57
    return Mart.Prices.insert({                                                                 // 58
      unit: unit,                                                                               // 59
      priceInCents: this.randZip(),                                                             // 60
      productId: spaceId                                                                        // 61
    });                                                                                         //
  },                                                                                            //
  space: function (propertyId) {                                                                // 64
    return Mart.Products.insert({                                                               // 65
      storefrontId: propertyId,                                                                 // 66
      name: this.randName(),                                                                    // 67
      description: this.randDesc(),                                                             // 68
      isPublished: true,                                                                        // 69
      isDeleted: false,                                                                         // 70
      createdAt: new Date(),                                                                    // 71
      occupancy: this.rand(),                                                                   // 72
      size: this.rand() + "x" + this.rand()                                                     // 73
    }, { getAutoValues: false });                                                               //
  },                                                                                            //
  property: function () {                                                                       // 76
    var userId = this.user(Random.id() + "@spacecadet.io", [Mart.ROLES.GLOBAL.MERCHANT]);       // 77
                                                                                                //
    return Mart.Storefronts.insert({                                                            // 79
      name: this.randName(),                                                                    // 80
      description: this.randDesc(),                                                             // 81
      userId: userId,                                                                           // 82
      isPublished: true,                                                                        // 83
      isDeleted: false,                                                                         // 84
      address: this.randAddress(),                                                              // 85
      city: this.randCity(),                                                                    // 86
      state: this.randState(),                                                                  // 87
      zip: this.randZip(),                                                                      // 88
      createdAt: new Date()                                                                     // 89
    }, { getAutoValues: false });                                                               //
  },                                                                                            //
  user: function (email, roles) {                                                               // 92
    console.log("Creating email " + email);                                                     // 93
                                                                                                //
    var userDoc = {                                                                             // 95
      email: email,                                                                             // 96
      password: "password",                                                                     // 97
      profile: {                                                                                // 98
        firstName: this.randWord(),                                                             // 99
        lastName: this.randWord(),                                                              // 100
        companyName: this.randName()                                                            // 101
      }                                                                                         //
    };                                                                                          //
    var user = Meteor.users.findOne({ "emails.address": userDoc.email });                       // 104
    var userId;                                                                                 // 105
                                                                                                //
    if (!user) {                                                                                // 107
      userId = Accounts.createUser(userDoc);                                                    // 108
      Roles.addUsersToRoles(userId, roles, Mart.ROLES.GROUPS.GLOBAL);                           // 109
    } else {                                                                                    //
      userId = user._id;                                                                        // 111
    }                                                                                           //
                                                                                                //
    return userId;                                                                              // 114
  },                                                                                            //
  randWord: function () {                                                                       // 116
    return this.capitalize(loremIpsum({                                                         // 117
      count: 1,                                                                                 // 118
      units: 'words'                                                                            // 119
    }));                                                                                        //
  },                                                                                            //
  randName: function () {                                                                       // 122
    return this.capitalize(loremIpsum({                                                         // 123
      count: 3,                                                                                 // 124
      units: 'words'                                                                            // 125
    }));                                                                                        //
  },                                                                                            //
  randDesc: function () {                                                                       // 128
    return loremIpsum({                                                                         // 129
      count: 1, // Number of words, sentences, or paragraphs to generate.                       // 130
      units: 'paragraphs', // Generate words, sentences, or paragraphs.                         // 131
      sentenceLowerBound: 5, // Minimum words per sentence.                                     // 132
      sentenceUpperBound: 15, // Maximum words per sentence.                                    // 133
      paragraphLowerBound: 1, // Minimum sentences per paragraph.                               // 134
      paragraphUpperBound: 4 });                                                                // 135
  },                                                                                            //
  // Maximum sentences per paragraph.                                                           //
  rand: function () {                                                                           // 138
    return parseInt(Random.fraction() * 1000);                                                  // 139
  },                                                                                            //
  randAddress: function () {                                                                    // 141
    return this.rand() + " " + this.randName() + " " + _.sample(addressEndings);                // 142
  },                                                                                            //
  capitalize: function (s) {                                                                    // 144
    return s.charAt(0).toUpperCase() + s.slice(1);                                              // 145
  },                                                                                            //
  randCity: function () {                                                                       // 147
    return _.sample(cities);                                                                    // 148
  },                                                                                            //
  randState: function () {                                                                      // 150
    return _.sample(states);                                                                    // 151
  },                                                                                            //
  randZip: function () {                                                                        // 153
    return parseInt(Random.fraction() * 100000);                                                // 154
  },                                                                                            //
  randLimit: function (limit) {                                                                 // 156
    return parseInt(Random.fraction() * limit) + 1;                                             // 157
  },                                                                                            //
  randOptimizedUrl: function () {                                                               // 159
    return _.sample(optimizedUrls);                                                             // 160
  },                                                                                            //
  randOriginalUrl: function () {                                                                // 162
    return _.sample(originalUrls);                                                              // 163
  },                                                                                            //
  randThumbnailUrl: function () {                                                               // 165
    return _.sample(thumbnailUrls);                                                             // 166
  }                                                                                             //
};                                                                                              //
                                                                                                //
var addressEndings = ['Rd.', 'St.', 'Ave.', "Pkwy.", "Ct.", 'Blvd.'];                           // 170
var cities = ["New Orleans", "San Antonio", "Silver Spring", "Austin", "Houston", "Cambridge"];
var states = ['MD', "LA", "TX", "DC"];                                                          // 172
                                                                                                //
var thumbnailUrls = ["http://s3.amazonaws.com/local.beta.spacecadet.io/stations/7gB37vKSjzuSbpPxB/thumbnail/1.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/thumbnail/1.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/thumbnail/2.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/euRLLGs2PwEiiifAW/thumbnail/1.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/NivAY6bSKyZR9ayoJ/thumbnail/1.jpg"];
                                                                                                //
var optimizedUrls = ["http://s3.amazonaws.com/local.beta.spacecadet.io/stations/7gB37vKSjzuSbpPxB/optimized/1.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/optimized/1.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/optimized/2.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/euRLLGs2PwEiiifAW/optimized/1.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/NivAY6bSKyZR9ayoJ/optimized/1.jpg"];
                                                                                                //
var originalUrls = ["http://s3.amazonaws.com/local.beta.spacecadet.io/stations/7gB37vKSjzuSbpPxB/original/1.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/original/1.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/original/2.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/euRLLGs2PwEiiifAW/original/1.jpg", "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/NivAY6bSKyZR9ayoJ/original/1.jpg"];
//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.seed = {
  Seed: Seed
};

})();

//# sourceMappingURL=seed.js.map
