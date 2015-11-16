AdminSettings = new Mongo.Collection("adminSettings");
validAdminSettings = ["stripeAPIKey"]

AdminSettings.permit(['insert', 'update', 'remove']).never().apply();
AdminSettings.permit(['update']).ifLoggedIn().onlyProps(['value']).apply();

// Currently all logged in users are admin
isAdmin = function(userId) {
  return userId != undefined
}
