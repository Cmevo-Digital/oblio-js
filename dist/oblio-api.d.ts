import { AxiosInstance } from 'axios';
import { Map } from './types';
import { AccessToken } from './access-token/access-token';
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
