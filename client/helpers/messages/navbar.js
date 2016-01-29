Template.navbarSmInbox.helpers({
  unreadMessages: function() {
    return formatCount()
  }
});

Template.navbarMdInbox.helpers({
  unreadMessages: function() {
    return formatCount()
  }
});

var formatCount = function() {
  var count = Talk.unreadMessageCount()
  if(count > 0)
    return " ( " + count + " )"

  return ""
}
