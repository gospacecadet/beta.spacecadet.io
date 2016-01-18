(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/slingshot/property-directives.js                             //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
var directives = [{ name: "PropertiesOriginal", path: "/original/" }, { name: "PropertiesOptimized", path: "/optimized/" }, { name: "PropertiesThumbnail", path: "/thumbnail/" }];
                                                                       //
_.each(directives, function (directive) {                              // 7
  Slingshot.createDirective(directive.name, Slingshot.S3Storage, {     // 8
    bucket: Meteor.settings.AWSBucket,                                 // 9
    acl: "public-read",                                                // 10
                                                                       //
    authorize: function (file, metaContext) {                          // 12
      if (!Security.can(this.userId).insert({})["for"](Mart.Storefronts).check()) {
        var message = "Please login before posting files";             // 14
        throw new Meteor.Error("Login Required", message);             // 15
      }                                                                //
                                                                       //
      return true;                                                     // 18
    },                                                                 //
                                                                       //
    key: function (file, metaContext) {                                // 21
      var extensions = file.name.split(".");                           // 22
      var extension = extensions[extensions.length - 1];               // 23
      return "stations/" + metaContext.objectId + directive.path + metaContext.index + "." + extension;
    }                                                                  //
  });                                                                  //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=property-directives.js.map
