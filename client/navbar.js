Template.navbar.events({
  "click #logout-button": function(event, template) {
    Meteor.logout()
  }
});

Template.navbarLogin.events({
  "submit #navbar-login": function(event, template) {
     event.preventDefault();

     var email = $(event.target).find('[name=email]').val()
     var password = $(event.target).find('[name=password]').val()

     Meteor.loginWithPassword(email, password, function(error, response) {
       if(error) {
         sAlert.error("You could not be logged in: " + error.reason)
       } else {
        //  sAlert.success("Logged in successfully!")
       }
     })
  }
});
