Template.reserveDockingDetailsLine.events({
  "click .remove-line-item-button": function(event, template) {
    Mart.LineItems.remove(template.data._id)
  }
});
