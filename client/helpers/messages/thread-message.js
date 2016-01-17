Template.threadMessage.helpers({
  messageClass: function() {
    return (this.senderId === Meteor.userId()) ? "alert alert-success col-md-9" :
      "alert alert-info col-md-9 col-md-offset-3"
  },
});
