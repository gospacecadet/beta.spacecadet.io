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

Template.editSpace.events({
  "click #publish-space": function(event, template) {
    console.log(this._id);
     Meteor.call("mart/product/publish", this._id, function(error, result) {
       if(error) {
         console.log(error);
         sAlert.error(error.reason)
       }
       if(result){
          sAlert.success("Space activated")
       }
     });
  }
});
