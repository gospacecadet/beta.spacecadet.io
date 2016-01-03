Meteor.startup(function() {
  // Mart.Storefronts.remove({})
  // Meteor.users.remove({})
  //
  // SpaceCadetMigration.migrateStations()

  createTestAccounts()
});

var createTestAccounts = function() {
  var merchant = {
    email: "rubetube@gmail.com",
    password: "password"
  }

  if(!Meteor.users.findOne({"emails.address": "rubetube@gmail.com"})) {
    var userId = Accounts.createUser(merchant);
    Roles.addUsersToRoles(userId, [Mart.ROLES.GLOBAL.MERCHANT], Mart.ROLES.GROUPS.GLOBAL);
  }
}
