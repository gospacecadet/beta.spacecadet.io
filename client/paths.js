Handlebars.registerHelper('newStationPath', function () {
  return flowRouterPath()
});

flowRouterPath = function() {
  return FlowRouter.path("newStation")
}

homepagePath = function() {
  return FlowRouter.path("homepage")
}
