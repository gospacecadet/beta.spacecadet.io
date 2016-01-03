SpaceCadetMigration = {
  migrateStations: function() {
    if(Mart.Storefronts.find().count() === 0) {
      _.each(stations, function(details) {
        var merchantId = createUser(details.merchant)
        var stationId = createStorefront(details.station, merchantId)

        _.each(details.landing_pads, function(landing_pad) {
          createProduct(_.extend({storefrontId: stationId}, landing_pad))
        })
      })
    }
  }
}

var createProduct = function(product) {
  product = {
    name: product.name,
    description: product.description,
    storefrontId: product.storefrontId,
    isPublished: true,
    isDeleted: false
  }
}

var createUser = function(user) {
  user = {
    email: user.email,
    password: user.password,
    profile: {
      contactFirstName: user.profile.firstName,
      contactLastName: user.profile.lastName,
      companyName: user.profile.entityName,
      phoneNumber: user.profile.phoneNumber,
    }
  }

  var userId = Accounts.createUser(user);
  Roles.addUsersToRoles(userId, [Mart.ROLES.GLOBAL.MERCHANT], Mart.ROLES.GROUPS.GLOBAL);

  return userId
}

var createStorefront = function(storefront, merchantId) {
  storefront = {
    isPublished: true,
    isDeleted: false,
    userId: merchantId,
    name: storefront.name,
    description: storefront.description,
    address: storefront.address,
    city: storefront.city,
    state: storefront.state,
    zip: storefront.zip,
    createdAt: new Date()
  }

  return Mart.Storefronts.insert(storefront, {getAutoValues: false})
}
