Template.threadMessage.helpers({
  messageClass: function() {
    return (this.senderId === Meteor.userId()) ? "alert alert-success col-md-10" :
      "alert alert-info col-md-10 col-md-offset-2"
  },
});
