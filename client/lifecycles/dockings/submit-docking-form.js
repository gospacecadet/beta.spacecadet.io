var hooksObject = {
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
    var hook = this
    var lineItemId = FlowRouter.getParam('lineItemId')
    var lineItem = Mart.LineItems.findOne(lineItemId)
    insertDoc.cartId = lineItem.cartId
    Meteor.call("mart/submit-carts", insertDoc, function(error, cartIds) {
      if(error) {
        hook.done(error)
      } else {
        sAlert.success("Order submitted")
        var confirmationPath = FlowRouter.path('dockingHistoryPending')
        FlowRouter.go(confirmationPath)
        hook.done()
      }
    });

    return false;
  },
  onError: function(operation, error) {
    if(error && error.error === 'invalid-card') { // a special Meteor.error
      sAlert.error("You must select a card")
    } else if(error && error.reason) {
      sAlert.error(error.reason)
    } else {
      sAlert.error("Unknown error")
    }

    // throwError("Please correct the errors and try again.")
  }
};
AutoForm.addHooks(['submitDockingForm'], hooksObject);
