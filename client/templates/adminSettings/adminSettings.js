Template.adminSetting.events({
  "submit form": function(event, template){
    event.preventDefault();

    var adminSettingVal = $(event.target).find('[name=adminSettingKey]').val();
    var adminSetting = AdminSettings.findOne({"_id": this._id});

    AdminSettings.update(adminSetting._id, { $set: {value: adminSettingVal} });
  }
});
