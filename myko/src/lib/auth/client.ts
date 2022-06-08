import createAuth0Client from '@auth0/auth0-spa-js';
import type { Auth0Client } from '@auth0/auth0-spa-js';
import { isAuthenticated, user } from './store';
import type IUserData from './userdata';
import UserData from './userdata';

const auth0Domain = 'relationsinstitutet.eu.auth0.com';

export class Client {
  private client: Auth0Client;

  constructor(client: Auth0Client) {
    this.client = client;
  }

  async login(returnTo: string) {
    await this.client.loginWithRedirect({
      redirect_uri: this.absoluteUrl(`/login/callback`),
      appState: { returnTo },
    });
  }

  async logout(returnTo = '/') {
    await this.client.logout({ returnTo: this.absoluteUrl(returnTo) });
  }

  async handleLoginCallback() {
    // check for OAuth code and state parameters
    const query = window.location.search;

    if (query.includes('code=') && query.includes('state=')) {
      // Process the login state
      const result = await this.client.handleRedirectCallback();
      await this.updateState();
      return result.appState;
    }

    return null;
  }

  async updateState() {
    isAuthenticated.set(await this.client.isAuthenticated());
    const userData = await this.client.getUser();
    if (userData) {
      user.set(userData);
    }
  }

  async getUserAccessToken(): Promise<string> {
    return this.client.getTokenSilently();
  }

  private absoluteUrl(path: string): string {
    return `${window.location.origin}${path}`;
  }
}

export async function getUserDataFromToken(token: string): Promise<IUserData | null> {
  const userinfoResponse = await fetch(`https://${auth0Domain}/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userinfo = await userinfoResponse.json();
  if ('error' in userinfo) {
    return null; // TODO handle rate-limiting, do some caching?
  }
  const { sub, email, nickname } = userinfo;
  return new UserData(sub, email, nickname);
}

// TODO add Callback URLs in Auth0 management console
export default async function createClient(): Promise<Client> {
  const client = await createAuth0Client({
    domain: auth0Domain,
    client_id: '9eVpAJ2FxWu6SlSvk6ouXPNtGsZlWrtZ',
    useRefreshTokens: true,
    cacheLocation: 'localstorage',
  });

  return new Client(client);
}
