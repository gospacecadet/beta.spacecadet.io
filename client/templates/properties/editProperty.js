Template.editProperty.onCreated(function() {
    // var hooksObject = {
    //   // Called when any submit operation succeeds
    //   // insertDoc: The form input values in a document, suitable for use with insert(). This object has been cleaned and validated, but auto values and default values have not been added to it.
    //   // updateDoc: The form input values in a modifier, suitable for use with update(). This object has not been validated.
    //   // currentDoc: The object that's currently bound to the form through the doc attribute
    //   after: {
    //     update: function(error, result) {
    //       console.log(result);
    //       FlowRouter.go(FlowRouter.path('editProperty', {propertyId: result}))
    //     }
    //   },
    //   onError: function(operation, error) {
    //     if(error) {
    //       console.log(error);
    //       alert('Could not update')
    //     }
    //   }
    // };
    // AutoForm.addHooks(['insertPropertyForm'], hooksObject);


  Tracker.autorun(function() {
    var propertyId = FlowRouter.getParam('propertyId')
    Meteor.subscribe("mart/storefront", propertyId);
  });

});

Template.editProperty.helpers({
  property: function() {
    var propertyId = FlowRouter.getParam('propertyId')
    return Mart.Storefronts.findOne(propertyId)
  },
  uploader: function(directiveName, index, objectId) {
    let metaContext = {
      index: index,
      objectId: objectId,
    }

    return new Slingshot.Upload(directiveName, metaContext);
  },
  spaces: function() {
    var propertyId = FlowRouter.getParam('propertyId')
    return Mart.Products.find({storefrontId: propertyId})
  }
})

Template.editProperty.events({
  "click #publish-property": function(event, template) {
     Meteor.call("mart/storefront/publish", this._id, function(error, result) {
       if(error){
         sAlert.error(error.reason)
       }
       if(result){
          sAlert.success("Property activated")
       }
     });
  }
});
