_.each([
  "LandingPadsOriginal",
  "LandingPadsOptimized",
  "LandingPadsThumbnail",
  "StationsOriginal",
  "StationsOptimized",
  "StationsThumbnail"
], function(directive) {
  Slingshot.fileRestrictions(directive, {
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
  });
})
