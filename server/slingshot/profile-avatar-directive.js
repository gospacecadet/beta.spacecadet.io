Slingshot.createDirective('ProfileAvatars',
  Slingshot.S3Storage, {
    bucket: Meteor.settings.AWSBucket,
    acl: "public-read",
    authorize: function (file, metaContext) {
      if (!this.userId) {
        var message = "Please login before being a dickwad";
        throw new Meteor.Error("Login Required", message);
      }

      return true;
    },

    key: function (file, metaContext) {
      return  this.userId +
        "/avatar/" + file.name
    }
  });
