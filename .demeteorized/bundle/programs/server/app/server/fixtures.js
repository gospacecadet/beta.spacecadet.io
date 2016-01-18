(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/fixtures.js                                                  //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.startup(function () {                                           // 1
  Migrator.migrate();                                                  // 2
  // Migrator.forceMigrate()                                           //
  // createTestAccounts()                                              //
  if (Mart.Products.find().count() < 100) {                            // 5
    Seed.seed();                                                       // 6
  }                                                                    //
});                                                                    //
                                                                       //
var createTestAccounts = function () {                                 // 10
  var merchant = {                                                     // 11
    email: "rubetube@gmail.com",                                       // 12
    password: "password"                                               // 13
  };                                                                   //
                                                                       //
  if (!Meteor.users.findOne({ "emails.address": "rubetube@gmail.com" })) {
    var userId = Accounts.createUser(merchant);                        // 17
    Roles.addUsersToRoles(userId, [Mart.ROLES.GLOBAL.MERCHANT], Mart.ROLES.GROUPS.GLOBAL);
  }                                                                    //
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=fixtures.js.map
