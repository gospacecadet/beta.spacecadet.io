AdminSettings.permit(['insert', 'update', 'remove']).never().apply();
AdminSettings.permit(['update']).ifLoggedIn().onlyProps(['value']).apply();
