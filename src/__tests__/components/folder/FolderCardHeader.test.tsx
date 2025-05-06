import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { FolderCardHeader } from "components/folder";

describe("FolderCardHeader Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("testing checkEmail() function", () => {
    it("with a successful response", () => {
      const folderName: string = "folder";
      const folderSpinner: boolean = true;

      const checkEmail = jest.fn();
      const searchEmails = (searchQuery: string) => undefined;

      const { container } = render(
        <FolderCardHeader
          folderName={folderName}
          folderSpinner={folderSpinner}
          checkEmail={checkEmail}
          searchEmails={searchEmails}
        />
      );

      const checkEmailIcon = container.querySelector('[data-icon="arrows-rotate"]')!;
      fireEvent.click(checkEmailIcon);

      expect(checkEmail).toHaveBeenCalled();
    });
  });

  describe("testing searchEmails() function", () => {
    it("with a successful response", () => {
      const folderName: string = "folder";
      const folderSpinner: boolean = true;

      const checkEmail = async () => undefined;
      const searchEmails = jest.fn();

      const { container } = render(
        <FolderCardHeader
          folderName={folderName}
          folderSpinner={folderSpinner}
          checkEmail={checkEmail}
          searchEmails={searchEmails}
        />
      );

      const formSearchFolders = container.querySelector("#formSearchFolders")!;
      fireEvent.change(formSearchFolders, { target: { value: "test search" } });

      expect(searchEmails).toHaveBeenCalled();
    });
  });
});
