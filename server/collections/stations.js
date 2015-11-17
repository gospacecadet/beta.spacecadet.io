Stations.permit(['insert', 'update', 'remove']).never().apply();
Stations.permit(['insert', 'update']).ifLoggedIn().apply();
