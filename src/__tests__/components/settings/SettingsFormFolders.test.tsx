import React from "react";

import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { SettingsFormFolders } from "components/settings";
import { ISettingsFolders } from "interfaces";

describe("SettingsFormFolders Component", () => {
  describe("Test setDisplayFormFolders() function", () => {
    it("toggle accordion", () => {
      const folderSettings: ISettingsFolders = {
        archiveFolder: "Archives",
        draftsFolder: "Drafts",
        sentItemsFolder: "Sent Items",
        spamFolder: "Spam",
        trashFolder: "Recycle Bin"
      };

      const { getByText, container } = render(
        <SettingsFormFolders folderSettings={folderSettings} />
      );

      fireEvent.click(getByText(/Folder Settings/i));

      const accordionToggled: boolean = Boolean(container.querySelector('[data-icon="minus"]'));

      expect(accordionToggled).toBeTruthy();
    });
  });

  describe("Test setFolderSetting() function", () => {
    it("with validation errors", () => {
      const folderSettings: ISettingsFolders = {
        archiveFolder: "Archives",
        draftsFolder: "Drafts",
        sentItemsFolder: "Sent Items",
        spamFolder: "Spam",
        trashFolder: "Recycle Bin"
      };

      const { container } = render(<SettingsFormFolders folderSettings={folderSettings} />);

      const formFolderArchive = container.querySelector("#formFolderArchive")!;
      fireEvent.change(formFolderArchive, { target: { value: "" } });

      const formFolderTrash = container.querySelector("#formFolderTrash")!;
      fireEvent.change(formFolderTrash, { target: { value: "" } });

      const formFolderDrafts = container.querySelector("#formFolderDrafts")!;
      fireEvent.change(formFolderDrafts, { target: { value: "" } });

      const formFolderSentItems = container.querySelector("#formFolderSentItems")!;
      fireEvent.change(formFolderSentItems, { target: { value: "" } });

      const formFolderSpam = container.querySelector("#formFolderSpam")!;
      fireEvent.change(formFolderSpam, { target: { value: "" } });

      const feedbackResponseSequence: RegExp[] = [
        /Please specify an archive folder name/i,
        /Please specify an trash folder name/i,
        /Please specify an drafts folder name/i,
        /Please specify an sent items folder name/i,
        /Please specify an spam folder name/i
      ];

      const formFolderFeedback: NodeListOf<Element> = container.querySelectorAll(
        '[class="invalid-feedback"]'
      );

      formFolderFeedback.forEach((formFolderFeedbackElement, feedbackElementIndex) => {
        expect(formFolderFeedbackElement).toHaveTextContent(
          feedbackResponseSequence[feedbackElementIndex]
        );
      });
    });
  });
});
