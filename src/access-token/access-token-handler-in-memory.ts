import { AccessTokenHandlerInterface } from '../types';
import { AccessToken } from './access-token';

/**
 * Stores the access token in memory
 */
export class AccessTokenHandlerInMemory implements AccessTokenHandlerInterface {
  private accessToken: AccessToken = null;

  get(): AccessToken {
    // check if token is not expired and return it
    if (
      this.accessToken &&
      this.accessToken.request_time + this.accessToken.expires_in > Date.now() * 1000
    ) {
      return this.accessToken;
    }

    return null;
  }

  set(accessToken: AccessToken): void {
    this.accessToken = accessToken;
  }
}
