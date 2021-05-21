export interface ISettings {
  [key: string]:
    | string
    | number
    | boolean
    | ISettingsFolders
    | ISettingsSecondaryEmail[]
    | undefined;

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
  folderSettings: ISettingsFolders;
  secondaryEmails?: ISettingsSecondaryEmail[];
}

export interface ISettingsFolders {
  [key: string]: string;

  archiveFolder: string;
  draftsFolder: string;
  sentItemsFolder: string;
  spamFolder: string;
  trashFolder: string;
}

export interface ISettingsSecondaryEmail {
  name: string;
  email: string;
  signature: string;
}
