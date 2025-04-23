import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EFolderEntryActionType, FoldersEntry } from "components/folders";
import { IFoldersEntry } from "interfaces";

describe("FoldersEntry Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("", () => {
    it("a successful response", async () => {
      const activeFolderId: string = "1";
      const folderEntry: IFoldersEntry = {
        id: 1,
        name: "Test Folder",
        ref: "Test Folder",
        folders: []
      };

      const toggleActionModal = (actionType: EFolderEntryActionType, actionFolderId?: string) =>
        undefined;
      const updateActiveKeyFolderId = (activeKey: string, folderId: string) => undefined;

      render(
        <FoldersEntry
          activeFolderId={activeFolderId}
          folderEntry={folderEntry}
          toggleActionModal={toggleActionModal}
          updateActiveKeyFolderId={updateActiveKeyFolderId}
        />
      );
    });
  });

  describe("", () => {
    it("a successful response", async () => {
      const activeFolderId: string = "1";
      const folderEntry: IFoldersEntry = {
        id: 1,
        name: "Test Folder",
        ref: "Test Folder",
        folders: []
      };

      const toggleActionModal = (actionType: EFolderEntryActionType, actionFolderId?: string) =>
        undefined;

      const updateActiveKeyFolderId = jest
        .fn()
        .mockImplementation((activeKey: string, folderId: string) => undefined);

      const { getByText, getAllByText } = render(
        <FoldersEntry
          activeFolderId={activeFolderId}
          folderEntry={folderEntry}
          toggleActionModal={toggleActionModal}
          updateActiveKeyFolderId={updateActiveKeyFolderId}
        />
      );

      await waitFor(() => expect(getByText(/Test Folder/i)).toBeInTheDocument());

      const openClickables = getAllByText(/Open/i);
      openClickables.forEach((openClickable) => fireEvent.click(openClickable));

      expect(updateActiveKeyFolderId).toHaveBeenCalledWith("folder", "Test Folder");
    });
  });
});
