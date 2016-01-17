Template.threads.helpers({
  threads: function() {
    return Talk.Threads.find()
  }
});
