FlowRouter.route('/new-station', {
  name: "newStation",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "newStation"});
  }
});

FlowRouter.route('/stations/:stationId', {
  name: "station",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "station"});
  }
});

FlowRouter.route('/stations/:stationId/edit', {
  name: "editStation",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "editStation"});
  }
});
