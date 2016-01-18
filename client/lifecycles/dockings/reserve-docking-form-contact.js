Template.reserveDockingFormContact.onCreated(function() {
  var hooksObject = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      console.log('onSubmit#reserveDockingFormContact');
      console.log(insertDoc);
      var that = this

      return false;
    },
    onError: function(operation, error) {
      console.log(error);
      if(error && error.reason) { // a special Meteor.error
        sAlert.error(error.reason)
      }
    }
  };
  AutoForm.addHooks(['submitDockingForm'], hooksObject);
})
