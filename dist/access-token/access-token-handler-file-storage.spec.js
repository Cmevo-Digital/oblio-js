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
Object.defineProperty(exports, "__esModule", { value: true });
const access_token_1 = require("./access-token");
const access_token_handler_file_storage_1 = require("./access-token-handler-file-storage");
const fs = __importStar(require("fs"));
jest.mock('fs');
describe('AccessTokenHandlerFileStorage', () => {
    let accessTokenHandler;
    const mockAccessTokenFilePath = 'mock/path/.access_token';
    beforeEach(() => {
        accessTokenHandler = new access_token_handler_file_storage_1.AccessTokenHandlerFileStorage(mockAccessTokenFilePath);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('get()', () => {
        it('should return access token if file exists and is not expired', () => {
            const mockAccessToken = {
                request_time: Date.now() * 1000,
                expires_in: 3600,
            };
            jest.spyOn(fs, 'existsSync').mockReturnValue(true);
            jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockAccessToken));
            const accessToken = accessTokenHandler.get();
            expect(accessToken).toBeInstanceOf(access_token_1.AccessToken);
            expect(accessToken.request_time).toBe(mockAccessToken.request_time);
        });
        it('should return null if the file does not exist', () => {
            jest.spyOn(fs, 'existsSync').mockReturnValue(false);
            const accessToken = accessTokenHandler.get();
            expect(accessToken).toBeNull();
        });
        it('should return null if the access token is expired', () => {
            const mockAccessToken = {
                request_time: Date.now() * 1000,
                expires_in: 0,
            };
            jest.spyOn(fs, 'existsSync').mockReturnValue(true);
            jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockAccessToken));
            const accessToken = accessTokenHandler.get();
            expect(accessToken).toBeNull();
        });
    });
});
//# sourceMappingURL=access-token-handler-file-storage.spec.js.map