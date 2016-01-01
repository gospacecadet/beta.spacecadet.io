Template.editStation.onCreated(function() {
    // var hooksObject = {
    //   // Called when any submit operation succeeds
    //   // insertDoc: The form input values in a document, suitable for use with insert(). This object has been cleaned and validated, but auto values and default values have not been added to it.
    //   // updateDoc: The form input values in a modifier, suitable for use with update(). This object has not been validated.
    //   // currentDoc: The object that's currently bound to the form through the doc attribute
    //   after: {
    //     update: function(error, result) {
    //       console.log(result);
    //       FlowRouter.go(FlowRouter.path('editStation', {stationId: result}))
    //     }
    //   },
    //   onError: function(operation, error) {
    //     if(error) {
    //       console.log(error);
    //       alert('Could not update')
    //     }
    //   }
    // };
    // AutoForm.addHooks(['insertStationForm'], hooksObject);


  Tracker.autorun(function() {
    var stationId = FlowRouter.getParam('stationId')
    Meteor.subscribe("mart/storefront", stationId);
  });

});

Template.editStation.helpers({
  station: function() {
    var stationId = FlowRouter.getParam('stationId')
    return Mart.Storefronts.findOne(stationId)
  },
  uploader: function(directiveName, index, objectId) {
    let metaContext = {
      index: index,
      objectId: objectId,
    }

    return new Slingshot.Upload(directiveName, metaContext);
  },
})
