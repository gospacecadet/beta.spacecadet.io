Template.editSpaces.helpers({
  propertyId: function() {
    console.log(this.propertyId);
    return this.propertyId;
  },
  uploader: function(directiveName, index, objectId) {
    let metaContext = {
      index: index,
      objectId: this.stationId,
    }

    return new Slingshot.Upload(directiveName, metaContext);
  },
});

Template.editSpace.helpers({
  propertyId: function() {
    console.log(this.propertyId);
    return this.propertyId;
  },
  uploader: function(directiveName, index, objectId) {
    let metaContext = {
      index: index,
      objectId: this._id, //propertyId
    }

    return new Slingshot.Upload(directiveName, metaContext);
  },
});
