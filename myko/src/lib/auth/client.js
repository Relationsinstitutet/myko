import createAuth0Client from '@auth0/auth0-spa-js';
import { isAuthenticated, user } from './store';

export class Client {
  #client;

  /** @param client {import('@auth0/auth0-spa-js').Auth0Client>} */
  constructor(client) {
    this.#client = client;
  }

  async login(returnTo) {
    await this.#client.loginWithRedirect({
      redirect_uri: `${window.location.origin}/login/callback`,
      appState: { returnTo },
    });
  }

  async handleLoginCallback() {
    // check for OAuth code and state parameters
    const query = window.location.search;

    if (query.includes('code=') && query.includes('state=')) {
      // Process the login state
      const result = await this.#client.handleRedirectCallback();
      await this.updateState();
      return result.appState;
    }

    return null;
  }

  async updateState() {
    isAuthenticated.set(await this.#client.isAuthenticated());
    user.set(await this.#client.getUser());
  }

  async getUserAccessToken() {
    return this.#client.getTokenSilently();
  }
}

// TODO add Callback URLs in Auth0 management console
/** @type {() => Promise<Client>} */
export default async function createClient() {
  const client = await createAuth0Client({
    domain: 'relationsinstitutet.eu.auth0.com',
    client_id: '9eVpAJ2FxWu6SlSvk6ouXPNtGsZlWrtZ',
    cacheLocation: 'localstorage',
  });

  return new Client(client);
}
