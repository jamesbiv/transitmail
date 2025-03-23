import {
  ISettings,
  ISettingsErrors,
  ISettingsSecondaryEmail,
  ISettingsValidationCondition
} from "interfaces";

/**
 * processValidationConditions
 * @param {ISettingsValidationCondition[]} validationConditions
 * @param {ISettings | ISettingsSecondaryEmail} settings
 * @returns ISettingsErrors
 */
export const processValidationConditions = (
  validationConditions: ISettingsValidationCondition[],
  settings: ISettings | ISettingsSecondaryEmail
): ISettingsErrors =>
  validationConditions.reduce(
    (validationResults: ISettingsErrors, { field, subField, constraint, message }) => {
      if (!subField) {
        const settingsValue = settings[field] as string;

        if (!constraint(settingsValue)) {
          validationResults[field] = message;
        }
      } else {
        const settingsValue = settings[field] as {
          [subField: string]: string;
        };

        if (!constraint(settingsValue[subField])) {
          validationResults[field] = {
            [field]: message,
            ...(validationResults[field] as object)
          };
        }
      }

      return validationResults;
    },
    {}
  );

/**
 * processValidationErrorMessages
 * @param {ISettingsErrors} validationErrors
 * @returns string
 */
export const processValidationErrorMessages = (validationErrors: ISettingsErrors): string => {
  return `<ul>${Object.keys(validationErrors).reduce(
    (errorResponse: string, valueKey: string): string => {
      if (typeof validationErrors[valueKey] === "string") {
        errorResponse += `<li>${validationErrors[valueKey]}</li>`;
      }

      if (typeof validationErrors[valueKey] === "object") {
        const objectValidationErrors = validationErrors[valueKey] as {
          [key: string]: string;
        };

        errorResponse += Object.keys(objectValidationErrors).reduce(
          (errorObjectResponse: string, objectKey: string): string => {
            errorObjectResponse += `<li>${objectValidationErrors[objectKey]}</li>`;

            return errorObjectResponse;
          },
          ""
        );
      }

      return errorResponse;
    },
    ""
  )}</ul>`;
};

/**
 * @constant {RegExp} emailRegex
 */
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @constant {ISettingsValidationCondition[]} settingsValidationConditions
 */
export const settingsValidationConditions: ISettingsValidationCondition[] = [
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
    constraint: (value: unknown) => !(value as string)?.length || (value as string)?.length <= 1000,
    message: "Signature must have a maximum of 1000 characters"
  },
  {
    field: "imapHost",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an Incoming mail host"
  },
  {
    field: "imapPort",
    constraint: (value: unknown) => !isNaN(value as number),
    message: "Please specify an Incoming mail port"
  },
  {
    field: "imapUsername",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an Incoming mail username"
  },
  {
    field: "imapPassword",
    constraint: (value: unknown) => !!(value as string)?.length,
    message: "Please specify an Incoming mail password"
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

/**
 * @constant {ISettingsValidationCondition[]} secondaryEmailValidationConditions
 */
export const secondaryEmailValidationConditions: ISettingsValidationCondition[] = [
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
    constraint: (value: unknown) => !(value as string)?.length || (value as string)?.length <= 1000,
    message: "Signature must have a maximum of 1000 characters"
  }
];
