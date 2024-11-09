import { AccessToken } from "./access-token";
import { AccessTokenHandlerInMemory } from "./access-token-handler-in-memory";

describe("AccessTokenHandlerInMemory", () => {
  let tokenHandler: AccessTokenHandlerInMemory;

  beforeEach(() => {
    tokenHandler = new AccessTokenHandlerInMemory();
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
      const mockToken = new AccessToken({
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
      const mockToken = new AccessToken({
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
      const firstToken = new AccessToken({
        access_token: "first-token",
        token_type: "Bearer",
        expires_in: 3600,
        request_time: Date.now() * 1000,
      });

      const secondToken = new AccessToken({
        access_token: "second-token",
        token_type: "Bearer",
        expires_in: 3600,
        request_time: Date.now() * 1000,
      });

      tokenHandler.set(firstToken);
      tokenHandler.set(secondToken);
      const storedToken = tokenHandler.get();

      expect(storedToken).toEqual(secondToken);
      expect(storedToken?.access_token).toBe("second-token");
    });

    it("should handle null token", () => {
      tokenHandler.set(null);
      const storedToken = tokenHandler.get();

      expect(storedToken).toBeNull();
    });
  });

  describe("multiple instances", () => {
    it("should maintain separate token storage for different instances", () => {
      const handler1 = new AccessTokenHandlerInMemory();
      const handler2 = new AccessTokenHandlerInMemory();

      const token1 = new AccessToken({
        access_token: "token-1",
        token_type: "Bearer",
        expires_in: 3600,
        request_time: Date.now() * 1000,
      });

      const token2 = new AccessToken({
        access_token: "token-2",
        token_type: "Bearer",
        expires_in: 3600,
        request_time: Date.now() * 1000,
      });

      handler1.set(token1);
      handler2.set(token2);

      expect(handler1.get()?.access_token).toBe("token-1");
      expect(handler2.get()?.access_token).toBe("token-2");
    });
  });

  describe("edge cases", () => {
    it("should handle undefined token properties", () => {
      const invalidToken = new AccessToken({
        access_token: undefined as unknown as string,
        token_type: undefined as unknown as string,
        expires_in: undefined as unknown as number,
        request_time: undefined as unknown as number,
      });

      expect(() => tokenHandler.set(invalidToken)).not.toThrow();
    });

    it("should handle malformed token object", () => {
      const malformedToken = {} as AccessToken;

      expect(() => tokenHandler.set(malformedToken)).not.toThrow();
      expect(tokenHandler.get()).toBeNull();
    });
  });
});
