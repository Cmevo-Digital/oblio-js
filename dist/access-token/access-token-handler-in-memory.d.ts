import { AccessTokenHandlerInterface } from '../types';
import { AccessToken } from './access-token';
export declare class AccessTokenHandlerInMemory implements AccessTokenHandlerInterface {
    private accessToken;
    get(): AccessToken;
    set(accessToken: AccessToken): void;
}
