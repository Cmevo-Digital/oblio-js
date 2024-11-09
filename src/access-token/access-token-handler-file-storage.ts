import * as fs from 'fs';
import { dirname } from 'path';
import { AccessToken } from './access-token';
import { AccessTokenHandlerInterface } from '../types';

/**
 * Stores the access token within a file
 * in /storage/.access_token.json
 */
export class AccessTokenHandlerFileStorage implements AccessTokenHandlerInterface {
  _accessTokenFilePath: string;

  constructor(accessTokenFilePath: string = null) {
    this._accessTokenFilePath =
      accessTokenFilePath === null
        ? dirname('./') + '/../storage/.access_token'
        : accessTokenFilePath;
  }

  get(): AccessToken {
    if (fs.existsSync(this._accessTokenFilePath)) {
      const accessTokenFileContent = JSON.parse(
        fs.readFileSync(this._accessTokenFilePath, 'utf-8'),
      );
      const accessToken = new AccessToken(accessTokenFileContent);
      if (accessToken.request_time + accessToken.expires_in > Date.now() * 1000) {
        return accessToken;
      }
    }
    return null;
  }

  set(accessToken: AccessToken): void {
    fs.mkdir(dirname(this._accessTokenFilePath), { recursive: true }, (err) => {
      if (err) return;

      fs.writeFile(this._accessTokenFilePath, JSON.stringify(accessToken), (err) => {
        if (err) {
          console.error('Error Oblio:: ', err);
        }
      });
    });
  }
}
