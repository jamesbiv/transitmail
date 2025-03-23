import { processValidationConditions, processValidationErrorMessages } from "components/settings";
import { ISettings, ISettingsErrors, ISettingsValidationCondition } from "interfaces";

describe("SettingsValidationConditions", () => {
  it("test processValidationConditions", () => {
    const settings: ISettings = {
      name: "",
      signature: "test@emailAddress.com",
      folderSettings: {
        archiveFolder: "",
        draftsFolder: "Drafts"
      }
    } as ISettings;

    const testValidationConditions: ISettingsValidationCondition[] = [
      {
        field: "name",
        constraint: (value: unknown) => !!(value as string)?.length,
        message: "Please specify a valid display name"
      },
      {
        field: "signature",
        constraint: (value: unknown) =>
          !(value as string)?.length || (value as string)?.length <= 1000,
        message: "Signature must have a maximum of 1000 characters"
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
      }
    ];

    const processValidationConditionsResponse: ISettingsErrors = processValidationConditions(
      testValidationConditions,
      settings
    );

    expect(processValidationConditionsResponse).toEqual({
      name: "Please specify a valid display name",
      folderSettings: {
        folderSettings: "Please specify an archive folder name"
      }
    });
  });

  it("test processValidationErrorMessages", () => {
    const testValidationErrors: ISettingsErrors = {
      name: "Please specify a valid display name",
      folderSettings: {
        folderSettings: "Please specify an archive folder name"
      }
    };

    const processValidationErrorMessagesResponse: string =
      processValidationErrorMessages(testValidationErrors);

    expect(processValidationErrorMessagesResponse).toEqual(
      "<ul>" +
        "<li>Please specify a valid display name</li>" +
        "<li>Please specify an archive folder name</li>" +
        "</ul>"
    );
  });
});
