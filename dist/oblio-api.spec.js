"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const oblio_api_1 = require("./oblio-api");
const api_exception_1 = require("./api-exception");
const access_token_1 = require("./access-token/access-token");
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('OblioApi', () => {
    let oblioApi;
    const testEmail = 'test@example.com';
    const testSecret = 'secret123';
    const testCif = 'RO123456';
    beforeEach(() => {
        oblioApi = new oblio_api_1.OblioApi(testEmail, testSecret, testCif);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('constructor', () => {
        it('should initialize with correct values', () => {
            expect(oblioApi.getCif()).toBe(testCif);
        });
    });
    describe('_generateAccessToken', () => {
        it('should generate access token successfully', async () => {
            const mockTokenResponse = {
                status: 200,
                data: {
                    request_time: Date.now(),
                    expires_in: 3600,
                    token_type: 'Bearer',
                    access_token: 'mock-token',
                },
            };
            mockedAxios.request.mockResolvedValueOnce(mockTokenResponse);
            const result = await oblioApi._generateAccessToken();
            expect(result).toBeInstanceOf(access_token_1.AccessToken);
            expect(result.access_token).toBe('mock-token');
            expect(mockedAxios.request).toHaveBeenCalledWith({
                method: 'post',
                url: 'https://www.oblio.eu/api/authorize/token',
                data: {
                    client_id: testEmail,
                    client_secret: testSecret,
                    grant_type: 'client_credentials',
                },
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
        });
        it('should throw error when authorization fails', async () => {
            const mockError = {
                status: 401,
                data: {},
            };
            mockedAxios.request.mockResolvedValueOnce(mockError);
            await expect(oblioApi._generateAccessToken()).rejects.toEqual(new api_exception_1.OblioApiException(`Error authorize token! HTTP status: ${mockError.status}`, mockError.status));
        });
    });
    describe('createInvoice', () => {
        it('should create invoice successfully', async () => {
            const mockInvoiceData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 200,
                data: { success: true },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                post: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.createInvoice(mockInvoiceData);
            expect(result).toEqual({ success: true });
        });
        it('should throw error when invoice creation fails', async () => {
            const mockInvoiceData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 400,
                data: { statusMessage: 'Invalid data' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                post: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.createInvoice(mockInvoiceData)).rejects.toEqual(new api_exception_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe('createProforma', () => {
        it('should create proforma successfully', async () => {
            const mockProformaData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 200,
                data: { success: true, docType: 'proforma' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                post: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.createProforma(mockProformaData);
            expect(result).toEqual({ success: true, docType: 'proforma' });
        });
        it('should throw error when proforma creation fails', async () => {
            const mockProformaData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 400,
                data: { statusMessage: 'Invalid proforma data' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                post: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.createProforma(mockProformaData)).rejects.toEqual(new api_exception_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe('createNotice', () => {
        it('should create notice successfully', async () => {
            const mockNoticeData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 200,
                data: { success: true, docType: 'notice' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                post: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.createNotice(mockNoticeData);
            expect(result).toEqual({ success: true, docType: 'notice' });
        });
        it('should throw error when notice creation fails', async () => {
            const mockNoticeData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 400,
                data: { statusMessage: 'Invalid notice data' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                post: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.createNotice(mockNoticeData)).rejects.toEqual(new api_exception_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe('createEInvoice', () => {
        it('should create e-invoice successfully', async () => {
            const seriesName = 'TEST';
            const number = '123';
            const mockResponse = {
                status: 200,
                data: { success: true, docType: 'einvoice' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                post: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.createEInvoice(seriesName, number);
            expect(result).toEqual({ success: true, docType: 'einvoice' });
        });
        it('should throw error when e-invoice creation fails', async () => {
            const seriesName = 'TEST';
            const number = '123';
            const mockResponse = {
                status: 400,
                data: { statusMessage: 'Invalid e-invoice data' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                post: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.createEInvoice(seriesName, number)).rejects.toEqual(new api_exception_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe('collect', () => {
        it('should collect payment successfully', async () => {
            const seriesName = 'TEST';
            const number = 123;
            const collectData = {
                amount: 100,
                date: '2023-01-01',
            };
            const mockResponse = {
                status: 200,
                data: { success: true, collected: true },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                put: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.collect(seriesName, number, collectData);
            expect(result).toEqual({ success: true, collected: true });
        });
        it('should throw error when collection fails', async () => {
            const seriesName = 'TEST';
            const number = 123;
            const collectData = {
                amount: 100,
                date: '2023-01-01',
            };
            const mockResponse = {
                status: 400,
                data: { statusMessage: 'Invalid collection data' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                put: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.collect(seriesName, number, collectData)).rejects.toEqual(new api_exception_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe('nomenclature', () => {
        it('should fetch nomenclature successfully', async () => {
            const type = 'products';
            const name = 'test';
            const filters = { active: true };
            const mockResponse = {
                status: 200,
                data: { items: [] },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                get: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.nomenclature(type, name, filters);
            expect(result).toEqual({ items: [] });
        });
        it('should throw error for invalid nomenclature type', async () => {
            const type = 'invalid';
            const name = 'test';
            const filters = {};
            await expect(oblioApi.nomenclature(type, name, filters)).rejects.toEqual(new api_exception_1.OblioApiException('Type not implemented'));
        });
        it('should handle nomenclature fetch error', async () => {
            const type = 'products';
            const name = 'test';
            const filters = {};
            const mockResponse = {
                status: 400,
                data: { statusMessage: 'Invalid request' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                get: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.nomenclature(type, name, filters)).rejects.toEqual(new api_exception_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe('_checkType', () => {
        it('should accept valid document types', () => {
            const validTypes = ['invoice', 'proforma', 'notice', 'receipt', 'einvoice'];
            validTypes.forEach((type) => {
                expect(() => oblioApi._checkType(type)).not.toThrow();
            });
        });
        it('should throw error for invalid document type', () => {
            expect(() => oblioApi._checkType('invalid')).toThrow(api_exception_1.OblioApiException);
        });
    });
    describe('cancel', () => {
        it('should cancel document successfully', async () => {
            const mockResponse = {
                status: 200,
                data: { cancelled: true },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                put: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.cancel('invoice', 'SERIES', 1);
            expect(result).toEqual({ cancelled: true });
        });
    });
    describe('delete', () => {
        it('should delete document successfully', async () => {
            const mockResponse = {
                status: 200,
                data: { deleted: true },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                delete: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.delete('invoice', 'SERIES', 1);
            expect(result).toEqual({ deleted: true });
        });
    });
    describe('createDoc', () => {
        it('should create document successfully', async () => {
            const docType = 'invoice';
            const docData = { amount: 100 };
            const mockResponse = {
                status: 200,
                data: { success: true, docType: 'invoice' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                post: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.createDoc(docType, docData);
            expect(result).toEqual({ success: true, docType: 'invoice' });
        });
        it('should throw error for invalid document type', async () => {
            const docType = 'invalid';
            const docData = { amount: 100 };
            await expect(oblioApi.createDoc(docType, docData)).rejects.toEqual(new api_exception_1.OblioApiException('Type not supported', 0));
        });
        it('should handle API error response', async () => {
            const docType = 'invoice';
            const docData = { amount: 100 };
            const mockResponse = {
                status: 400,
                data: { statusMessage: 'Invalid document data' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                post: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.createDoc(docType, docData)).rejects.toEqual(new api_exception_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe('get', () => {
        it('should get document successfully', async () => {
            const docType = 'invoice';
            const series = 'TEST';
            const number = 123;
            const mockResponse = {
                status: 200,
                data: { docType: 'invoice', series: 'TEST', number: 123 },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                get: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.get(docType, series, number);
            expect(result).toEqual({
                docType: 'invoice',
                series: 'TEST',
                number: 123,
            });
        });
        it('should throw error for invalid document type', async () => {
            await expect(oblioApi.get('invalid', 'TEST', 123)).rejects.toEqual(new api_exception_1.OblioApiException('Type not supported', 0));
        });
        it('should handle not found error', async () => {
            const mockResponse = {
                status: 404,
                data: { statusMessage: 'Document not found' },
            };
            jest.spyOn(oblioApi, 'buildRequest').mockResolvedValueOnce({
                get: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.get('invoice', 'TEST', 123)).rejects.toEqual(new api_exception_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe('getAccessToken', () => {
        it('should return existing valid token', async () => {
            const validToken = new access_token_1.AccessToken({
                access_token: 'valid-token',
                token_type: 'Bearer',
                expires_in: 3600,
                request_time: Date.now(),
            });
            jest.spyOn(oblioApi, '_generateAccessToken').mockResolvedValueOnce(validToken);
            const token = await oblioApi.getAccessToken();
            expect(token.access_token).toBe('valid-token');
        });
        it('should generate new token when no token exists', async () => {
            const validToken = new access_token_1.AccessToken({
                access_token: 'new-token',
                token_type: 'Bearer',
                expires_in: 3600,
                request_time: Date.now(),
            });
            jest.spyOn(oblioApi, '_generateAccessToken').mockResolvedValueOnce(validToken);
            const token = await oblioApi.getAccessToken();
            expect(token.access_token).toBe('new-token');
        });
        it('should generate new token when current token is expired', async () => {
            const expiredToken = new access_token_1.AccessToken({
                access_token: 'expired-token',
                token_type: 'Bearer',
                expires_in: 0,
                request_time: Date.now() - 3601000,
            });
            const validToken = new access_token_1.AccessToken({
                access_token: 'new-token',
                token_type: 'Bearer',
                expires_in: 3600,
                request_time: Date.now(),
            });
            oblioApi.accessToken = expiredToken;
            jest.spyOn(oblioApi, '_generateAccessToken').mockResolvedValueOnce(validToken);
            const token = await oblioApi.getAccessToken();
            expect(token.access_token).toBe('new-token');
        });
    });
    describe('_checkType', () => {
        it('should accept valid document types', () => {
            const validTypes = ['invoice', 'proforma', 'notice', 'receipt'];
            validTypes.forEach((type) => {
                expect(() => {
                    oblioApi._checkType(type);
                }).not.toThrow();
            });
        });
        it('should throw error for invalid document type', () => {
            expect(() => {
                oblioApi._checkType('invalid');
            }).toThrow(api_exception_1.OblioApiException);
        });
        it('should throw error for empty document type', () => {
            expect(() => {
                oblioApi._checkType('');
            }).toThrow(api_exception_1.OblioApiException);
        });
        it('should throw error for undefined document type', () => {
            expect(() => {
                oblioApi._checkType(undefined);
            }).toThrow(api_exception_1.OblioApiException);
        });
    });
});
//# sourceMappingURL=oblio-api.spec.js.map