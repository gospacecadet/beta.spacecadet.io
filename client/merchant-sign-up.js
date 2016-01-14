Template.merchantSignUp.onCreated(function() {
  var hooksObject = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {

      var that = this
      var merchant = {
        email: insertDoc.email,
        password: insertDoc.password,
        roles: [Mart.ROLES.GLOBAL.MERCHANT],
        profile: {
          contactFirstName: insertDoc.contactFirstName,
          contactLastName: insertDoc.contactLastName,
          phoneNumber: insertDoc.phoneNumber,
          businessName: insertDoc.businessName
        }
      }

      Mart.Accounts.createUser(merchant, function(error) {
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
  AutoForm.addHooks(['merchantSignUpForm'], hooksObject);
})
