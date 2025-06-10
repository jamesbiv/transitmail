import CryptoES from "crypto-es";
import { IImapSettings, ISmtpSettings } from "interfaces";

/**
 * @type TDataKeys
 */
type TDataKeys = "activeUid" | "folderId" | "composeMode";

/**
 * @interface IData
 */
interface IData {
  [key: string]: unknown;
}

/**
 * @type TSettingsKeys
 */
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

/**
 * @interface ISettings
 */
interface ISettings {
  [key: string]: unknown;
}

/**
 * @class SecureStorage
 */
export class SecureStorage {
  /**
   * @protected {Pick<ISettings, TSettingsKeys>} settings
   */
  protected settings: Pick<ISettings, TSettingsKeys>;

  /**
   * @protected {Pick<IData, TDataKeys>} data
   */
  protected data: Pick<IData, TDataKeys>;

  /**
   * @protected {string} passPhrase
   */
  protected passPhrase: string = "transit-mail";

  /**
   * @constructor
   */
  constructor() {
    this.data = this.getSecureStorage("data") ?? ({} as Pick<IData, TDataKeys>);

    this.settings = this.getSecureStorage("settings") ?? ({} as Pick<ISettings, TSettingsKeys>);
  }

  /**
   * setData
   * @method
   * @param {TDataKeys} name
   * @param {T} value
   * @returns {void}
   */
  public setData<T>(name: TDataKeys, value: T): void {
    this.data[name] = value;

    this.setSecureStorage("data", this.data);
  }

  /**
   * getData
   * @method
   * @param {TDataKeys} name
   * @returns {T}
   */
  public getData<T>(name: TDataKeys): T {
    return this.data[name] as T;
  }

  /**
   * setSetting
   * @method
   * @param {TDataKeys} name
   * @returns {void}
   */
  public setSetting<T>(name: TSettingsKeys, value: T): void {
    this.settings[name] = value;

    this.setSecureStorage("settings", this.settings);
  }

  /**
   * getSetting
   * @method
   * @param {TDataKeys} name
   * @returns {T}
   */
  public getSetting<T>(name: TSettingsKeys): T {
    return this.settings[name] as T;
  }

  /**
   * setSettings
   * @method
   * @param {Pick<ISettings, TSettingsKeys>} name
   * @returns {void}
   */
  public setSettings(settings: Pick<ISettings, TSettingsKeys>): void {
    this.settings = settings;

    this.setSecureStorage("settings", this.settings);
  }

  /**
   * getSettings
   * @method
   * @returns Pick<ISettings, TSettingsKeys>
   */
  public getSettings(): Pick<ISettings, TSettingsKeys> {
    return this.settings;
  }

  /**
   * getImapSettings
   * @method
   * @returns {IImapSettings}
   */
  public getImapSettings(): IImapSettings {
    return {
      host: this.settings.imapHost,
      port: this.settings.imapPort,
      username: this.settings.imapUsername,
      password: this.settings.imapPassword
    } as IImapSettings;
  }

  /**
   * getSmtpSettings
   * @method
   * @returns {ISmtpSettings}
   */
  public getSmtpSettings(): ISmtpSettings {
    return {
      host: this.settings.smtpHost,
      port: this.settings.smtpPort,
      username: this.settings.smtpUsername,
      password: this.settings.smtpPassword
    } as ISmtpSettings;
  }

  /**
   * setSecureStorage
   * @method
   * @param {string} name
   * @param {T} data
   * @returns {void}
   */
  private setSecureStorage<T>(name: string, data: T): void {
    const encryptedData: string = CryptoES.AES.encrypt(
      JSON.stringify(data),
      this.passPhrase
    ).toString();

    localStorage.setItem(name, encryptedData);
  }

  /**
   * getSecureStorage
   * @method
   * @param {string} name
   * @returns {T | undefined}
   */
  private getSecureStorage<T>(name: string): T | undefined {
    const data: string | undefined = localStorage.getItem(name) ?? undefined;

    if (!data) {
      return;
    }

    const decryptedData: string = CryptoES.AES.decrypt(data, this.passPhrase).toString(
      CryptoES.enc.Utf8
    );

    let parsedDecryptedData: { json?: T; error?: Error };

    try {
      parsedDecryptedData = { json: JSON.parse(decryptedData) };
    } catch (error: unknown) {
      parsedDecryptedData = { json: undefined, error: error as Error };
    }

    return parsedDecryptedData.json;
  }
}
