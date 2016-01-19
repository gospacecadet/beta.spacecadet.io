Template.myProfile.onCreated(function() {
  var hooksObject = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      var hook = this
      var user = {
        username: insertDoc.username,
        email: insertDoc.email,
        profile: {
          firstName: insertDoc.firstName,
          lastName: insertDoc.lastName,
          phoneNumber: insertDoc.phoneNumber,
          businessName: insertDoc.businessName
        }
      }

      Meteor.call('mart/update-user', user, function(error) {
        if(error) {
          sAlert.error(error)
        } else {
          sAlert.success("Profile successfully updated.")
        }

        hook.done()
      })
      return false;
    },
    onError: function(operation, error) {
      console.log(error);
      if(error && error.reason) { // a special Meteor.error
        sAlert.error(error.reason)
      }
    }
  };
  AutoForm.addHooks(['updateProfileForm'], hooksObject);
})
