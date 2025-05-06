import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { FolderTableHeader } from "components/folder";
import { IFolderEmail } from "interfaces";

describe("FolderTableHeader Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("testing sortFolder() function", () => {
    it.each([
      ["Date", "epoch", "asc"],
      ["Date", "epoch", "desc"],
      ["From", "from", "asc"],
      ["From", "from", "desc"],
      ["Subject", "subject", "asc"],
      ["Subject", "subject", "desc"]
    ])("with a successful response for %s using %s in %s order", (type, field, direction) => {
      const folderEmails: IFolderEmail[] = [
        {
          id: 1,
          date: "Fri, 24 Jul 2020 00:00:00 -0300",
          epoch: 12345678910,
          from: "Test From Address <test@emailAddress.com>",
          subject: "Test subject",
          uid: 1,
          ref: "testFolder",
          flags: "",
          hasAttachment: false,
          selected: false
        },
        {
          id: 2,
          date: "Fri, 24 Jul 2020 00:00:01 -0300",
          epoch: 10987654321,
          from: "Test From Address <test@emailAddress.com>",
          subject: "Test subject",
          uid: 1,
          ref: "testFolder2",
          flags: "",
          hasAttachment: false,
          selected: false
        },
        {
          id: 3,
          date: "Fri, 24 Jul 2020 00:00:01 -0300",
          epoch: 11345678910,
          from: "Test From Address <test@emailAddress.com>",
          subject: "Test subject",
          uid: 1,
          ref: "testFolder2",
          flags: "",
          hasAttachment: false,
          selected: false
        }
      ];

      const toggleSelectionAll: boolean = true;
      const toggleSelection = (uid: number, forceToogle?: boolean) => undefined;
      const updateVisibleEmails = (definedLength?: number) => undefined;

      const { getByText } = render(
        <FolderTableHeader
          folderEmails={folderEmails}
          toggleSelectionAll={toggleSelectionAll}
          toggleSelection={toggleSelection}
          updateVisibleEmails={updateVisibleEmails}
        />
      );

      const fieldToSort = getByText(new RegExp(type, "i"));
      const icon: string = direction === "asc" ? "up-long" : "down-long";

      const folderEmailsBefore: IFolderEmail[] = [...folderEmails];

      const selectedIcon = fieldToSort.querySelector(`[data-icon="${icon}"]`)!;
      fireEvent.click(selectedIcon);

      const folderEmailsAfter: IFolderEmail[] = [...folderEmails];

      expect(folderEmailsBefore).not.toEqual(folderEmailsAfter);
    });
  });

  describe("testing toggleSelection() function", () => {
    it("with a successful response", () => {
      const folderEmails: IFolderEmail[] = [
        {
          id: 1,
          date: "Fri, 24 Jul 2020 00:00:00 -0300",
          epoch: 12345678910,
          from: "Test From Address <test@emailAddress.com>",
          subject: "Test subject",
          uid: 1,
          ref: "testFolder",
          flags: "",
          hasAttachment: false,
          selected: false
        },
        {
          id: 2,
          date: "Fri, 24 Jul 2020 00:00:01 -0300",
          epoch: 10987654321,
          from: "Test From Address <test@emailAddress.com>",
          subject: "Test subject",
          uid: 1,
          ref: "testFolder2",
          flags: "",
          hasAttachment: false,
          selected: false
        }
      ];

      const toggleSelectionAll: boolean = true;
      const toggleSelection = jest.fn();
      const updateVisibleEmails = (definedLength?: number) => undefined;

      const { container } = render(
        <FolderTableHeader
          folderEmails={folderEmails}
          toggleSelectionAll={toggleSelectionAll}
          toggleSelection={toggleSelection}
          updateVisibleEmails={updateVisibleEmails}
        />
      );

      const selectAllIcon = container.querySelector("#formFolderSelectAll")!;
      fireEvent.click(selectAllIcon);

      expect(toggleSelection).toHaveBeenCalledWith(-1);
    });
  });
});
