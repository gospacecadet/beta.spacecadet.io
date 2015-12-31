Template.newStation.helpers({
  canShow: function() {
    return Roles.userIsInRole(Meteor.user(), [
      Mart.ROLES.GLOBAL.ADMIN,
      Mart.ROLES.GLOBAL.MERCHANT,
      Mart.ROLES.GLOBAL.REP,
    ], Mart.ROLES.GROUPS.GLOBAL)
  }
});

Template.newStation.onCreated(function() {
  var hooksObject = {
    // Called when any submit operation succeeds
    // insertDoc: The form input values in a document, suitable for use with insert(). This object has been cleaned and validated, but auto values and default values have not been added to it.
    // updateDoc: The form input values in a modifier, suitable for use with update(). This object has not been validated.
    // currentDoc: The object that's currently bound to the form through the doc attribute
    after: {
      insert: function(error, result) {
        console.log(result);
        FlowRouter.go(FlowRouter.path('editStation', {stationId: result}))
      }
    },
    onError: function(operation, error) {
      if(error) {
        console.log(error);
        alert('Could not sign up')
      }
    }
  };
  AutoForm.addHooks(['insertStationForm'], hooksObject);
})
