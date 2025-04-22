import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EFolderEntryActionType, FoldersEntryOptions } from "components/folders";

describe("FoldersEntryOptions Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("", () => {
    it("a successful response", async () => {
      const folderId: string = "1";
      const toggleActionModal = (actionType: EFolderEntryActionType, actionFolderId?: string) =>
        undefined;

      render(<FoldersEntryOptions folderId={folderId} toggleActionModal={toggleActionModal} />);
    });
  });
});
