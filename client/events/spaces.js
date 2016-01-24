Template.newSpaceImage.events({
  "click .new-space-image-button": function(event, template) {
    var inputs = template.$('.space-image-upload')

    if(inputs && inputs[0] && inputs[0].files && inputs[0].files[0]) {
      var file = inputs[0].files[0]
      var index = template.data.index

      uploadImageVersions(file, "Spaces", index, false, function(error, imageUrls) {
        if(error) {
          // console.log(error);
          sAlert.error(error)
        } else {
          Session.set(spaceUploadedImageId(index), imageUrls)
        }
      })
    }
  }
});
