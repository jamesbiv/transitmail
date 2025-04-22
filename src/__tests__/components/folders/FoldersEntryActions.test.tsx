import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { IFoldersEntry } from "interfaces";
import { EFolderEntryActionType, FoldersEntryActions } from "components/folders";
import { ImapSocket } from "classes";

describe("FoldersEntryActions Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("", () => {
    it("a successful response", async () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.MOVE;
      const showActionModal: boolean = false;
      const imapSocket = new ImapSocket();
      const getFolders = async () => undefined;
      const hideActionModal = () => undefined;

      render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );
    });
  });
});
