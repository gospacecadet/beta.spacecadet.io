Template.loginButtons.events({
  "click #log-out-button": function(event, template) {
     Meteor.logout(function() {

     });
  }
});

var martLoginSigningIn = 'mart-login-signing-in'

Template.login.helpers({
  signingIn: function() {
    return Session.get(martLoginSigningIn)
  }
});

Meteor.startup(function() {
  Session.setDefault(martLoginSigningIn, true);
});

Template.signIn.events({
  "click #sign-up-instead": function(event, template){
     event.preventDefault()
     Session.set(martLoginSigningIn, false)
  }
});

Template.signUp.events({
  "click #sign-in-instead": function(event, template){
     event.preventDefault()
     Session.set(martLoginSigningIn, true)
  }
});

Template.signIn.onCreated(function() {
  var hooksObject = {
    // Called when any submit operation succeeds
    // insertDoc: The form input values in a document, suitable for use with insert(). This object has been cleaned and validated, but auto values and default values have not been added to it.
    // updateDoc: The form input values in a modifier, suitable for use with update(). This object has not been validated.
    // currentDoc: The object that's currently bound to the form through the doc attribute
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      var that = this
      Meteor.loginWithPassword(insertDoc.email, insertDoc.password, function(error) {
        if(error) {
          that.done(new Error("Could not sign in"))
        }
        // console.log(error);
         else {
           that.done();
         }
      })

      return false;
    },
    onError: function(operation, error) {
      if(error) {
        alert('login failed')
      }
    }
  };
  AutoForm.addHooks(['signInForm'], hooksObject);
})

Template.signUp.onCreated(function() {

  var hooksObject = {
    // Called when any submit operation succeeds
    // insertDoc: The form input values in a document, suitable for use with insert(). This object has been cleaned and validated, but auto values and default values have not been added to it.
    // updateDoc: The form input values in a modifier, suitable for use with update(). This object has not been validated.
    // currentDoc: The object that's currently bound to the form through the doc attribute
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      var that = this

      Mart.Accounts.createUser({
        email: insertDoc.email,
        password: insertDoc.password
      }, function(error) {
        that.done(error)
      })

      return false;
    },
    onError: function(operation, error) {
      if(error) {
        alert('Could not sign up')
      }
    }
  };
  AutoForm.addHooks(['signUpForm'], hooksObject);
})
