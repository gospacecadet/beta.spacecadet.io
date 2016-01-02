SpaceCadetMigration = {
  migrateStations: function() {
    if(Mart.Storefronts.find().count() === 0) {
      _.each(stations, function(details) {
        var merchantId = createUser(details.merchant)
        var stationId = createStorefront(details.station, merchantId)
      })
    }
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
    createdAt: new Date(),
    name: storefront.name,
    description: storefront.description,
    address: storefront.address,
    city: storefront.city,
    state: storefront.state,
    zip: storefront.zip,
  }

  return Mart.Storefronts.insert(storefront, {getAutoValues: false})
}
