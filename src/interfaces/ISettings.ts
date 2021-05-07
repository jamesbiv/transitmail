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
  folderSettings: ISettingsFolder;
}

export interface ISettingsSecondaryEmail {
  name: string;
  email: string;
  signature: string;
}

export interface ISettingsFolder {
  archiveFolder: string;
  draftFolder: string;
  sentItemsFolder: string;
  spamFolder: string;
  trashFolder: string;
}
