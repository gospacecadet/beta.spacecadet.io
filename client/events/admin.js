Template.transferFundsApproval.events({
  "click .accept-transfer-button": function(event, template) {
    Meteor.call("mart/process-transfer", template.data._id, function(error, result) {
      if(error) {
        console.log(error);
        sAlert.error(error)
      } else {
        sAlert.success("Transfer initiated. It may take up to 3 days to show up on Stripe.")
      }
    })
  },
  "click .reject-transfer-button": function(event, template) {
    Meteor.call("mart/reject-transfer", template.data._id, function(error, result) {
      if(error) {
        console.log(error);
        sAlert.error(error)
      } else {
        sAlert.success("Transfer rejected")
      }
    })
  },
});
