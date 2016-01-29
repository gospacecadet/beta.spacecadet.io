Slingshot.createDirective("ThreadFile",
  Slingshot.S3Storage, {
    bucket: Meteor.settings.AWSBucket,
    acl: "public-read",
    authorize: function (file, metaContext) {
      if (!this.userId) {
        var message = "Please login before posting files";
        throw new Meteor.Error("Login Required", message);
      }

      return true;
    },

    key: function (file, metaContext) {
      return  this.userId +
        "/threads/" +
        metaContext.threadId + "/" +
        Random.id() + "/" +
        file.name
    }
  });
