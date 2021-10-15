// Email address of the user to impersonate.
const USER_EMAIL = '<Admin Account Email Address>';

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  getService().reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth2.createService('GoogleAdminDirectory:' + USER_EMAIL)
    // Set the endpoint URL.
    .setTokenUrl(service_account.token_uri)

    // Set the private key and issuer.
    .setPrivateKey(service_account.private_key)
    .setIssuer(service_account.client_email)

    // Set the name of the user to impersonate. This will only work for
    // Google Apps for Work/EDU accounts whose admin has setup domain-wide
    // delegation:
    // https://developers.google.com/identity/protocols/OAuth2ServiceAccount#delegatingauthority
    .setSubject(USER_EMAIL)

    // Set the property store where authorized tokens should be persisted.
    .setPropertyStore(PropertiesService.getScriptProperties())

    // Set the scope. This must match one of the scopes configured during the
    // setup of domain-wide delegation.
    .setScope('https://www.googleapis.com/auth/admin.directory.user');
}

/**
 * Authorizes and makes a request to the API.
 */
function makeRequest(url, method = 'get', payload) {
  let service = getService();
  if (service.hasAccess()) {
    let options = {
      headers: {
        Authorization: `Bearer ${service.getAccessToken()}`
      },
      method: method,
      contentType: 'application/json'
    };

    if (payload) {
      options.payload = JSON.stringify(payload);
    }

    let response = UrlFetchApp.fetch(url, options);
    let result = JSON.parse(response.getContentText());

    return result;
    //    Logger.log(JSON.stringify(result, null, 2));
  } else {
    Logger.log(service.getLastError());
  }
}
