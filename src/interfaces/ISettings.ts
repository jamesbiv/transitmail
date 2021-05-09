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
  folderSettings: ISettingsFolders;
}

export interface ISettingsSecondaryEmail {
  name: string;
  email: string;
  signature: string;
}

export interface ISettingsFolders {
  [key: string]: string;
  
  archiveFolder: string;
  draftsFolder: string;
  sentItemsFolder: string;
  spamFolder: string;
  trashFolder: string;
}
