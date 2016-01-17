Template.inbox.helpers({
  currentThread: function() {
    var currentThreadId = Session.get('current-thread-id')
    if(currentThreadId) {
      var currentThread = Talk.Threads.findOne(currentThreadId)
      if(currentThread)
        return currentThread
    }

    var activeThreads = Talk.threads()

    if(activeThreads && activeThreads.length > 0) {
      var thread = Talk.Threads.findOne(activeThreads[0]._id) // extended Collection, so can't use regular object
      return thread
    }
  }
});
