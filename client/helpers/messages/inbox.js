Template.inbox.helpers({
  currentThread: function() {
    var currentRecipientId = FlowRouter.getParam('recipientId')
    if(currentRecipientId) {
      var currentThread = Talk.thread(currentRecipientId)
      if(currentThread)
        return currentThread
    }

    var activeThreads = Talk.threads()

    if(activeThreads && activeThreads.length > 0) {
      var thread = Talk.Threads.findOne(activeThreads[0]._id) // extended Collection, so can't use regular object
      return thread
    }
  },
  hasThreads: function() {
    return Talk.threads().length > 0
  },
});
