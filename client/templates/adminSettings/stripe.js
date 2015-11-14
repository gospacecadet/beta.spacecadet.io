Template.stripe.events({
  "submit form": function(event, template){
    event.preventDefault();

    var stripeAPIKey = $(event.target).find('[name=stripeAPIKey]').val();
    console.log(stripeAPIKey);
    var adminSetting = { key: "stripeAPIKey", value: stripeAPIKey };

    AdminSettings.insert(adminSetting);
  }
});
