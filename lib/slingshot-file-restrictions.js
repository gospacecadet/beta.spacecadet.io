_.each([
  "SpacesOriginal",
  "SpacesOptimized",
  "SpacesThumbnail",
  "PropertiesOriginal",
  "PropertiesOptimized",
  "PropertiesThumbnail"
], function(directive) {
  Slingshot.fileRestrictions(directive, {
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
  });
})
