import { AccessToken } from "./access-token";
import { AccessTokenHandlerFileStorage } from "./access-token-handler-file-storage";
import * as fs from "fs";

jest.mock("fs");

describe("AccessTokenHandlerFileStorage", () => {
  let accessTokenHandler;
  const mockAccessTokenFilePath = "mock/path/.access_token";

  beforeEach(() => {
    accessTokenHandler = new AccessTokenHandlerFileStorage(
      mockAccessTokenFilePath
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("get()", () => {
    it("should return access token if file exists and is not expired", () => {
      const mockAccessToken = {
        request_time: Date.now() * 1000,
        expires_in: 3600,
      }; // Valid token
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest
        .spyOn(fs, "readFileSync")
        .mockReturnValue(JSON.stringify(mockAccessToken));

      const accessToken = accessTokenHandler.get();

      expect(accessToken).toBeInstanceOf(AccessToken); // Ensure an instance of AccessToken is returned
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
      }; // Expired token
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest
        .spyOn(fs, "readFileSync")
        .mockReturnValue(JSON.stringify(mockAccessToken));

      const accessToken = accessTokenHandler.get();

      expect(accessToken).toBeNull();
    });
  });
});
