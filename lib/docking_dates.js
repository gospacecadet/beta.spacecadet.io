SESSION_LOOKUP_START_DOCKING_ON = "session_lookup_start_docking_on";
SESSION_LOOKUP_END_DOCKING_ON = "session_lookup_end_docking_on";

// Get the date docking starts
getStartDockingOn = function() {
  var storedDate = Session.get(SESSION_LOOKUP_START_DOCKING_ON);
  return getDateOrDefault(storedDate);
}

// Get the date docking ends
getEndDockingOn = function() {
  var storedDate = Session.get(SESSION_LOOKUP_END_DOCKING_ON);
  return getDateOrDefault(storedDate);
}


// Set the start date
setStartDockingOn = function(startDockingOn) {
  Session.set(SESSION_LOOKUP_START_DOCKING_ON, startDockingOn);
}

// Set the end date
setEndDockingOn = function(endDockingOn) {
  Session.set(SESSION_LOOKUP_END_DOCKING_ON, endDockingOn);
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