Template.editSpaces.helpers({
  propertyId: function() {
    return this.propertyId;
  },

});

Template.editSpace.helpers({
  updateSpaceId: function() {
    return 'update-space-' + this._id
  },
  uploader: function(directiveName, index, objectId) {
    let metaContext = {
      index: index,
      objectId: this.storefrontId, //propertyId
    }

    return new Slingshot.Upload(directiveName, metaContext);
  },
});

Template.editSpace.events({
  "click #publish-space": function(event, template) {
     Meteor.call("mart/product/publish", this._id, function(error, result) {
       if(error) {
         sAlert.error(error.reason)
       }
       if(result){
          sAlert.success("Space activated")
       }
     });
  }
});
