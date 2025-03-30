import { SecureStorage } from "classes";
import { ISettings } from "interfaces";

jest.mock("contexts/DependenciesContext");

const secureStorage = new SecureStorage();

describe("Testing the SecureStorage class", () => {
  describe("Test setData and getData", () => {
    it("Test a successful set and get senario", () => {
      secureStorage.setData("activeUid", "mockVariableContent");

      const getDataResponse: string = secureStorage.getData("activeUid");
      expect(getDataResponse).toEqual("mockVariableContent");
    });
  });

  describe("Test setSetting and getSetting", () => {
    it("Test a successful set and get senario", () => {
      secureStorage.setSetting("name", "mockVariableContent");

      const getDataResponse: string = secureStorage.getSetting("name");
      expect(getDataResponse).toEqual("mockVariableContent");
    });
  });

  describe("Test setSettings and getSettings", () => {
    it("Test a successful set and get senario", () => {
      const settingsMock: ISettings = {
        name: "mockName",
        email: "mockEmail",
        signature: "mockSignature",
        autoLogin: undefined,
        imapHost: "mockImapHost",
        imapPort: 1234,
        imapUsername: "mockImapUsername",
        imapPassword: "mockImapPassword",
        smtpHost: "mockSmtpHost",
        smtpPort: 1234,
        smtpUsername: "mockSmtpUsername",
        smtpPassword: "mockSmtpPassword",
        secondaryEmails: [],
        folderSettings: {
          archiveFolder: "Archives",
          draftsFolder: "Drafts",
          sentItemsFolder: "Sent Items",
          spamFolder: "Spam",
          trashFolder: "Recycle Bin"
        }
      };

      secureStorage.setSettings(settingsMock as Required<ISettings>);

      const getDataResponse = secureStorage.getSettings() as Partial<ISettings>;
      expect(getDataResponse).toEqual(settingsMock);
    });
  });
});
