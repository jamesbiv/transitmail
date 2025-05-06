import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EFolderEntryActionType, FoldersEntryOptions } from "components/folders";

describe("FoldersEntryOptions Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("testing toggleActionModal", () => {
    it.each([
      [EFolderEntryActionType.COPY, "copy"],
      [EFolderEntryActionType.MOVE, "suitcase"],
      [EFolderEntryActionType.RENAME, "pen-to-square"],
      [EFolderEntryActionType.DELETE, "trash"]
    ])("a successful response for %s", async (action, icon) => {
      const folderId: string = "1";
      const toggleActionModal = jest
        .fn()
        .mockImplementationOnce(
          (actionType: EFolderEntryActionType, actionFolderId?: string) => undefined
        );

      const { container } = render(
        <FoldersEntryOptions folderId={folderId} toggleActionModal={toggleActionModal} />
      );

      const slidersIcon = container.querySelector(`[data-icon="sliders"]`)!;
      fireEvent.click(slidersIcon);

      const copyIcon = container.querySelector(`[data-icon="${icon}"]`)!;
      fireEvent.click(copyIcon);

      expect(toggleActionModal).toHaveBeenCalledWith(action, "1");
    });
  });
});
