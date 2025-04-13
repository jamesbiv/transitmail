import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EFolderEmailActionType, FolderTableOptions } from "components/folder";

describe("FolderTableOptions Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("testing toggleActionModal() function", () => {
    it.each([
      ["copy", EFolderEmailActionType.COPY],
      ["suitcase", EFolderEmailActionType.MOVE],
      ["flag", EFolderEmailActionType.FLAG],
      ["trash", EFolderEmailActionType.DELETE]
    ])("with a successful response", (icon, folderEmailActionType) => {
      const displayTableOptions: boolean = true;

      const toggleSelection = (uid: number, forceToogle?: boolean) => undefined;
      const toggleActionModal = jest.fn();

      const { container } = render(
        <FolderTableOptions
          displayTableOptions={displayTableOptions}
          toggleSelection={toggleSelection}
          toggleActionModal={toggleActionModal}
        />
      );

      const selectedIcon = container.querySelector(`[data-icon="${icon}"]`)!;
      fireEvent.click(selectedIcon);

      expect(toggleActionModal).toHaveBeenCalledWith(folderEmailActionType);
    });
  });

  describe("testing toggleSelection() function", () => {
    it("with a successful response", () => {
      const displayTableOptions: boolean = true;
      const toggleSelection = jest.fn();

      const toggleActionModal = (actionType: EFolderEmailActionType) => undefined;

      const { container } = render(
        <FolderTableOptions
          displayTableOptions={displayTableOptions}
          toggleSelection={toggleSelection}
          toggleActionModal={toggleActionModal}
        />
      );

      const selectedIcon = container.querySelector(`[data-icon="xmark"]`)!;
      fireEvent.click(selectedIcon);

      expect(toggleSelection).toHaveBeenCalled();
    });
  });
});
