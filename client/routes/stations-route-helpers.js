Template.registerHelper("newStationPath", function () {
  return FlowRouter.path('newStation')
})

Template.registerHelper("editStationPath", function (stationId) {
  return FlowRouter.path('editStation', {stationId: stationId})
})
