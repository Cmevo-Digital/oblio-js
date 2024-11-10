"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenHandlerInMemory = exports.AccessTokenHandlerFileStorage = exports.AccessToken = exports.OblioApiException = exports.OblioApi = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("node:fs"));
const path_1 = require("path");
class OblioApi {
    constructor(email, secret, cif) {
        this._cif = "";
        this._email = "";
        this._secret = "";
        this._accessTokenHandler = null;
        this._baseURL = "https://www.oblio.eu";
        this._cif = cif;
        this._email = email;
        this._secret = secret;
        this._accessTokenHandler = new AccessTokenHandlerInMemory();
    }
    async createInvoice(data) {
        return await this.createDoc("invoice", data);
    }
    async createProforma(data) {
        return await this.createDoc("proforma", data);
    }
    async createNotice(data) {
        return await this.createDoc("notice", data);
    }
    async createEInvoice(seriesName, number) {
        return await this.createDoc("einvoice", { seriesName, number });
    }
    async createDoc(type, data) {
        this._checkType(type);
        if (data.cif === undefined && this._cif !== "") {
            data.cif = this._cif;
        }
        if (!("cif" in data) || data.cif === "") {
            throw new OblioApiException("Empty cif");
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
            response = await request.put(`/api/docs/${type}/${cancel ? "cancel" : "restore"}`, {
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
            response = await request.put("/api/docs/invoice/collect", {
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
    async nomenclature(type, name = "", filters = {}) {
        let cif = "";
        switch (type) {
            case "companies":
                break;
            case "vat_rates":
            case "products":
            case "clients":
            case "series":
            case "languages":
            case "management":
                cif = this.getCif();
                break;
            default:
                throw new OblioApiException("Type not implemented");
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
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: accessToken.token_type + " " + accessToken.access_token,
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
            throw new OblioApiException("Email or secret are empty!");
        }
        const response = await axios_1.default.request({
            method: "post",
            url: `${this._baseURL}/api/authorize/token`,
            data: {
                client_id: this._email,
                client_secret: this._secret,
                grant_type: "client_credentials",
            },
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        if (response.status < 200 || response.status >= 300) {
            throw new OblioApiException(`Error authorize token! HTTP status: ${response.status}`, response.status);
        }
        return new AccessToken(response.data);
    }
    _checkType(type) {
        if (["invoice", "proforma", "notice", "receipt", "einvoice"].indexOf(type) ===
            -1) {
            throw new OblioApiException("Type not supported");
        }
    }
    _checkErrorResponse(response) {
        if (response.status < 200 || response.status >= 300) {
            if (!("statusMessage" in response.data)) {
                response.data = {
                    statusMessage: `Error! HTTP response status: ${response.status}`,
                };
            }
            throw new OblioApiException(response.data.statusMessage, response.status);
        }
    }
}
exports.OblioApi = OblioApi;
class OblioApiException {
    constructor(message = "", code = 0) {
        this.message = "";
        this.code = 0;
        this.message = message;
        this.code = code;
    }
}
exports.OblioApiException = OblioApiException;
class AccessToken {
    constructor(data) {
        this.request_time = data.request_time;
        this.expires_in = data.expires_in;
        this.token_type = data.token_type;
        this.access_token = data.access_token;
    }
}
exports.AccessToken = AccessToken;
class AccessTokenHandlerFileStorage {
    constructor(accessTokenFilePath = null) {
        this._accessTokenFilePath =
            accessTokenFilePath === null
                ? (0, path_1.dirname)("./") + "/../storage/.access_token"
                : accessTokenFilePath;
    }
    get() {
        if (fs.existsSync(this._accessTokenFilePath)) {
            const accessTokenFileContent = JSON.parse(fs.readFileSync(this._accessTokenFilePath, "utf-8"));
            const accessToken = new AccessToken(accessTokenFileContent);
            if (accessToken.request_time + accessToken.expires_in >
                Date.now() * 1000) {
                return accessToken;
            }
        }
        return null;
    }
    set(accessToken) {
        fs.mkdir((0, path_1.dirname)(this._accessTokenFilePath), { recursive: true }, (err) => {
            if (err)
                return;
            fs.writeFile(this._accessTokenFilePath, JSON.stringify(accessToken), (err) => {
                if (err) {
                    console.error("Error Oblio:: ", err);
                }
            });
        });
    }
}
exports.AccessTokenHandlerFileStorage = AccessTokenHandlerFileStorage;
class AccessTokenHandlerInMemory {
    constructor() {
        this.accessToken = null;
    }
    get() {
        if (this.accessToken &&
            this.accessToken.request_time + this.accessToken.expires_in >
                Date.now() * 1000) {
            return this.accessToken;
        }
        return null;
    }
    set(accessToken) {
        this.accessToken = accessToken;
    }
}
exports.AccessTokenHandlerInMemory = AccessTokenHandlerInMemory;
//# sourceMappingURL=index.js.map