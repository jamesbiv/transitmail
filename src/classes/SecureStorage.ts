import CryptoES from "crypto-es";
import { IImapSettings, ISmtpSettings } from "interfaces";

type TDataKeys = "activeUid" | "folderId" | "composeMode";

interface IData {
  [key: string]: unknown;
}

type TSettingsKeys =
  | "name"
  | "email"
  | "signature"
  | "autoLogin"
  | "imapHost"
  | "imapPort"
  | "imapUsername"
  | "imapPassword"
  | "smtpHost"
  | "smtpPort"
  | "smtpUsername"
  | "smtpPassword"
  | "secondaryEmails"
  | "folderSettings";

interface ISettings {
  [key: string]: unknown;
}

export class SecureStorage {
  /**
   * @var {Pick<ISettings, TSettingsKeys>} settings
   */
  protected settings: Pick<ISettings, TSettingsKeys>;

  /**
   * @var {Pick<IData, TDataKeys>} data
   */
  protected data: Pick<IData, TDataKeys>;

  /**
   * @var {string} passPhrase
   */
  protected passPhrase: string = "transit-mail";

  /**
   * @constructor
   */
  constructor() {
    this.data = this.getSecureStorage("data");

    this.settings = this.getSecureStorage("settings");
  }

  /**
   * @name setData
   * @param {TDataKeys} name
   * @param {T} value
   * @returns void
   */
  public setData<T>(name: TDataKeys, value: T): void {
    this.data[name] = value;

    this.setSecureStorage("data", this.data);
  }

  /**
   * @name getData
   * @param {TDataKeys} name
   * @returns T
   */
  public getData<T>(name: TDataKeys): T {
    return this.data[name] as T;
  }

  /**
   * @name setSetting
   * @param {TDataKeys} name
   * @returns void
   */
  public setSetting<T>(name: TSettingsKeys, value: T): void {
    this.settings[name] = value;

    this.setSecureStorage("settings", this.settings);
  }

  /**
   * @name getSetting
   * @param {TDataKeys} name
   * @returns T
   */
  public getSetting<T>(name: TSettingsKeys): T {
    return this.settings[name] as T;
  }

  /**
   * @name setSettings
   * @param {Pick<ISettings, TSettingsKeys>} name
   * @returns void
   */
  public setSettings(settings: Pick<ISettings, TSettingsKeys>): void {
    this.settings = settings;

    this.setSecureStorage("settings", this.settings);
  }

  /**
   * @name getSettings
   * @returns Pick<ISettings, TSettingsKeys>
   */
  public getSettings(): Pick<ISettings, TSettingsKeys> {
    return this.settings;
  }

  /**
   * @name getImapSettings
   * @returns IImapSettings
   */
  public getImapSettings(): IImapSettings {
    return {
      host: this.settings.imapHost,
      port: this.settings.imapPort,
      username: this.settings.imapUsername,
      password: this.settings.imapPassword,
    } as IImapSettings;
  }

  /**
   * @name getSmtpSettings
   * @returns ISmtpSettings
   */
  public getSmtpSettings(): ISmtpSettings {
    return {
      host: this.settings.smtpHost,
      port: this.settings.smtpPort,
      username: this.settings.smtpUsername,
      password: this.settings.smtpPassword,
    } as ISmtpSettings;
  }

  /**
   * @name setSecureStorage
   * @param {string} name
   * @param {T} data
   * @returns void
   */
  private setSecureStorage<T>(name: string, data: T): void {
    const encryptedData: string = CryptoES.AES.encrypt(
      JSON.stringify(data),
      this.passPhrase
    ).toString();

    localStorage.setItem(name, encryptedData);
  }

  /**
   * @name getSecureStorage
   * @param {string} name
   * @returns T
   */
  private getSecureStorage<T>(name: string): T {
    const data: string = localStorage.getItem(name) ?? "";

    const decryptedData: string = CryptoES.AES.decrypt(
      data,
      this.passPhrase
    ).toString(CryptoES.enc.Utf8);

    try {
      return JSON.parse(decryptedData);
    } catch (error) {
      return {} as T;
    }
  }
}
