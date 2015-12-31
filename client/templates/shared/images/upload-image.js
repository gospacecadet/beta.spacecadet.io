Template.uploadImage.events({
  "click .btn-upload": function(event, template) {
    event.preventDefault()

    let file = document.getElementById(this.type + "-image-" + this.index).files[0]

    if(!!file) {
      var uploader = new Slingshot.Upload("stations");

      uploader.send(file, function (error, downloadUrl) {
        if (error) {
          // Log service detailed response.
          console.error('Error uploading', uploader.xhr.response);
        }
        else {
          console.log(downloadUrl);
        }
      });
    } else {
      console.log('no file selected');
    }
  }
});
