export const auth0Config = {
    domain: 'YOUR_AUTH0_DOMAIN', // e.g., 'dev-abc123.us.auth0.com'
    clientId: 'YOUR_AUTH0_CLIENT_ID',
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'YOUR_AUDIENCE', // Optional: API identifier if you're calling an API
      scope: 'openid profile email'
    },
    cacheLocation: 'localstorage'
  };