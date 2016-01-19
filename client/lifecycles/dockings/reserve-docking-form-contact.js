Template.reserveDockingFormContact.onCreated(function() {
  var hooksObject = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      var hook = this

      Meteor.call("mart/submit-carts", insertDoc, function(error, cartIds) {
        if(error) {
          console.log(error);
          if(error.error === 'invalid-card') {
            sAlert.error("You must select a card")
            hook.done()
          } else {
            sAlert.error(error.reason)
            hook.done()
          }
        } else {
          sAlert.success("Order submitted")
          var confirmationPath = FlowRouter.path('dockingHistory')
          FlowRouter.go(confirmationPath)
          hook.done()
        }
      });

      return false;
    },
    onError: function(operation, error) {
      console.log(error);
      if(error && error.reason) { // a special Meteor.error
        sAlert.error(error.reason)
        throwError("Please correct the errors and try again.")
      }
    }
  };
  AutoForm.addHooks(['submitDockingForm'], hooksObject);
})
