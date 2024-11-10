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
const axios_1 = __importDefault(require("axios"));
const index_1 = require("./index");
const fs = __importStar(require("fs"));
jest.mock("axios");
const mockedAxios = axios_1.default;
describe("OblioApi", () => {
    let oblioApi;
    const testEmail = "test@example.com";
    const testSecret = "secret123";
    const testCif = "RO123456";
    beforeEach(() => {
        oblioApi = new index_1.OblioApi(testEmail, testSecret, testCif);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("constructor", () => {
        it("should initialize with correct values", () => {
            expect(oblioApi.getCif()).toBe(testCif);
        });
    });
    describe("_generateAccessToken", () => {
        it("should generate access token successfully", async () => {
            const mockTokenResponse = {
                status: 200,
                data: {
                    request_time: Date.now(),
                    expires_in: 3600,
                    token_type: "Bearer",
                    access_token: "mock-token",
                },
            };
            mockedAxios.request.mockResolvedValueOnce(mockTokenResponse);
            const result = await oblioApi._generateAccessToken();
            expect(result).toBeInstanceOf(index_1.AccessToken);
            expect(result.access_token).toBe("mock-token");
            expect(mockedAxios.request).toHaveBeenCalledWith({
                method: "post",
                url: "https://www.oblio.eu/api/authorize/token",
                data: {
                    client_id: testEmail,
                    client_secret: testSecret,
                    grant_type: "client_credentials",
                },
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
        });
        it("should throw error when authorization fails", async () => {
            const mockError = {
                status: 401,
                data: {},
            };
            mockedAxios.request.mockResolvedValueOnce(mockError);
            await expect(oblioApi._generateAccessToken()).rejects.toEqual(new index_1.OblioApiException(`Error authorize token! HTTP status: ${mockError.status}`, mockError.status));
        });
    });
    describe("createInvoice", () => {
        it("should create invoice successfully", async () => {
            const mockInvoiceData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 200,
                data: { success: true },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                post: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.createInvoice(mockInvoiceData);
            expect(result).toEqual({ success: true });
        });
        it("should throw error when invoice creation fails", async () => {
            const mockInvoiceData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 400,
                data: { statusMessage: "Invalid data" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                post: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.createInvoice(mockInvoiceData)).rejects.toEqual(new index_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe("createProforma", () => {
        it("should create proforma successfully", async () => {
            const mockProformaData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 200,
                data: { success: true, docType: "proforma" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                post: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.createProforma(mockProformaData);
            expect(result).toEqual({ success: true, docType: "proforma" });
        });
        it("should throw error when proforma creation fails", async () => {
            const mockProformaData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 400,
                data: { statusMessage: "Invalid proforma data" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                post: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.createProforma(mockProformaData)).rejects.toEqual(new index_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe("createNotice", () => {
        it("should create notice successfully", async () => {
            const mockNoticeData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 200,
                data: { success: true, docType: "notice" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                post: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.createNotice(mockNoticeData);
            expect(result).toEqual({ success: true, docType: "notice" });
        });
        it("should throw error when notice creation fails", async () => {
            const mockNoticeData = {
                cif: testCif,
                amount: 100,
            };
            const mockResponse = {
                status: 400,
                data: { statusMessage: "Invalid notice data" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                post: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.createNotice(mockNoticeData)).rejects.toEqual(new index_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe("createEInvoice", () => {
        it("should create e-invoice successfully", async () => {
            const seriesName = "TEST";
            const number = "123";
            const mockResponse = {
                status: 200,
                data: { success: true, docType: "einvoice" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                post: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.createEInvoice(seriesName, number);
            expect(result).toEqual({ success: true, docType: "einvoice" });
        });
        it("should throw error when e-invoice creation fails", async () => {
            const seriesName = "TEST";
            const number = "123";
            const mockResponse = {
                status: 400,
                data: { statusMessage: "Invalid e-invoice data" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                post: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.createEInvoice(seriesName, number)).rejects.toEqual(new index_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe("collect", () => {
        it("should collect payment successfully", async () => {
            const seriesName = "TEST";
            const number = 123;
            const collectData = {
                amount: 100,
                date: "2023-01-01",
            };
            const mockResponse = {
                status: 200,
                data: { success: true, collected: true },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                put: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.collect(seriesName, number, collectData);
            expect(result).toEqual({ success: true, collected: true });
        });
        it("should throw error when collection fails", async () => {
            const seriesName = "TEST";
            const number = 123;
            const collectData = {
                amount: 100,
                date: "2023-01-01",
            };
            const mockResponse = {
                status: 400,
                data: { statusMessage: "Invalid collection data" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                put: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.collect(seriesName, number, collectData)).rejects.toEqual(new index_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe("nomenclature", () => {
        it("should fetch nomenclature successfully", async () => {
            const type = "products";
            const name = "test";
            const filters = { active: true };
            const mockResponse = {
                status: 200,
                data: { items: [] },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                get: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.nomenclature(type, name, filters);
            expect(result).toEqual({ items: [] });
        });
        it("should throw error for invalid nomenclature type", async () => {
            const type = "invalid";
            const name = "test";
            const filters = {};
            await expect(oblioApi.nomenclature(type, name, filters)).rejects.toEqual(new index_1.OblioApiException("Type not implemented"));
        });
        it("should handle nomenclature fetch error", async () => {
            const type = "products";
            const name = "test";
            const filters = {};
            const mockResponse = {
                status: 400,
                data: { statusMessage: "Invalid request" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                get: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.nomenclature(type, name, filters)).rejects.toEqual(new index_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe("_checkType", () => {
        it("should accept valid document types", () => {
            const validTypes = [
                "invoice",
                "proforma",
                "notice",
                "receipt",
                "einvoice",
            ];
            validTypes.forEach((type) => {
                expect(() => oblioApi._checkType(type)).not.toThrow();
            });
        });
        it("should throw error for invalid document type", () => {
            expect(() => oblioApi._checkType("invalid")).toThrow(index_1.OblioApiException);
        });
    });
    describe("cancel", () => {
        it("should cancel document successfully", async () => {
            const mockResponse = {
                status: 200,
                data: { cancelled: true },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                put: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.cancel("invoice", "SERIES", 1);
            expect(result).toEqual({ cancelled: true });
        });
    });
    describe("delete", () => {
        it("should delete document successfully", async () => {
            const mockResponse = {
                status: 200,
                data: { deleted: true },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                delete: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.delete("invoice", "SERIES", 1);
            expect(result).toEqual({ deleted: true });
        });
    });
    describe("createDoc", () => {
        it("should create document successfully", async () => {
            const docType = "invoice";
            const docData = { amount: 100 };
            const mockResponse = {
                status: 200,
                data: { success: true, docType: "invoice" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                post: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.createDoc(docType, docData);
            expect(result).toEqual({ success: true, docType: "invoice" });
        });
        it("should throw error for invalid document type", async () => {
            const docType = "invalid";
            const docData = { amount: 100 };
            await expect(oblioApi.createDoc(docType, docData)).rejects.toEqual(new index_1.OblioApiException("Type not supported", 0));
        });
        it("should handle API error response", async () => {
            const docType = "invoice";
            const docData = { amount: 100 };
            const mockResponse = {
                status: 400,
                data: { statusMessage: "Invalid document data" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                post: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.createDoc(docType, docData)).rejects.toEqual(new index_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe("get", () => {
        it("should get document successfully", async () => {
            const docType = "invoice";
            const series = "TEST";
            const number = 123;
            const mockResponse = {
                status: 200,
                data: { docType: "invoice", series: "TEST", number: 123 },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                get: jest.fn().mockResolvedValueOnce(mockResponse),
            });
            const result = await oblioApi.get(docType, series, number);
            expect(result).toEqual({
                docType: "invoice",
                series: "TEST",
                number: 123,
            });
        });
        it("should throw error for invalid document type", async () => {
            await expect(oblioApi.get("invalid", "TEST", 123)).rejects.toEqual(new index_1.OblioApiException("Type not supported", 0));
        });
        it("should handle not found error", async () => {
            const mockResponse = {
                status: 404,
                data: { statusMessage: "Document not found" },
            };
            jest.spyOn(oblioApi, "buildRequest").mockResolvedValueOnce({
                get: jest.fn().mockRejectedValueOnce({
                    response: mockResponse,
                }),
            });
            await expect(oblioApi.get("invoice", "TEST", 123)).rejects.toEqual(new index_1.OblioApiException(mockResponse.data.statusMessage, mockResponse.status));
        });
    });
    describe("getAccessToken", () => {
        it("should return existing valid token", async () => {
            const validToken = new index_1.AccessToken({
                access_token: "valid-token",
                token_type: "Bearer",
                expires_in: 3600,
                request_time: Date.now(),
            });
            jest
                .spyOn(oblioApi, "_generateAccessToken")
                .mockResolvedValueOnce(validToken);
            const token = await oblioApi.getAccessToken();
            expect(token.access_token).toBe("valid-token");
        });
        it("should generate new token when no token exists", async () => {
            const validToken = new index_1.AccessToken({
                access_token: "new-token",
                token_type: "Bearer",
                expires_in: 3600,
                request_time: Date.now(),
            });
            jest
                .spyOn(oblioApi, "_generateAccessToken")
                .mockResolvedValueOnce(validToken);
            const token = await oblioApi.getAccessToken();
            expect(token.access_token).toBe("new-token");
        });
        it("should generate new token when current token is expired", async () => {
            const expiredToken = new index_1.AccessToken({
                access_token: "expired-token",
                token_type: "Bearer",
                expires_in: 0,
                request_time: Date.now() - 3601000,
            });
            const validToken = new index_1.AccessToken({
                access_token: "new-token",
                token_type: "Bearer",
                expires_in: 3600,
                request_time: Date.now(),
            });
            oblioApi.accessToken = expiredToken;
            jest
                .spyOn(oblioApi, "_generateAccessToken")
                .mockResolvedValueOnce(validToken);
            const token = await oblioApi.getAccessToken();
            expect(token.access_token).toBe("new-token");
        });
    });
    describe("_checkType", () => {
        it("should accept valid document types", () => {
            const validTypes = ["invoice", "proforma", "notice", "receipt"];
            validTypes.forEach((type) => {
                expect(() => {
                    oblioApi._checkType(type);
                }).not.toThrow();
            });
        });
        it("should throw error for invalid document type", () => {
            expect(() => {
                oblioApi._checkType("invalid");
            }).toThrow(index_1.OblioApiException);
        });
        it("should throw error for empty document type", () => {
            expect(() => {
                oblioApi._checkType("");
            }).toThrow(index_1.OblioApiException);
        });
        it("should throw error for undefined document type", () => {
            expect(() => {
                oblioApi._checkType(undefined);
            }).toThrow(index_1.OblioApiException);
        });
    });
});
describe("AccessTokenHandlerFileStorage", () => {
    jest.mock("node:fs");
    let accessTokenHandler;
    const mockAccessTokenFilePath = "mock/path/.access_token";
    beforeEach(() => {
        accessTokenHandler = new index_1.AccessTokenHandlerFileStorage(mockAccessTokenFilePath);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("get()", () => {
        it("should return access token if file exists and is not expired", () => {
            const mockAccessToken = {
                request_time: Date.now() * 1000,
                expires_in: 3600,
            };
            jest.spyOn(fs, "existsSync").mockReturnValue(true);
            jest
                .spyOn(fs, "readFileSync")
                .mockReturnValue(JSON.stringify(mockAccessToken));
            const accessToken = accessTokenHandler.get();
            expect(accessToken).toBeInstanceOf(index_1.AccessToken);
            expect(accessToken.request_time).toBe(mockAccessToken.request_time);
        });
        it("should return null if the file does not exist", () => {
            jest.spyOn(fs, "existsSync").mockReturnValue(false);
            const accessToken = accessTokenHandler.get();
            expect(accessToken).toBeNull();
        });
        it("should return null if the access token is expired", () => {
            const mockAccessToken = {
                request_time: Date.now() * 1000,
                expires_in: 0,
            };
            jest.spyOn(fs, "existsSync").mockReturnValue(true);
            jest
                .spyOn(fs, "readFileSync")
                .mockReturnValue(JSON.stringify(mockAccessToken));
            const accessToken = accessTokenHandler.get();
            expect(accessToken).toBeNull();
        });
    });
});
describe("AccessTokenHandlerInMemory", () => {
    let tokenHandler;
    beforeEach(() => {
        tokenHandler = new index_1.AccessTokenHandlerInMemory();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("get", () => {
        it("should return null when no token is set", () => {
            const token = tokenHandler.get();
            expect(token).toBeNull();
        });
        it("should return the stored token", () => {
            const mockToken = new index_1.AccessToken({
                access_token: "test-token",
                token_type: "Bearer",
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            tokenHandler.set(mockToken);
            const retrievedToken = tokenHandler.get();
            expect(retrievedToken).toEqual(mockToken);
        });
    });
    describe("set", () => {
        it("should store the token", () => {
            const mockToken = new index_1.AccessToken({
                access_token: "test-token",
                token_type: "Bearer",
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            tokenHandler.set(mockToken);
            const storedToken = tokenHandler.get();
            expect(storedToken).toEqual(mockToken);
        });
        it("should override existing token", () => {
            const firstToken = new index_1.AccessToken({
                access_token: "first-token",
                token_type: "Bearer",
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            const secondToken = new index_1.AccessToken({
                access_token: "second-token",
                token_type: "Bearer",
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            tokenHandler.set(firstToken);
            tokenHandler.set(secondToken);
            const storedToken = tokenHandler.get();
            expect(storedToken).toEqual(secondToken);
            expect(storedToken === null || storedToken === void 0 ? void 0 : storedToken.access_token).toBe("second-token");
        });
        it("should handle null token", () => {
            tokenHandler.set(null);
            const storedToken = tokenHandler.get();
            expect(storedToken).toBeNull();
        });
    });
    describe("multiple instances", () => {
        it("should maintain separate token storage for different instances", () => {
            var _a, _b;
            const handler1 = new index_1.AccessTokenHandlerInMemory();
            const handler2 = new index_1.AccessTokenHandlerInMemory();
            const token1 = new index_1.AccessToken({
                access_token: "token-1",
                token_type: "Bearer",
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            const token2 = new index_1.AccessToken({
                access_token: "token-2",
                token_type: "Bearer",
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            handler1.set(token1);
            handler2.set(token2);
            expect((_a = handler1.get()) === null || _a === void 0 ? void 0 : _a.access_token).toBe("token-1");
            expect((_b = handler2.get()) === null || _b === void 0 ? void 0 : _b.access_token).toBe("token-2");
        });
    });
    describe("edge cases", () => {
        it("should handle undefined token properties", () => {
            const invalidToken = new index_1.AccessToken({
                access_token: undefined,
                token_type: undefined,
                expires_in: undefined,
                request_time: undefined,
            });
            expect(() => tokenHandler.set(invalidToken)).not.toThrow();
        });
        it("should handle malformed token object", () => {
            const malformedToken = {};
            expect(() => tokenHandler.set(malformedToken)).not.toThrow();
            expect(tokenHandler.get()).toBeNull();
        });
    });
});
//# sourceMappingURL=index.spec.js.map