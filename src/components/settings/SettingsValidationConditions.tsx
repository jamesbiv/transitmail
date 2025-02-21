import { ISettingsValidationCondition } from "interfaces";

const emailRegex: RegExp =
  /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validationConditions: ISettingsValidationCondition[] = [
  {
    field: "name",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify a valid display name"
  },
  {
    field: "email",
    constraint: (value: unknown) =>
      !!(value as string)?.length &&
      ((value as string).toLocaleLowerCase().includes("localhost") ||
        emailRegex.test(value as string)),
    message: "Please specify a valid email address"
  },
  {
    field: "signature",
    constraint: (value: unknown) =>
      (value as string)?.length <= 1000 || (value as string)?.length < 1,
    message: "Signature must have a maximum of 1000 characters"
  },
  {
    field: "imapHost",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an incomming mail host"
  },
  {
    field: "imapPort",
    constraint: (value: unknown) => !isNaN(value as number),
    message: "Please specify an incomming mail port"
  },
  {
    field: "imapUsername",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an incomming mail username"
  },
  {
    field: "imapPassword",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an incomming mail password"
  },
  {
    field: "smtpHost",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an outgoing mail host"
  },
  {
    field: "smtpPort",
    constraint: (value: unknown) => !isNaN(value as number),
    message: "Please specify an outgoing mail port"
  },
  {
    field: "smtpUsername",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an outgoing mail username"
  },
  {
    field: "smtpPassword",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an outgoing mail password"
  },
  {
    field: "smtpPassword",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an outgoing mail password"
  },
  {
    field: "folderSettings",
    subField: "archiveFolder",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an archive folder name"
  },
  {
    field: "folderSettings",
    subField: "draftsFolder",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an drafts folder name"
  },
  {
    field: "folderSettings",
    subField: "sentItemsFolder",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an sent items folder name"
  },
  {
    field: "folderSettings",
    subField: "spamFolder",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an spam folder name"
  },
  {
    field: "folderSettings",
    subField: "trashFolder",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an trash folder name"
  }
];
