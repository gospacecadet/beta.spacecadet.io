Handlebars.registerHelper('newStationPath', function () {
  return flowRouterPath("newStation")
});

flowRouterPath = function(templateName) {
  return FlowRouter.path(templateName)
}

homepagePath = function() {
  return FlowRouter.path("homepage")
}

Handlebars.registerHelper('checkoutPath', function () {
  return flowRouterPath("reserveDocking")
});
