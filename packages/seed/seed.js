Seed = {
  seedAdmins: function() {
    var adminEmails = [
      'marvinmarnold@gmail.com',
      'steven@spacecadet.io',
      'robert@spacecadet.io'
    ]

    _.each(adminEmails, function(email) {
      var admin = {
        email: email,
        password: Meteor.settings.DEFAULT_ADMIN_PASSWORD
      }

      if(!Meteor.users.findOne({"emails.address": email})) {
        var userId = Accounts.createUser(admin);
        Roles.addUsersToRoles(userId, [Mart.ROLES.GLOBAL.ADMIN], Mart.ROLES.GROUPS.GLOBAL);
      }
    })
  },
  // Properties with random Lorem Ipsum
  seedIpsum: function(options) {
    options = options || {}
    _.defaults(options, {
      numProperties: 20, // number of properties to create
      numSpaces: 5, // number of spaces at each property to create
    })

    for(let i=0; i<options.numProperties; i++) {
      var propertyId = this.property()
      var numPropertyImages = Seed.images("Storefronts", propertyId)

      for(let j=0; j<options.numSpaces; j++) {
        var spaceId = Seed.space(propertyId)
        var numPrices = Seed.prices(spaceId)
        var numSpaceImages = Seed.images("Products", spaceId)
      }

    }
   },
  images: function(objectCollection, objectId) {
    // Site currently has copy saying up to four images, but this is an arbitraty limit
    var n = _.sample([1, 2, 3, 4])
    var i

    for(i=0; i<n; i++) {
      Seed.image(objectCollection, objectId, i+1)
    }

    return i
  },
  image: function(objectCollection, objectId, index) {
    Mart.Images.insert({
      objectCollection: objectCollection,
      objectId: objectId,
      originalUrl: this.randOriginalUrl(),
      optimizedUrl: this.randOptimizedUrl(),
      thumbnailUrl: this.randThumbnailUrl(),
      index: index,
    })
  },
  atLeastOne: function(array) {
    return _.sample(array, Seed.randLimit(array.length))
  },
  prices: function(spaceId) {
    // select 1-3 units from list
    var units = this.atLeastOne(['hour', 'day', 'month'])
    var i = 0

    _.each(units, function(unit) {
      Seed.price(spaceId, unit)
      i++
    })

    return i
  },
  price: function(spaceId, unit) {
    return Mart.Prices.insert({
      unit: unit,
      priceInCents: this.randZip(),
      productId: spaceId
    })
  },
  space: function(propertyId) {
    return Mart.Products.insert({
      storefrontId: propertyId,
      name: this.randName(),
      description: this.randDesc(),
      isPublished: true,
      isDeleted: false,
      createdAt: new Date(),
      occupancy: this.rand(),
      size: this.rand() + "x" + this.rand()
    }, {getAutoValues: false})
  },
  property: function() {
    var userId = this.user(Random.id()+"@spacecadet.io" , [Mart.ROLES.GLOBAL.MERCHANT])

    return Mart.Storefronts.insert({
      name: this.randName(),
      description: this.randDesc(),
      userId: userId,
      isPublished: true,
      isDeleted: false,
      address: this.randAddress(),
      city: this.randCity(),
      state: this.randState(),
      zip: this.randZip(),
      createdAt: new Date()
    }, {getAutoValues: false})
  },
  user: function(email, roles) {
    console.log("Creating email " + email);

    var userDoc = {
      email: email,
      password: "password",
      profile: {
        firstName: this.randWord(),
        lastName: this.randWord(),
        companyName: this.randName()
      }
    }
    var user = Meteor.users.findOne({"emails.address": userDoc.email})
    var userId

    if(!user) {
      userId = Accounts.createUser(userDoc);
      Roles.addUsersToRoles(userId, roles, Mart.ROLES.GROUPS.GLOBAL);
    } else {
      userId = user._id
    }

    return userId
  },
  randWord: function() {
    return this.capitalize(loremIpsum({
      count: 1,
      units: 'words'
    }))
  },
  randName: function() {
    return this.capitalize(loremIpsum({
      count: 3,
      units: 'words'
    }))
  },
  randDesc: function() {
    return loremIpsum({
      count: 1,                      // Number of words, sentences, or paragraphs to generate.
      units: 'paragraphs',            // Generate words, sentences, or paragraphs.
      sentenceLowerBound: 5,         // Minimum words per sentence.
      sentenceUpperBound: 15,        // Maximum words per sentence.
      paragraphLowerBound: 1,        // Minimum sentences per paragraph.
      paragraphUpperBound: 4,        // Maximum sentences per paragraph.
    });
  },
  rand: function() {
    return parseInt(Random.fraction() * 1000)
  },
  randAddress: function() {
    return this.rand() + " " + this.randName() + " " + _.sample(addressEndings)
  },
  capitalize: function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  },
  randCity: function() {
    return _.sample(cities)
  },
  randState: function() {
    return _.sample(states)
  },
  randZip: function() {
    return parseInt(Random.fraction() * 100000)
  },
  randLimit: function(limit) {
    return parseInt(Random.fraction() * limit) + 1
  },
  randOptimizedUrl: function() {
    return _.sample(optimizedUrls)
  },
  randOriginalUrl: function() {
    return _.sample(originalUrls)
  },
  randThumbnailUrl: function() {
    return _.sample(thumbnailUrls)
  }
}

var addressEndings = ['Rd.', 'St.', 'Ave.', "Pkwy.", "Ct.", 'Blvd.']
var cities = ["New Orleans", "San Antonio", "Silver Spring", "Austin", "Houston", "Cambridge"]
var states = ['MD', "LA", "TX", "DC"]

var thumbnailUrls = [
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/7gB37vKSjzuSbpPxB/thumbnail/1.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/thumbnail/1.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/thumbnail/2.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/euRLLGs2PwEiiifAW/thumbnail/1.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/NivAY6bSKyZR9ayoJ/thumbnail/1.jpg",
]

var optimizedUrls = [
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/7gB37vKSjzuSbpPxB/optimized/1.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/optimized/1.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/optimized/2.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/euRLLGs2PwEiiifAW/optimized/1.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/NivAY6bSKyZR9ayoJ/optimized/1.jpg",
]

var originalUrls = [
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/7gB37vKSjzuSbpPxB/original/1.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/original/1.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/wcaZQQqwZ2njWkvD9/original/2.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/euRLLGs2PwEiiifAW/original/1.jpg",
  "http://s3.amazonaws.com/local.beta.spacecadet.io/stations/NivAY6bSKyZR9ayoJ/original/1.jpg",
]
