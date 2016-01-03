Template.registerHelper("newPropertyPath", function () {
  return FlowRouter.path('newProperty')
})

Template.registerHelper("editPropertyPath", function (propertyId) {
  return FlowRouter.path('editProperty', {propertyId: propertyId})
})

Template.registerHelper("managePropertiesPath", function () {
  return FlowRouter.path('manageProperties')
})
