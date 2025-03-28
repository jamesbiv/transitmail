import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { SettingsForm } from "components/settings";
import { ISettings, ISettingsValidationCondition } from "interfaces";

describe("SettingsForm Component", () => {
  describe("Test setSettingValue() function", () => {
    it("with a validation error", () => {
      const settingsValidationConditions: ISettingsValidationCondition[] = [
        {
          field: "name",
          constraint: (value: unknown) => !!(value as string)?.length,
          message: "Please specify a valid display name"
        }
      ];

      const settings: ISettings = {
        name: "Test Display Name",
        email: "test@emailAddress.com",
        signature: "Test Signature",
        imapHost: "mail.testIncomingHost.com",
        imapPort: 1234,
        imapUsername: "testUsername",
        imapPassword: "testPassword",
        smtpHost: "mail.testOutgoingHost.com",
        smtpPort: 1234,
        smtpUsername: "testUsername",
        smtpPassword: "testPassword",
        folderSettings: {
          archiveFolder: "Archives",
          draftsFolder: "Drafts",
          sentItemsFolder: "Sent Items",
          spamFolder: "Spam",
          trashFolder: "Recycle Bin"
        }
      };

      const setSettings = () => {};

      const { container, getByText } = render(
        <SettingsForm
          settingsValidationConditions={settingsValidationConditions}
          settings={settings}
          setSettings={setSettings}
        />
      );

      const formDisplayName = container.querySelector("#formDisplayName")!;
      fireEvent.change(formDisplayName, { target: { value: "" } });

      expect(getByText(/Please specify a valid display name/i)).toBeTruthy();
    });

    it("with validationConditions empty", () => {
      const settingsValidationConditions: ISettingsValidationCondition[] = [];

      const settings: ISettings = {
        name: "Test Display Name",
        email: "test@emailAddress.com",
        signature: "Test Signature",
        imapHost: "mail.testIncomingHost.com",
        imapPort: 1234,
        imapUsername: "testUsername",
        imapPassword: "testPassword",
        smtpHost: "mail.testOutgoingHost.com",
        smtpPort: 1234,
        smtpUsername: "testUsername",
        smtpPassword: "testPassword",
        folderSettings: {
          archiveFolder: "Archives",
          draftsFolder: "Drafts",
          sentItemsFolder: "Sent Items",
          spamFolder: "Spam",
          trashFolder: "Recycle Bin"
        }
      };

      const setSettings = () => {};

      const { container } = render(
        <SettingsForm
          settingsValidationConditions={settingsValidationConditions}
          settings={settings}
          setSettings={setSettings}
        />
      );

      const formDisplayName = container.querySelector("#formDisplayName")!;
      fireEvent.change(formDisplayName, { target: { value: "" } });

      expect(formDisplayName).toHaveAttribute("value", "Test Display Name");
    });

    it("with successful validation", () => {
      const settingsValidationConditions: ISettingsValidationCondition[] = [
        {
          field: "name",
          constraint: (value: unknown) => !!(value as string)?.length,
          message: "Please specify a valid display name"
        }
      ];

      const settings: ISettings = {
        name: "Test Display Name",
        email: "test@emailAddress.com",
        signature: "Test Signature",
        imapHost: "mail.testIncomingHost.com",
        imapPort: 1234,
        imapUsername: "testUsername",
        imapPassword: "testPassword",
        smtpHost: "mail.testOutgoingHost.com",
        smtpPort: 1234,
        smtpUsername: "testUsername",
        smtpPassword: "testPassword",
        folderSettings: {
          archiveFolder: "Archives",
          draftsFolder: "Drafts",
          sentItemsFolder: "Sent Items",
          spamFolder: "Spam",
          trashFolder: "Recycle Bin"
        }
      };

      let lastSetSettingsState: ISettings = {} as ISettings;

      const setSettings = (settings: ISettings) => {
        lastSetSettingsState = settings;
      };

      const { container } = render(
        <SettingsForm
          settingsValidationConditions={settingsValidationConditions}
          settings={settings}
          setSettings={setSettings}
        />
      );

      const formDisplayName = container.querySelector("#formDisplayName")!;
      fireEvent.change(formDisplayName, { target: { value: "Test Display Name Changed" } });

      expect(lastSetSettingsState.name).toEqual("Test Display Name Changed");
    });
  });

  describe("Test updateSecondaryEmails() function", () => {
    it("with successful update", () => {
      const settingsValidationConditions: ISettingsValidationCondition[] = [];

      const settings: ISettings = {
        name: "Test Display Name",
        email: "test@emailAddress.com",
        signature: "Test Signature",
        imapHost: "mail.testIncomingHost.com",
        imapPort: 1234,
        imapUsername: "testUsername",
        imapPassword: "testPassword",
        smtpHost: "mail.testOutgoingHost.com",
        smtpPort: 1234,
        smtpUsername: "testUsername",
        smtpPassword: "testPassword",
        folderSettings: {
          archiveFolder: "Archives",
          draftsFolder: "Drafts",
          sentItemsFolder: "Sent Items",
          spamFolder: "Spam",
          trashFolder: "Recycle Bin"
        },
        secondaryEmails: [
          {
            key: "15605ee6-d6e4-4a5c-8718-6b0c92e94e9b",
            name: "Test Display Name",
            email: "test@emailAddress.com",
            signature: "Test Email Signature"
          }
        ]
      };

      const setSettings = () => {};

      const { container, getByPlaceholderText, getByText } = render(
        <SettingsForm
          settingsValidationConditions={settingsValidationConditions}
          settings={settings}
          setSettings={setSettings}
        />
      );

      const updateSecondaryEmailIcon = container.querySelector('[data-icon="pen-to-square"]')!;
      fireEvent.click(updateSecondaryEmailIcon);

      const formSecondaryDisplayName = getByPlaceholderText("Enter a secondary display name");
      fireEvent.change(formSecondaryDisplayName, {
        target: { value: "Test Display Name Updated" }
      });

      const formSecondaryEmailAddress = getByPlaceholderText("Enter a secondary email address");
      fireEvent.change(formSecondaryEmailAddress, {
        target: { value: "updated@emailAddress.com" }
      });

      const formSecondaryEmailSignature = getByPlaceholderText("Enter a secondary email signature");
      fireEvent.change(formSecondaryEmailSignature, {
        target: { value: "Test Email Signature Updated" }
      });

      fireEvent.click(getByText(/Ok/i));

      expect(settings.secondaryEmails).toEqual([
        {
          key: "15605ee6-d6e4-4a5c-8718-6b0c92e94e9b",
          name: "Test Display Name Updated",
          email: "updated@emailAddress.com",
          signature: "Test Email Signature Updated"
        }
      ]);
    });
  });
});
