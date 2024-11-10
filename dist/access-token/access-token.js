"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessToken = void 0;
class AccessToken {
    constructor(data) {
        this.request_time = data.request_time;
        this.expires_in = data.expires_in;
        this.token_type = data.token_type;
        this.access_token = data.access_token;
    }
}
exports.AccessToken = AccessToken;
//# sourceMappingURL=access-token.js.map