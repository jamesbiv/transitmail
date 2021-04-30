import CryptoES from "crypto-es";

type TDataKeys = "activeUid" | "folderId" | "composeMode";

interface IData {
  [key: string]: any;
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
  | "smtpPassword";

interface ISettings {
  [key: string]: any;
}

export class LocalStorage {
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
    this.data = this.getLocalStorage("data");

    this.settings = this.getLocalStorage("settings");
  }

  /**
   * @name setData
   * @param {TDataKeys} name
   * @param {T} value
   * @returns void
   */
  public setData<T>(name: TDataKeys, value: T): void {
    this.data[name] = value;

    this.setLocalStorage("data", this.data);
  }

  /**
   * @name getData
   * @param {TDataKeys} name
   * @returns T
   */
  public getData<T>(name: TDataKeys): T {
    return this.data[name];
  }

  /**
   * @name setSetting
   * @param {TDataKeys} name
   * @returns void
   */
  public setSetting<T>(name: TSettingsKeys, value: T): void {
    this.settings[name] = value;

    this.setLocalStorage("settings", this.settings);
  }

  /**
   * @name getSetting
   * @param {TDataKeys} name
   * @returns T
   */
  public getSetting<T>(name: TSettingsKeys): T {
    return this.settings[name];
  }

  /**
   * @name setSettings
   * @param {Pick<ISettings, TSettingsKeys>} name
   * @returns void
   */
  public setSettings(settings: Pick<ISettings, TSettingsKeys>): void {
    this.settings = settings;

    this.setLocalStorage("settings", this.settings);
  }

  /**
   * @name getSettings
   * @returns Pick<ISettings, TSettingsKeys>
   */
  public getSettings(): Pick<ISettings, TSettingsKeys> {
    return this.settings;
  }

  /**
   * @name setLocalStorage
   * @param {string} name
   * @param {T} data
   * @returns Promise<void>
   */
   private async setLocalStorage<T>(name: string, data: T): Promise<void> {
    const encryptedData: string = CryptoES.AES.encrypt(
      JSON.stringify(data),
      this.passPhrase
    ).toString();

    localStorage.setItem(name, encryptedData);
  }

  /**
   * @name getLocalStorage
   * @param {string} name
   * @returns T
   */
  private getLocalStorage<T>(name: string): T {
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
