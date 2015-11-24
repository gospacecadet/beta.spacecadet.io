FlowRouter.route('/', {
  name: "homepage",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "homepage"});
  }
});
