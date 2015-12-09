Slingshot.createDirective("storefrontImages", Slingshot.S3Storage, {
  bucket: "local.beta.spacecadet.io",

  acl: "public-read",

  authorize: function () {
    if (!Security.can(this.userId).insert({}).for(Mart.Storefronts).check()) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {
    //Store file into a directory by the user's username.
    var user = Meteor.users.findOne(this.userId);
    return user.username + "/" + file.name;
  }
});
