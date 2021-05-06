export interface ISettings {
  name: string;
  email: string;
  signature: string;
  autoLogin: boolean;
  imapHost: string;
  imapPort: number;
  imapUsername: string;
  imapPassword: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  secondaryEmails: ISettingsSecondaryEmail[];
  advancedSettings: ISettingsAdvanced;
}

export interface ISettingsSecondaryEmail {
  name: string;
  email: string;
  signature: string;
}

export interface ISettingsAdvanced {
  trashFolder: string;
  spamFolder: string;
}
