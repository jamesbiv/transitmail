import { ISettingsValidationCondition } from "interfaces";

const emailRegex: RegExp = /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validationConditions: ISettingsValidationCondition[] = [
  {
    field: "name",
    constraint: (value: string) => !!value?.length,
    message: "Please specify a valid display name",
  },
  {
    field: "email",
    constraint: (value: string) => !!value?.length && emailRegex.test(value),
    message: "Please specify a valid email address",
  },
  {
    field: "signature",
    constraint: (value: string) => value?.length <= 1000,
    message: "Signature must have a maximum of 1000 characters",
  },
  {
    field: "imapHost",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an incomming mail host",
  },
  {
    field: "imapPort",
    constraint: (value: number) => !isNaN(value),
    message: "Please specify an incomming mail port",
  },
  {
    field: "imapUsername",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an incomming mail username",
  },
  {
    field: "imapPassword",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an incomming mail password",
  },
  {
    field: "smtpHost",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an outgoing mail host",
  },
  {
    field: "smtpPort",
    constraint: (value: number) => !isNaN(value),
    message: "Please specify an outgoing mail port",
  },
  {
    field: "smtpUsername",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an outgoing mail username",
  },
  {
    field: "smtpPassword",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an outgoing mail password",
  },
  {
    field: "smtpPassword",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an outgoing mail password",
  },
  {
    field: "folderSettings",
    subField: "archiveFolder",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an archive folder name",
  },
  {
    field: "folderSettings",
    subField: "draftsFolder",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an drafts folder name",
  },
  {
    field: "folderSettings",
    subField: "sentItemsFolder",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an sent items folder name",
  },
  {
    field: "folderSettings",
    subField: "spamFolder",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an spam folder name",
  },
  {
    field: "folderSettings",
    subField: "trashFolder",
    constraint: (value: string) => !!value?.length,
    message: "Please specify an trash folder name",
  },
];
