FlowRouter.route('/about', {
  name: "about",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "about"});
  }
});

FlowRouter.route('/list-space', {
  name: "listSpace",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "listSpace"});
  }
});

FlowRouter.route('/terms', {
  name: "terms",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "terms"});
  }
});

FlowRouter.route('/privacy', {
  name: "privacy",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "privacy"});
  }
});
