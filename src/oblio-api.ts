import axios, { AxiosInstance } from 'axios';
import { Map } from './types';
import { AccessToken } from './access-token/access-token';
import { OblioApiException } from './api-exception';
import { AccessTokenHandlerInMemory } from './access-token/access-token-handler-in-memory';

/**
 * Doc: https://github.com/OblioSoftware/OblioApiJs/blob/main/src/Api.ts
 *
 * Oblio has rate limits:
 * - create invoice 30 req / 100s
 * - others 30 req / 60s
 */
export class OblioApi {
  _cif = '';
  _email = '';
  _secret = '';
  _accessTokenHandler: any = null;
  _baseURL = 'https://www.oblio.eu';

  constructor(email: string, secret: string, cif: string) {
    this._cif = cif;
    this._email = email;
    this._secret = secret;
    this._accessTokenHandler = new AccessTokenHandlerInMemory();
  }

  async createInvoice(data: Map): Promise<Map> {
    return await this.createDoc('invoice', data);
  }

  async createProforma(data: Map): Promise<Map> {
    return await this.createDoc('proforma', data);
  }

  async createNotice(data: Map): Promise<Map> {
    return await this.createDoc('notice', data);
  }

  async createEInvoice(seriesName: string, number: string): Promise<Map> {
    return await this.createDoc('einvoice', { seriesName, number });
  }

  async createDoc(type: string, data: Map): Promise<Map> {
    this._checkType(type);
    if (data.cif === undefined && this._cif !== '') {
      data.cif = this._cif;
    }
    if (!('cif' in data) || data.cif === '') {
      throw new OblioApiException('Empty cif');
    }
    const request = await this.buildRequest();
    let response;
    try {
      response = await request.post(`/api/docs/${type}`, data);
    } catch (err: any) {
      response = err.response;
    }
    this._checkErrorResponse(response);
    return response.data;
  }

  async get(type: string, seriesName: string, number: number): Promise<Map> {
    this._checkType(type);
    const cif = this.getCif();
    const request = await this.buildRequest();
    let response;

    try {
      response = await request.get(`/api/docs/${type}`, {
        params: {
          cif: cif,
          seriesName: seriesName,
          number: number,
        },
      });
    } catch (err: any) {
      response = err.response;
    }
    this._checkErrorResponse(response);
    return response.data;
  }

  async cancel(type: string, seriesName: string, number: number, cancel = true): Promise<Map> {
    this._checkType(type);
    const cif = this.getCif();
    const request = await this.buildRequest();
    let response;

    try {
      response = await request.put(`/api/docs/${type}/${cancel ? 'cancel' : 'restore'}`, {
        cif: cif,
        seriesName: seriesName,
        number: number,
      });
    } catch (err: any) {
      response = err.response;
    }
    this._checkErrorResponse(response);
    return response.data;
  }

  async delete(type: string, seriesName: string, number: number): Promise<Map> {
    this._checkType(type);
    const cif = this.getCif();
    const request = await this.buildRequest();
    let response;

    try {
      response = await request.delete(`/api/docs/${type}`, {
        data: {
          cif: cif,
          seriesName: seriesName,
          number: number,
        },
      });
    } catch (err: any) {
      response = err.response;
    }
    this._checkErrorResponse(response);
    return response.data;
  }

  async collect(seriesName: string, number: number, collect: Map): Promise<Map> {
    const cif = this.getCif();
    const request = await this.buildRequest();
    let response;

    try {
      response = await request.put('/api/docs/invoice/collect', {
        cif: cif,
        seriesName: seriesName,
        number: number,
        collect: collect,
      });
    } catch (err: any) {
      response = err.response;
    }
    this._checkErrorResponse(response);
    return response.data;
  }

  async nomenclature(type: string, name = '', filters: Map = {}): Promise<Map> {
    let cif = '';
    switch (type) {
      case 'companies':
        break;
      case 'vat_rates':
      case 'products':
      case 'clients':
      case 'series':
      case 'languages':
      case 'management':
        cif = this.getCif();
        break;
      default:
        throw new OblioApiException('Type not implemented');
    }
    const request = await this.buildRequest();
    let response;

    try {
      filters.cif = cif;
      filters.name = name;
      response = await request.get(`/api/nomenclature/${type}`, {
        params: filters,
      });
    } catch (err: any) {
      response = err.response;
    }
    this._checkErrorResponse(response);
    return response.data;
  }

  setCif(cif: string): void {
    this._cif = cif;
  }

  getCif(): string {
    return this._cif;
  }

  async buildRequest(): Promise<AxiosInstance> {
    const accessToken: AccessToken = await this.getAccessToken();
    const request = axios.create({
      baseURL: this._baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: accessToken.token_type + ' ' + accessToken.access_token,
      },
    });
    return request;
  }

  async getAccessToken(): Promise<AccessToken> {
    let accessToken: AccessToken = this._accessTokenHandler.get();
    if (accessToken === null) {
      accessToken = await this._generateAccessToken();
      this._accessTokenHandler.set(accessToken);
    }
    return accessToken;
  }

  async _generateAccessToken(): Promise<AccessToken> {
    if (!this._email || !this._secret) {
      throw new OblioApiException('Email or secret are empty!');
    }
    const response = await axios.request({
      method: 'post',
      url: `${this._baseURL}/api/authorize/token`,
      data: {
        client_id: this._email,
        client_secret: this._secret,
        grant_type: 'client_credentials',
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.status < 200 || response.status >= 300) {
      throw new OblioApiException(
        `Error authorize token! HTTP status: ${response.status}`,
        response.status,
      );
    }
    return new AccessToken(response.data);
  }

  _checkType(type: string): void {
    if (['invoice', 'proforma', 'notice', 'receipt', 'einvoice'].indexOf(type) === -1) {
      throw new OblioApiException('Type not supported');
    }
  }

  _checkErrorResponse(response: Map): void {
    if (response.status < 200 || response.status >= 300) {
      if (!('statusMessage' in response.data)) {
        response.data = {
          statusMessage: `Error! HTTP response status: ${response.status}`,
        };
      }
      throw new OblioApiException(response.data.statusMessage, response.status);
    }
  }
}
