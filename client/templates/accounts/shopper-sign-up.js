Template.shopperSignUp.onCreated(function() {
  var hooksObject = {
    // Called when any submit operation succeeds
    // insertDoc: The form input values in a document, suitable for use with insert(). This object has been cleaned and validated, but auto values and default values have not been added to it.
    // updateDoc: The form input values in a modifier, suitable for use with update(). This object has not been validated.
    // currentDoc: The object that's currently bound to the form through the doc attribute
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      Mart.Accounts.ShopperSignUpSchema.clean(insertDoc);
      console.log('onSubmit');
      var that = this
      var shopper = {
        email: insertDoc.email,
        password: insertDoc.password,
        roles: [Mart.ROLES.GLOBAL.SHOPPER],
        profile: {
          phoneNumber: insertDoc.phoneNumber,
        }
      }

      Mart.Accounts.createUser(shopper, function(error) {
        that.done(error)
      })

      return false;
    },
    onError: function(operation, error) {
      if(error) {
        sAlert.error(error.message)
      }
    }
  };
  AutoForm.resetForm('shopperSignUpForm')
  AutoForm.addHooks(['shopperSignUpForm'], hooksObject);
})
