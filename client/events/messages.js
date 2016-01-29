Template.threadSendMessage.events({
  "submit #send-message-form": function(event, template) {
    event.preventDefault();
    var message = {
      recipientId: this.recipientId(),
      body: $(event.target).find('#send-message-body').val(),
    }
    $(event.target).find('#send-message-body').val("")

    Talk.send(message)
  },
});

Template.threadAttachFile.events({
  "submit #attach-file-form": function(event, template) {
    event.preventDefault();

    var inputs = template.$('.threadAttachFileFile')

    if(inputs && inputs[0] && inputs[0].files && inputs[0].files[0]) {
      var file = inputs[0].files[0]
      var threadId = this._id
      var recipientId = this.user2Id

      var uploader = new Slingshot.Upload('ThreadFile', {
        threadId: threadId
      })

      Session.set("threadFile", uploader)

      uploader.send(file, function(error, downloadUrl) {
        if(error) {
          sAlert.error(error.message)
        } else {
          Meteor.call("talk/send", {
            recipientId: recipientId,
            attachmentUrl: downloadUrl,
            attachmentName: file.name
          }, function(error, messageId) {
            console.log(error);
            console.log(messageId);
          });
        }
      })


    }
  }
});
