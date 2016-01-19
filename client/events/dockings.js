Template.reserveDockingDetailsLine.events({
  "click .remove-line-item-button": function(event, template) {
    Mart.LineItems.remove(template.data._id)
  }
});

Template._manageDockingsApproval.events({
  "click .accept-docking-button": function(event, template) {
    Meteor.call("mart/make-payment", template.data._id, function(error, result) {
      if(error) {
        console.log(error);
        sAlert.error(error)
      } else {
        sAlert.success("Docking accepted.")
      }
    })
  },
  "click .reject-docking-button": function(event, template) {

  },
});
