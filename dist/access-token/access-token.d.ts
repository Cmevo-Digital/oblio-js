import { Map } from '../types';
export declare class AccessToken {
    request_time: number;
    expires_in: number;
    token_type: string;
    access_token: string;
    constructor(data: Map);
}
