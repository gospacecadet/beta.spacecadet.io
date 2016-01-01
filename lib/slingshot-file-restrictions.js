Slingshot.fileRestrictions("StationsOriginal", {
  allowedFileTypes: ["image/png", "image/jpeg"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
});

Slingshot.fileRestrictions("StationsOptimized", {
  allowedFileTypes: ["image/png", "image/jpeg"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
});

Slingshot.fileRestrictions("StationsThumbnail", {
  allowedFileTypes: ["image/png", "image/jpeg"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
});
