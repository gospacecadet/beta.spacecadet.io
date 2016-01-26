var credentials

_.extend(Migrator, {
  migrateMerchants: function(shouldSendEmail) {
    if(AlphaToBetaMigrations.find().count() === 0) {
      console.log("Migration started...");
      credentials = []

      migrationId = AlphaToBetaMigrations.insert({
        startedAt: new Date()
      })

      // Migrate Users and Properties
      _.each(Migrator.ImportedStations.find().fetch(), function(station) {
        console.log('Migrating ' + station.name);
        var merchantId = createNewUser(station.userId, station.name)
        var propertyId = createStorefront(station, merchantId)
      })

      // Migrate Spaces
      _.each(Migrator.ImportedPads.find().fetch(), function(pad) {
        var spaceId = createProduct(pad)
      })

      AlphaToBetaMigrations.update(migrationId, {$set: {
        endedAt: new Date()
      }})

      if(shouldSendEmail)
        sendEmail()

      console.log("Migration complete.");
    } else {
      console.log("Migration skipped.");
    }
  },
  _resetMigrationLog: function() {
    AlphaToBetaMigrations.remove({})
  },
  __reset: function() {
    AlphaToBetaMigrations.remove({})
    MartBankAccounts.remove({})
    Mart.Cards.remove({})
    Mart.Carts.remove({})
    Mart.Images.remove({})
    Mart.LineItems.remove({})
    Mart.Prices.remove({})
    Mart.Products.remove({})
    Mart.Storefronts.remove({})
    Mart.Products.remove({})
    Meteor.users.remove({})
  }
})

var sendEmail = function() {
  var migration = AlphaToBetaMigrations.findOne()
  var numMigrations = AlphaToBetaMigrations.find().count()

  var text = "------------ THIS IS AN AUTOMATED MESSAGE -----------\n" +
    "Migration started at " + migration.startedAt +
    " and ended at " + migration.endedAt +
    ".\n\nUse the credentials below to log into each landord account and complete the migration by hand by entering prices and reuploading images."

  text = text + "\n\n_id,email,password,property name\n"

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
    subject: "[SC AUTOMATED INFO] SpaceCadet Migration Complete",
    text: text
  });
}

var createProduct = function(oldProduct) {
  var descWPrice = oldProduct.description + " ||| Imported Price: " + oldProduct.price
  var newProduct = {
    _id: oldProduct._id,
    name: oldProduct.name,
    description: descWPrice,
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
  var oldUser = Migrator.ImportedUsers.findOne(oldUserId)
  var password = Random.id()
  var email = oldUser.emails[0].address

  var existingUser = Meteor.users.findOne({emails: {$elemMatch: {address: email}}})

  if(!existingUser) {
    var cred = {
      email: oldUser.emails[0].address,
      password: password
    }
    console.log('creating new user');
    console.log(cred);

    var newUserId = Accounts.createUser(cred)
    console.log('created new user ' + newUserId);
    cred.propertyName = propertyName
    cred._id = newUserId

    Roles.addUsersToRoles(newUserId, [Mart.ROLES.GLOBAL.MERCHANT], Mart.ROLES.GROUPS.GLOBAL);

    AlphaToBetaUserMapping.insert({oldUserId: oldUserId, newUserId: newUserId})
    credentials.push(cred)
    return newUserId
  }

  return existingUser._id
}

var createStorefront = function(station, newUserId) {
  storefront = {
    _id: station._id,
    isPublished: (Meteor.settings.AUTO_PUBLISH === "true"),
    isDeleted: false,
    userId: newUserId,
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
