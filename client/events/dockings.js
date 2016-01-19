Template.reserveDockingDetailsLine.events({
  "click .remove-line-item-button": function(event, template) {
    Mart.LineItems.remove(template.data._id)
  }
});

Template._manageDockingsApproval.events({
  "click .accept-docking-button": function(event, template) {
     
  },
  "click .reject-docking-button": function(event, template) {

  },
});
