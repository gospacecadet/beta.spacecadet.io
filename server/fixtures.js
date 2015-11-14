Meteor.startup(function () {
  if (AdminSettings.find().count() === 0 ) {
    _.each(validAdminSettings, function(field, index, list) {
      setting = {}
      setting["key"] = field;
      AdminSettings.insert(setting);
    })
  }
})
