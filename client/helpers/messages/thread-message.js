Template.messageContentXL.helpers({
  messageColClass: function() {
    var senderClass = "col-xl-10 col-xl-offset-2 text-xs-right"
    var recipientClass= "col-xl-10"

    return (this.senderId === Meteor.userId()) ? senderClass : recipientClass
  },
  messageAlertClass: function() {
    var senderClass = "alert alert-info"
    var recipientClass= "alert alert-success bg-teal-light"

    return (this.senderId === Meteor.userId()) ? senderClass : recipientClass
  },
})

Template.messageContentMD.helpers({
  messageColClass: function() {
    var senderClass = "col-xs-12 col-sm-11 col-sm-offset-1 col-md-10 col-md-offset-2 text-xs-right"
    var recipientClass= "col-xs-12 col-sm-11 col-md-10"

    return (this.senderId === Meteor.userId()) ? senderClass : recipientClass
  },
  messageAlertClass: function() {
    var senderClass = "alert alert-info"
    var recipientClass= "alert alert-success bg-teal-light"

    return (this.senderId === Meteor.userId()) ? senderClass : recipientClass
  },
})
