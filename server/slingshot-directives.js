var directives = [
  {name: "StationsOriginal", path: "/original/"},
  {name: "StationsOptimized", path: "/optimized/"},
  {name: "StationsThumbnail", path: "/thumbnail/"},
]

_.each(directives, function(directive) {
  Slingshot.createDirective(directive.name, Slingshot.S3Storage, {
    bucket: "local.beta.spacecadet.io",
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
      return "stations/" +
        metaContext.objectId +
        directive.path +
        metaContext.index +
        "." +
        extension
    }
  });
})
