Template.reserveDockingDetailsLine.events({
  "click .remove-line-item-button": function(event, template) {
    Mart.LineItems.remove(template.data._id)
  }
});

Template._manageDockingsApproval.events({
  "click .accept-docking-button": function(event, template) {
    event.target.disabled = true;

    Meteor.call("mart/accept-cart", template.data._id, function(error, result) {
      if(error) {
        event.target.disabled = false;
        sAlert.error(error)
      } else {
        sAlert.success("Docking accepted.")
      }
    })
  },
  "click .reject-docking-button": function(event, template) {
    event.target.disabled = true;

    Meteor.call("mart/reject-cart", template.data._id, function(error, result) {
      if(error) {
        event.target.disabled = false;
        sAlert.error(error)
      } else {
        sAlert.success("Docking rejected")
      }
    })
  },
});
