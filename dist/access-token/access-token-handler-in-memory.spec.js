"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const access_token_1 = require("./access-token");
const access_token_handler_in_memory_1 = require("./access-token-handler-in-memory");
describe('AccessTokenHandlerInMemory', () => {
    let tokenHandler;
    beforeEach(() => {
        tokenHandler = new access_token_handler_in_memory_1.AccessTokenHandlerInMemory();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('get', () => {
        it('should return null when no token is set', () => {
            const token = tokenHandler.get();
            expect(token).toBeNull();
        });
        it('should return the stored token', () => {
            const mockToken = new access_token_1.AccessToken({
                access_token: 'test-token',
                token_type: 'Bearer',
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            tokenHandler.set(mockToken);
            const retrievedToken = tokenHandler.get();
            expect(retrievedToken).toEqual(mockToken);
        });
    });
    describe('set', () => {
        it('should store the token', () => {
            const mockToken = new access_token_1.AccessToken({
                access_token: 'test-token',
                token_type: 'Bearer',
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            tokenHandler.set(mockToken);
            const storedToken = tokenHandler.get();
            expect(storedToken).toEqual(mockToken);
        });
        it('should override existing token', () => {
            const firstToken = new access_token_1.AccessToken({
                access_token: 'first-token',
                token_type: 'Bearer',
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            const secondToken = new access_token_1.AccessToken({
                access_token: 'second-token',
                token_type: 'Bearer',
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            tokenHandler.set(firstToken);
            tokenHandler.set(secondToken);
            const storedToken = tokenHandler.get();
            expect(storedToken).toEqual(secondToken);
            expect(storedToken === null || storedToken === void 0 ? void 0 : storedToken.access_token).toBe('second-token');
        });
        it('should handle null token', () => {
            tokenHandler.set(null);
            const storedToken = tokenHandler.get();
            expect(storedToken).toBeNull();
        });
    });
    describe('multiple instances', () => {
        it('should maintain separate token storage for different instances', () => {
            var _a, _b;
            const handler1 = new access_token_handler_in_memory_1.AccessTokenHandlerInMemory();
            const handler2 = new access_token_handler_in_memory_1.AccessTokenHandlerInMemory();
            const token1 = new access_token_1.AccessToken({
                access_token: 'token-1',
                token_type: 'Bearer',
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            const token2 = new access_token_1.AccessToken({
                access_token: 'token-2',
                token_type: 'Bearer',
                expires_in: 3600,
                request_time: Date.now() * 1000,
            });
            handler1.set(token1);
            handler2.set(token2);
            expect((_a = handler1.get()) === null || _a === void 0 ? void 0 : _a.access_token).toBe('token-1');
            expect((_b = handler2.get()) === null || _b === void 0 ? void 0 : _b.access_token).toBe('token-2');
        });
    });
    describe('edge cases', () => {
        it('should handle undefined token properties', () => {
            const invalidToken = new access_token_1.AccessToken({
                access_token: undefined,
                token_type: undefined,
                expires_in: undefined,
                request_time: undefined,
            });
            expect(() => tokenHandler.set(invalidToken)).not.toThrow();
        });
        it('should handle malformed token object', () => {
            const malformedToken = {};
            expect(() => tokenHandler.set(malformedToken)).not.toThrow();
            expect(tokenHandler.get()).toBeNull();
        });
    });
});
//# sourceMappingURL=access-token-handler-in-memory.spec.js.map