Template.stripe.events({
  "submit form": function(event, template){
    event.preventDefault();

    var stripeAPIKey = $(event.target).find('[name=stripeAPIKey]').val();
    var adminSetting = AdminSettings.findOne({"key": "stripeAPIKey"});

    AdminSettings.update(adminSetting._id, { $set: {value: stripeAPIKey} });
  }
});
