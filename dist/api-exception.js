"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OblioApiException = void 0;
class OblioApiException {
    constructor(message = '', code = 0) {
        this.message = '';
        this.code = 0;
        this.message = message;
        this.code = code;
    }
}
exports.OblioApiException = OblioApiException;
//# sourceMappingURL=api-exception.js.map