export interface ISettingsErrors {
  [key: string]: string | undefined;

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
}
