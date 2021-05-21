export interface ISettingsErrors {
  [key: string]: string | ISettingsFoldersErrors | undefined;

  name?: string;
  email?: string;
  signature?: string;
  autoLogin?: string;
  imapHost?: string;
  imapPort?: string;
  imapUsername?: string;
  imapPassword?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUsername?: string;
  smtpPassword?: string;
  folderSettings?: ISettingsFoldersErrors;
}

export interface ISettingsFoldersErrors {
  [key: string]: string | undefined;

  archiveFolder?: string;
  draftsFolder?: string;
  sentItemsFolder?: string;
  spamFolder?: string;
  trashFolder?: string;
}
