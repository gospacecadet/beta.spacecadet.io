var directives = [
  {name: "SpacesOriginal", path: "/original/"},
  {name: "SpacesOptimized", path: "/optimized/"},
  {name: "SpacesThumbnail", path: "/thumbnail/"},
]

_.each(directives, function(directive) {
  Slingshot.createDirective(directive.name,
    Slingshot.S3Storage, {
      bucket: Meteor.settings.AWSBucket,
      acl: "public-read",
      authorize: function (file, metaContext) {
        if (!Security.can(this.userId).insert({}).for(Mart.Storefronts).check()) {
          var message = "Please login before posting files";
          throw new Meteor.Error("Login Required", message);
        }

        return true;
      },

      key: function (file, metaContext) {
        let extensions = file.name.split(".")
        let extension = extensions[extensions.length-1]
        return  this.userId +
          "/spaces" +
          directive.path +
          metaContext.objectId + "/" +
          metaContext.index +
          "." +
          extension
      }
    });
})
