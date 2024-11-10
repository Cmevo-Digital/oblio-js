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
exports.AccessTokenHandlerFileStorage = void 0;
const fs = __importStar(require("fs"));
const path_1 = require("path");
const access_token_1 = require("./access-token");
class AccessTokenHandlerFileStorage {
    constructor(accessTokenFilePath = null) {
        this._accessTokenFilePath =
            accessTokenFilePath === null
                ? (0, path_1.dirname)('./') + '/../storage/.access_token'
                : accessTokenFilePath;
    }
    get() {
        if (fs.existsSync(this._accessTokenFilePath)) {
            const accessTokenFileContent = JSON.parse(fs.readFileSync(this._accessTokenFilePath, 'utf-8'));
            const accessToken = new access_token_1.AccessToken(accessTokenFileContent);
            if (accessToken.request_time + accessToken.expires_in > Date.now() * 1000) {
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
                    console.error('Error Oblio:: ', err);
                }
            });
        });
    }
}
exports.AccessTokenHandlerFileStorage = AccessTokenHandlerFileStorage;
//# sourceMappingURL=access-token-handler-file-storage.js.map