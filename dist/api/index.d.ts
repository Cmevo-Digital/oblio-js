import { AxiosInstance } from "axios";
export declare class OblioApi {
    _cif: string;
    _email: string;
    _secret: string;
    _accessTokenHandler: any;
    _baseURL: string;
    constructor(email: string, secret: string, cif: string);
    createInvoice(data: Map): Promise<Map>;
    createProforma(data: Map): Promise<Map>;
    createNotice(data: Map): Promise<Map>;
    createEInvoice(seriesName: string, number: string): Promise<Map>;
    createDoc(type: string, data: Map): Promise<Map>;
    get(type: string, seriesName: string, number: number): Promise<Map>;
    cancel(type: string, seriesName: string, number: number, cancel?: boolean): Promise<Map>;
    delete(type: string, seriesName: string, number: number): Promise<Map>;
    collect(seriesName: string, number: number, collect: Map): Promise<Map>;
    nomenclature(type: string, name?: string, filters?: Map): Promise<Map>;
    setCif(cif: string): void;
    getCif(): string;
    buildRequest(): Promise<AxiosInstance>;
    getAccessToken(): Promise<AccessToken>;
    _generateAccessToken(): Promise<AccessToken>;
    _checkType(type: string): void;
    _checkErrorResponse(response: Map): void;
}
interface Map {
    [key: string]: any;
}
export declare class OblioApiException {
    message: string;
    code: number;
    constructor(message?: string, code?: number);
}
export interface AccessTokenInterface {
    request_time: number;
    expires_in: number;
    token_type: string;
    access_token: string;
}
export declare class AccessToken {
    request_time: number;
    expires_in: number;
    token_type: string;
    access_token: string;
    constructor(data: Map);
}
export interface AccessTokenHandlerInterface {
    get(): AccessToken;
    set(accessToken: AccessToken): void;
}
export declare class AccessTokenHandlerFileStorage implements AccessTokenHandlerInterface {
    _accessTokenFilePath: string;
    constructor(accessTokenFilePath?: string);
    get(): AccessToken;
    set(accessToken: AccessToken): void;
}
export declare class AccessTokenHandlerInMemory implements AccessTokenHandlerInterface {
    private accessToken;
    get(): AccessToken;
    set(accessToken: AccessToken): void;
}
export {};
