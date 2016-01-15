var credentials

_.extend(Migrator, {
  migrate: function() {
    if(Mart.Storefronts.find().count() === 0) {
      credentials = []

      // Migrate Users and Properties
      _.each(Migrator.ImportedStations.find().fetch(), function(station) {
        var merchantId = createNewUser(station.userId, station.name)
        var propertyId = createStorefront(station)
      })

      // Migrate Spaces
      _.each(Migrator.ImportedPads.find().fetch(), function(pad) {
        var spaceId = createProduct(pad)
      })

      sendEmail()
    }
  },
  forceMigrate: function() {
    Mart.Storefronts.remove({})
    Meteor.users.remove({})
    Mart.Images.remove({})
    Mart.Products.remove({})

    this.migrate()
  }
})

var sendEmail = function() {
  var text = "_id,email,password,property name\n"

  _.each(credentials, function(cred) {
    text = text +
      cred._id            + "," +
      cred.email          + "," +
      cred.password       + "," +
      cred.propertyName   + "\n"
  })

  Email.send({
    from: "SpaceCadet <do-not-reply@spacecadet.io>",
    to: Meteor.settings.EMAIL_RECIPIENTS,
    subject: "SpaceCadet Migration Complete",
    text: text
  });
}

var createProduct = function(oldProduct) {
  var newProduct = {
    _id: oldProduct._id,
    name: oldProduct.name,
    description: oldProduct.description,
    storefrontId: oldProduct.stationId,
    isPublished: (Meteor.settings.AUTO_PUBLISH === "true"),
    isDeleted: false,
    size: oldProduct.size,
    occupancy: oldProduct.occupancy
  }

  var newProductId = Mart.Products.insert(newProduct, {getAutoValues: false, validate: false})

  if(oldProduct.imagePath) {
    Mart.Images.insert({
      objectCollection: "Products",
      objectId: newProductId,
      index: 1,
      originalUrl: oldProduct.imagePath,
      optimizedUrl: oldProduct.imagePath,
      thumbnailUrl: oldProduct.imagePath
    }, {validate: false})
  }

  return newProductId
}

var createNewUser = function(oldUserId, propertyName) {
  var newUser = Meteor.users.findOne(oldUserId)

  if(!newUser) {
    var oldUser = Migrator.ImportedUsers.findOne(oldUserId)
    var cred = {
      _id: oldUserId,
      email: oldUser.emails[0].address,
      password: Random.id(),
    }

    var newUserId = Meteor.users.insert(cred);
    cred.propertyName = propertyName

    Roles.addUsersToRoles(newUserId, [Mart.ROLES.GLOBAL.MERCHANT], Mart.ROLES.GROUPS.GLOBAL);

    credentials.push(cred)
    return newUserId
  }

  return newUser._id
}

var createStorefront = function(station) {
  storefront = {
    _id: station._id,
    isPublished: (Meteor.settings.AUTO_PUBLISH === "true"),
    isDeleted: false,
    userId: station.userId,
    name: station.name,
    description: station.description,
    address: station.address,
    city: station.city,
    state: station.state,
    zip: station.zip,
    createdAt: new Date()
  }
  var storefrontId = Mart.Storefronts.insert(storefront, {getAutoValues: false, validate: false})

  var bannerPath = station.bannerPath
  var previewPath = station.previewPath || bannerPath
  bannerPath = bannerPath || previewPath

  if(bannerPath) {
    Mart.Images.insert({
      objectCollection: "Storefronts",
      objectId: storefrontId,
      index: 1,
      originalUrl: bannerPath,
      optimizedUrl: bannerPath,
      thumbnailUrl: previewPath
    })
  }


  return storefrontId
}
