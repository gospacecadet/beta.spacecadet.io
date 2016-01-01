Template.uploadImage.events({
  "click .btn-upload": function(event, template) {
    event.preventDefault()

    let collection = this.collection // stations, products, etc
    let index = this.index
    let objectId = this.objectId

    let originalUploader = this.originalUploader
    let optimizedUploader = this.optimizedUploader
    let thumbnailUploader = this.thumbnailUploader

    let file = document.getElementById(collection + "-image-" + index).files[0]

    let imageUrls = {}
    if(!!file) {
      // Upload the original image
      uploadImage(originalUploader, file, function(error, uploadUrl) {
        imageUrls.originalUrl = uploadUrl
        insertImages(imageUrls, collection, objectId, index, function(error, result) {
          if(error)
            console.log(error);
        })
      })

      // Resize and upload as optimized
      resizeImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        canvas: true
      }, function(error, blob) {
        uploadImage(optimizedUploader, blob, function(error, uploadUrl) {
          imageUrls.optimizedUrl = uploadUrl
          insertImages(imageUrls, collection, objectId, index, function(error, result) {
            if(error)
              console.log(error);
          })
        })
      })

      // Resize and upload as thumbnail
      resizeImage(file, {
        maxWidth: 100,
        maxHeight: 100,
        canvas: true
      }, function(error, blob) {
        uploadImage(thumbnailUploader, blob, function(error, uploadUrl) {
          imageUrls.thumbnailUrl = uploadUrl
          insertImages(imageUrls, collection, objectId, index, function(error, result) {
            if(error)
              console.log(error);
          })
        })
      })

    } else {
      console.log('no file selected');
    }

  }
});

var insertImages = function(imageUrls, objectCollection, objectId, index, callback) {
  if(imageUrls.originalUrl && imageUrls.optimizedUrl && imageUrls.thumbnailUrl) {
    let image = _.extend(imageUrls, {
      objectCollection: objectCollection,
      objectId: objectId,
      index: index,
    })

    let img = Mart.Images.findOne({
      objectCollection: objectCollection,
      objectId: objectId,
      index: index
    })

    if(!!img) {
      Mart.Images.update(img._id, {$set: image}, callback)
    } else {
      Mart.Images.insert(image, callback)
    }
  }
}

// return blob
var resizeImage = function(file, options, callback) {
  var fileData = {
    name: file.name,
    type: file.type
  };

  // Get image metadata.
  loadImage.parseMetaData(file, function(data) {
    var orientation = 1;
    if (data.exif) {
      orientation = data.exif.get('Orientation');
      if (orientation) {
        options.orientation = orientation;
      }
    }

    // Resize image with orientation metadata.
    loadImage(file, function(canvas) {

      canvas.toBlob(function(blob) {
        fileData.data = blob
        fileData.data.type = file.type;

        var resizedImage = _.extend(fileData.data, {name: fileData.name}, data.exif ? data.exif.getAll() : {});
        callback(null, resizedImage)
      })
    }, options);

  },
  {
    maxMetaDataSize: 262144,
    disableImageHead: false
  });
}

// return uploaded url
var uploadImage = function(uploader, blob, callback) {
  uploader.send(blob, function (error, downloadUrl) {
    if (error) {
      // Log service detailed response.
      console.error('Error uploading', uploader.xhr.response);
    }
    callback(undefined, downloadUrl)
  });
}

Template.uploadImage.helpers({
  // The original should take the longest to upload
  progress: function() {
    if(this.originalUploader && this.originalUploader.progress) {
      let p = Math.round(this.originalUploader.progress() * 100)
      return p
    }

    return 0
  },
  uploading: function() {
    if(this.originalUploader && this.originalUploader.progress) {
      let p = Math.round(this.originalUploader.progress() * 100)
      return p > 1
    }

    return false
  },
  url: function () {
    return this.thumbnailUploader.url(true);
  }
})
