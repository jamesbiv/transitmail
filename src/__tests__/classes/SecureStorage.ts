import { SecureStorage } from "classes";

jest.mock("contexts/DependenciesContext");

const secureStorage = new SecureStorage();

describe("Testing the SecureStorage class", () => {
  describe("Test setData and getData", () => {
    test("Test a successful set and get senario", () => {
      secureStorage.setData("activeUid", "mockVariableContent");

      const getDataResponse: any = secureStorage.getData("activeUid");
      expect(getDataResponse).toEqual("mockVariableContent");
    });
  });

  describe("Test setSetting and getSetting", () => {
    test("Test a successful set and get senario", () => {
      secureStorage.setSetting("name", "mockVariableContent");

      const getDataResponse: any = secureStorage.getSetting("name");
      expect(getDataResponse).toEqual("mockVariableContent");
    });
  });

  describe("Test setSettings and getSettings", () => {
    test("Test a successful set and get senario", () => {
      const settingsMock: any = {
        name: "mockName",
        email: "mockEmail",
        signature: "mockSignature",
        autoLogin: "mockAutoLogin",
        imapHost: "mockImapHost",
        imapPort: "mockImapPort",
        imapUsername: "mockImapUsername",
        imapPassword: "mockImapPassword",
        smtpHost: "mockSmtpHost",
        smtpPort: "mockSmtpPort",
        smtpUsername: "mockSmtpUsername",
        smtpPassword: "mockSmtpPassword",
        secondaryEmails: [],
        folderSettings: {}
      };

      secureStorage.setSettings(settingsMock);

      const getDataResponse: any = secureStorage.getSettings();
      expect(getDataResponse).toEqual(settingsMock);
    });
  });
});
