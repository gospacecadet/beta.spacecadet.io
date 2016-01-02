Template.navbar.helpers({
  rendered: function(){

  }
});

Template.navbar.events({
  "click #logout-button": function(event, template) {
    Meteor.logout() 
  }
});
