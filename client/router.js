FlowRouter.route('/', {
  name: "homepage",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "homepage"});
  }
});


FlowRouter.route('/admin/payment', {
  name: "payment",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "payment"});
  }
});
