(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// lib/slingshot-file-restrictions.js                                  //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
_.each(["SpacesOriginal", "SpacesOptimized", "SpacesThumbnail", "PropertiesOriginal", "PropertiesOptimized", "PropertiesThumbnail"], function (directive) {
  Slingshot.fileRestrictions(directive, {                              // 9
    allowedFileTypes: ["image/png", "image/jpeg"],                     // 10
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)        // 11
  });                                                                  //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=slingshot-file-restrictions.js.map
