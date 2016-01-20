Meteor.startup(function() {
  // Migrator.migrate()
  // Migrator.forceMigrate()
  createAdmins()
  if(Mart.Products.find().count() < 100) {
    Seed.seed()
  }
});

var createAdmins = function() {
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
}
