AdminSettings = new Mongo.Collection("adminSettings");
validAdminSettings = ["stripeAPIKey"]

AdminSettings.allow({
  insert: function(userId, adminSetting) {
    return false
  },
  update: function(userId, adminSetting) {
    // Only admins can update admin settings
    if(!isAdmin(Meteor.userId()))
      return false;

    // Cannot create custom admin settings
    return isValidAdminSetting(adminSetting);
  },
  remove: function() {
    return false;
  }
});

// Currently all logged in users are admin
isAdmin = function(userId) {
  return userId != undefined
}

isValidAdminSetting = function(adminSetting) {
  return  _.contains(validAdminSettings, adminSetting.key);
}
