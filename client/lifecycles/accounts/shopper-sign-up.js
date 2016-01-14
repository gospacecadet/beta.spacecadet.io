Template.shopperSignUp.onCreated(function() {
  var hooksObject = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      var that = this
      var shopper = {
        email: insertDoc.email,
        password: insertDoc.password,
        roles: [Mart.ROLES.GLOBAL.SHOPPER],
      }

      Mart.Accounts.createUser(shopper, function(error) {
        that.done(error)
      })

      return false;
    },
    onError: function(operation, error) {
      if(error && error.reason) { // a special Meteor.error
        sAlert.error(error.reason)
      }
    }
  };
  AutoForm.addHooks(['shopper-sign-up-homepage'], hooksObject);
})
