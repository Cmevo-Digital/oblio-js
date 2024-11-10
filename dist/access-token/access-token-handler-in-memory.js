"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenHandlerInMemory = void 0;
class AccessTokenHandlerInMemory {
    constructor() {
        this.accessToken = null;
    }
    get() {
        if (this.accessToken &&
            this.accessToken.request_time + this.accessToken.expires_in > Date.now() * 1000) {
            return this.accessToken;
        }
        return null;
    }
    set(accessToken) {
        this.accessToken = accessToken;
    }
}
exports.AccessTokenHandlerInMemory = AccessTokenHandlerInMemory;
//# sourceMappingURL=access-token-handler-in-memory.js.map