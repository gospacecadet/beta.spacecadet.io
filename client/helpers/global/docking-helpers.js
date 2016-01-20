Template.registerHelper("dockingImageUrl", function() {
  var image = Mart.Images.findOne({objectCollection: "Storefronts", objectId: this.storefrontIdAtCheckout})
  if(image)
    return image.thumbnailUrl
});
