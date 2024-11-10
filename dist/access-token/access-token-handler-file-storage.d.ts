import { AccessToken } from './access-token';
import { AccessTokenHandlerInterface } from '../types';
export declare class AccessTokenHandlerFileStorage implements AccessTokenHandlerInterface {
    _accessTokenFilePath: string;
    constructor(accessTokenFilePath?: string);
    get(): AccessToken;
    set(accessToken: AccessToken): void;
}
