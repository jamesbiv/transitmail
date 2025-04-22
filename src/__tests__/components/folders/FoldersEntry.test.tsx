import React from "react";

import { render } from "@testing-library/react";
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
        folders: [],
        name: "Folder",
        ref: "Folder"
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
});
