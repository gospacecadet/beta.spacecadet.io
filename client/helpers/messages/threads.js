Template.threads.helpers({
  threads: function() {
    return Talk.threads()
  },
  thread: function() {
    return Talk.Threads.findOne(this._id)
  }
});
