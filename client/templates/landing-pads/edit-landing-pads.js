Template.editLandingPads.helpers({
  stationId: function() {
    console.log(this.stationId);
    return this.stationId;
  },
  uploader: function(directiveName, index, objectId) {
    let metaContext = {
      index: index,
      objectId: this.stationId,
    }

    return new Slingshot.Upload(directiveName, metaContext);
  },
});

Template.editLandingPad.helpers({
  stationId: function() {
    console.log(this.stationId);
    return this.stationId;
  },
  uploader: function(directiveName, index, objectId) {
    let metaContext = {
      index: index,
      objectId: this._id, //stationId
    }

    return new Slingshot.Upload(directiveName, metaContext);
  },
});
