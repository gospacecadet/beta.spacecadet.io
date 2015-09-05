Meteor.startup(function() {
 if (Meteor.users.find().count() == 0) {
   var users = [
     { name:"Normal User",email:"user@spacecadet.io",roles:[], password: "password" },
     { name:"Landlord",email:"landlord@spacecadet.io",roles:['landlord'], password: "password" }
   ];

   _.each(users, function (user) {
     var id = Accounts.createUser({
       email: user.email,
       password: user.password,
       profile: { name: user.name }
     });

     if (user.roles.length > 0) {
       Roles.addUsersToRoles(id, user.roles);
     }
   });
 };
});