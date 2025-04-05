import { SecureStorage } from "classes";
import { IImapSettings, ISettings, ISmtpSettings } from "interfaces";

jest.mock("contexts/DependenciesContext");

describe("Testing the SecureStorage class", () => {
  describe("test setData() and getData() methods", () => {
    it("successful getting and setting", () => {
      const secureStorage = new SecureStorage();

      secureStorage.setData("activeUid", "testActiveUid");

      const getDataResponse: string = secureStorage.getData("activeUid");

      expect(getDataResponse).toEqual("testActiveUid");
    });
  });

  describe("test setSetting() and getSetting() methods", () => {
    it("successful getting and setting", () => {
      const secureStorage = new SecureStorage();

      secureStorage.setSetting("name", "Test Display Name");

      const getSettingResponse: string = secureStorage.getSetting("name");

      expect(getSettingResponse).toEqual("Test Display Name");
    });
  });

  describe("test getImapSettings() for getSmtpSettings() methods", () => {
    it("successful response getImapSettings()", () => {
      const imapSettings: Partial<ISettings> = {
        imapHost: "mail.testIncomingHost.com",
        imapPort: 1234,
        imapUsername: "testUsername",
        imapPassword: "testPassword"
      };

      const secureStorage = new SecureStorage();

      secureStorage.setSettings(imapSettings as Required<ISettings>);
      const getImapSettingsResponse: IImapSettings = secureStorage.getImapSettings();

      expect(getImapSettingsResponse).toEqual({
        host: "mail.testIncomingHost.com",
        password: "testPassword",
        port: 1234,
        username: "testUsername"
      });
    });

    it("successful response getSmtpSettings()", () => {
      const smtpSettings: Partial<ISettings> = {
        smtpHost: "mail.testOutgoingHost.com",
        smtpPort: 1234,
        smtpUsername: "testUsername",
        smtpPassword: "testPassword"
      };

      const secureStorage = new SecureStorage();

      secureStorage.setSettings(smtpSettings as Required<ISettings>);

      const getSmtpSettingsResponse: ISmtpSettings = secureStorage.getSmtpSettings();

      expect(getSmtpSettingsResponse).toEqual({
        host: "mail.testOutgoingHost.com",
        password: "testPassword",
        port: 1234,
        username: "testUsername"
      });
    });
  });

  describe("test getSettings methods and setSettings() methods", () => {
    it("successful getting and setting", () => {
      const secureStorage = new SecureStorage();

      const settings: ISettings = {
        name: "Test Display Name",
        email: "test@emailAddress.com",
        signature: "Test Signature",
        autoLogin: undefined,
        imapHost: "mail.testIncomingHost.com",
        imapPort: 1234,
        imapUsername: "testUsername",
        imapPassword: "testPassword",
        smtpHost: "mail.testOutgoingHost.com",
        smtpPort: 1234,
        smtpUsername: "testUsername",
        smtpPassword: "testPassword",
        secondaryEmails: [],
        folderSettings: {
          archiveFolder: "Archives",
          draftsFolder: "Drafts",
          sentItemsFolder: "Sent Items",
          spamFolder: "Spam",
          trashFolder: "Recycle Bin"
        }
      };

      secureStorage.setSettings(settings as Required<ISettings>);

      const getSettingsResponse = secureStorage.getSettings();

      expect(getSettingsResponse).toEqual(settings);
    });
  });
});
