"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OblioApi = void 0;
const axios_1 = __importDefault(require("axios"));
const access_token_1 = require("./access-token/access-token");
const api_exception_1 = require("./api-exception");
const access_token_handler_in_memory_1 = require("./access-token/access-token-handler-in-memory");
class OblioApi {
    constructor(email, secret, cif) {
        this._cif = '';
        this._email = '';
        this._secret = '';
        this._accessTokenHandler = null;
        this._baseURL = 'https://www.oblio.eu';
        this._cif = cif;
        this._email = email;
        this._secret = secret;
        this._accessTokenHandler = new access_token_handler_in_memory_1.AccessTokenHandlerInMemory();
    }
    async createInvoice(data) {
        return await this.createDoc('invoice', data);
    }
    async createProforma(data) {
        return await this.createDoc('proforma', data);
    }
    async createNotice(data) {
        return await this.createDoc('notice', data);
    }
    async createEInvoice(seriesName, number) {
        return await this.createDoc('einvoice', { seriesName, number });
    }
    async createDoc(type, data) {
        this._checkType(type);
        if (data.cif === undefined && this._cif !== '') {
            data.cif = this._cif;
        }
        if (!('cif' in data) || data.cif === '') {
            throw new api_exception_1.OblioApiException('Empty cif');
        }
        const request = await this.buildRequest();
        let response;
        try {
            response = await request.post(`/api/docs/${type}`, data);
        }
        catch (err) {
            response = err.response;
        }
        this._checkErrorResponse(response);
        return response.data;
    }
    async get(type, seriesName, number) {
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
        }
        catch (err) {
            response = err.response;
        }
        this._checkErrorResponse(response);
        return response.data;
    }
    async cancel(type, seriesName, number, cancel = true) {
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
        }
        catch (err) {
            response = err.response;
        }
        this._checkErrorResponse(response);
        return response.data;
    }
    async delete(type, seriesName, number) {
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
        }
        catch (err) {
            response = err.response;
        }
        this._checkErrorResponse(response);
        return response.data;
    }
    async collect(seriesName, number, collect) {
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
        }
        catch (err) {
            response = err.response;
        }
        this._checkErrorResponse(response);
        return response.data;
    }
    async nomenclature(type, name = '', filters = {}) {
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
                throw new api_exception_1.OblioApiException('Type not implemented');
        }
        const request = await this.buildRequest();
        let response;
        try {
            filters.cif = cif;
            filters.name = name;
            response = await request.get(`/api/nomenclature/${type}`, {
                params: filters,
            });
        }
        catch (err) {
            response = err.response;
        }
        this._checkErrorResponse(response);
        return response.data;
    }
    setCif(cif) {
        this._cif = cif;
    }
    getCif() {
        return this._cif;
    }
    async buildRequest() {
        const accessToken = await this.getAccessToken();
        const request = axios_1.default.create({
            baseURL: this._baseURL,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: accessToken.token_type + ' ' + accessToken.access_token,
            },
        });
        return request;
    }
    async getAccessToken() {
        let accessToken = this._accessTokenHandler.get();
        if (accessToken === null) {
            accessToken = await this._generateAccessToken();
            this._accessTokenHandler.set(accessToken);
        }
        return accessToken;
    }
    async _generateAccessToken() {
        if (!this._email || !this._secret) {
            throw new api_exception_1.OblioApiException('Email or secret are empty!');
        }
        const response = await axios_1.default.request({
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
            throw new api_exception_1.OblioApiException(`Error authorize token! HTTP status: ${response.status}`, response.status);
        }
        return new access_token_1.AccessToken(response.data);
    }
    _checkType(type) {
        if (['invoice', 'proforma', 'notice', 'receipt', 'einvoice'].indexOf(type) === -1) {
            throw new api_exception_1.OblioApiException('Type not supported');
        }
    }
    _checkErrorResponse(response) {
        if (response.status < 200 || response.status >= 300) {
            if (!('statusMessage' in response.data)) {
                response.data = {
                    statusMessage: `Error! HTTP response status: ${response.status}`,
                };
            }
            throw new api_exception_1.OblioApiException(response.data.statusMessage, response.status);
        }
    }
}
exports.OblioApi = OblioApi;
//# sourceMappingURL=oblio-api.js.map