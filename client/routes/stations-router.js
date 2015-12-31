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
