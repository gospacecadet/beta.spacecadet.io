Template.threadMessage.helpers({
  messageClass: function() {
    return (this.senderId === Meteor.userId()) ? "alert alert-success col-md-8" :
      "alert alert-info col-md-8 col-md-offset-4"
  }
});
