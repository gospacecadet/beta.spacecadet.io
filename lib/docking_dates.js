SESSION_LOOKUP_START_DOCKING_ON = "session_lookup_start_docking_on";
SESSION_LOOKUP_END_DOCKING_ON = "session_lookup_end_docking_on";

// Get the date docking starts
startDockingOn = function() {
  var storedDate = Session.get(SESSION_LOOKUP_START_DOCKING_ON);
  return getDateOrDefault(storedDate);
}

// Get the date docking ends
endDockingOn = function() {
  var storedDate = Session.get(SESSION_LOOKUP_END_DOCKING_ON);
  return getDateOrDefault(storedDate);
}

// Today's date as a regular JS date
today = function() {
  return new Date();
}

// Return the date passed in or a default if null
var getDateOrDefault = function(date) {
  if(date) return date;
  return today();
}