import { LocalStorage } from "classes";

const localStorage = new LocalStorage();

describe("Testing the LocalStorage class", () => {
  describe("Test setData and getData", () => {
    test("Test a successful set and get senario", () => {
      localStorage.setData("activeUid", "mockVariableContent");

      const getDataResponse: any = localStorage.getData("activeUid");
      expect(getDataResponse).toEqual("mockVariableContent");
    });
  });

  describe("Test setSetting and getSetting", () => {
    test("Test a successful set and get senario", () => {
      localStorage.setSetting("name", "mockVariableContent");

      const getDataResponse: any = localStorage.getSetting("name");
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
        folderSettings: {},
      };

      localStorage.setSettings(settingsMock);

      const getDataResponse: any = localStorage.getSettings();
      expect(getDataResponse).toEqual(settingsMock);
    });
  });
});
