import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { FolderEmailEntry } from "components/folder";
import { IFolderEmail, IFolderEmailActions, IFolderLongPress } from "interfaces";

describe("FolderEmailEntry Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("testing toggleSelection() function", () => {
    it("with a successful response", () => {
      const email: IFolderEmail = {
        id: 1,
        date: "Fri, 24 Jul 2020 00:00:00 -0300",
        epoch: 1595559600000,
        from: "Test Display Name <test@emailAddress.com>",
        subject: "(no subject)",
        uid: 1,
        ref: "1",
        flags: "\\Seen",
        hasAttachment: false,
        selected: false
      };

      const toggleSelection = jest.fn().mockImplementation((uid: number) => undefined);

      const folderEmailActions: IFolderEmailActions = {
        viewEmail: (uid: number) => undefined,
        replyToEmail: (uid: number) => undefined,
        forwardEmail: (uid: number) => undefined,
        deleteEmail: (uid: number) => undefined
      };

      const folderLongPress: IFolderLongPress = {
        timer: 0,
        isReturned: true,
        handleLongPress: (emailUid: number, delay?: number) => undefined,
        handleLongRelease: () => undefined
      };

      const { container } = render(
        <FolderEmailEntry
          email={email}
          toggleSelection={toggleSelection}
          folderEmailActions={folderEmailActions}
          folderLongPress={folderLongPress}
        />
      );

      const checkBox = container.querySelector('[class="form-check-input"]')!;
      fireEvent.click(checkBox);

      expect(toggleSelection).toHaveBeenCalledWith(1);
    });

    it("with a successful response but partial and mixed data", () => {
      const email: IFolderEmail = {
        id: 1,
        date: "Fri, 24 Jul 2020 00:00:00 -0300",
        epoch: 1595559600000,
        from: undefined!,
        subject: undefined!,
        uid: 1,
        ref: "1",
        flags: "\\Undefined",
        hasAttachment: true,
        selected: true
      };

      const toggleSelection = jest.fn().mockImplementation((uid: number) => undefined);

      const folderEmailActions: IFolderEmailActions = {
        viewEmail: (uid: number) => undefined,
        replyToEmail: (uid: number) => undefined,
        forwardEmail: (uid: number) => undefined,
        deleteEmail: (uid: number) => undefined
      };

      const folderLongPress: IFolderLongPress = {
        timer: 0,
        isReturned: true,
        handleLongPress: (emailUid: number, delay?: number) => undefined,
        handleLongRelease: () => undefined
      };

      const { container } = render(
        <FolderEmailEntry
          email={email}
          toggleSelection={toggleSelection}
          folderEmailActions={folderEmailActions}
          folderLongPress={folderLongPress}
        />
      );

      const checkBox = container.querySelector('[class="form-check-input"]')!;
      fireEvent.click(checkBox);

      expect(toggleSelection).toHaveBeenCalledWith(1);
    });
  });

  describe("testing folderEmailActions functions", () => {
    it.each([
      ["viewEmail", "envelope-open"],
      ["replyToEmail", "reply"],
      ["forwardEmail", "share"],
      ["deleteEmail", "trash"]
    ])("testing folderEmailActions. %s", (action, icon) => {
      const email: IFolderEmail = {
        id: 1,
        date: "Fri, 24 Jul 2020 00:00:00 -0300",
        epoch: 1595559600000,
        from: "Test Display Name <test@emailAddress.com>",
        subject: "(no subject)",
        uid: 1,
        ref: "1",
        flags: "\\Seen",
        hasAttachment: false,
        selected: false
      };

      const toggleSelection = jest.fn().mockImplementation((uid: number) => undefined);

      const folderEmailActions: IFolderEmailActions = {
        viewEmail: jest.fn().mockImplementation((uid: number) => undefined),
        replyToEmail: jest.fn().mockImplementation((uid: number) => undefined),
        forwardEmail: jest.fn().mockImplementation((uid: number) => undefined),
        deleteEmail: jest.fn().mockImplementation((uid: number) => undefined)
      };

      const folderLongPress: IFolderLongPress = {
        timer: 0,
        isReturned: true,
        handleLongPress: (emailUid: number, delay?: number) => undefined,
        handleLongRelease: () => undefined
      };

      const { container } = render(
        <FolderEmailEntry
          email={email}
          toggleSelection={toggleSelection}
          folderEmailActions={folderEmailActions}
          folderLongPress={folderLongPress}
        />
      );

      const envelopeOpenIcon = container.querySelector(`[data-icon="${icon}"]`)!;
      fireEvent.click(envelopeOpenIcon);

      expect(folderEmailActions[action as keyof IFolderEmailActions]).toHaveBeenCalledWith(1);
    });
  });

  describe("testing folderLongPress functions", () => {
    it.each([[/Subject/], [/00:00:00/i], [/Test Display Name/i]])(
      "with a successful response testing %s pressable sections with isReturned as false",
      (selection) => {
        const email: IFolderEmail = {
          id: 1,
          date: "Fri, 24 Jul 2020 00:00:00 -0300",
          epoch: 1595559600000,
          from: "Test Display Name <test@emailAddress.com>",
          subject: "(no subject)",
          uid: 1,
          ref: "1",
          flags: "\\Seen",
          hasAttachment: false,
          selected: false
        };

        const toggleSelection = jest.fn().mockImplementation((uid: number) => undefined);

        const folderEmailActions: IFolderEmailActions = {
          viewEmail: jest.fn().mockImplementation((uid: number) => undefined),
          replyToEmail: (uid: number) => undefined,
          forwardEmail: (uid: number) => undefined,
          deleteEmail: (uid: number) => undefined
        };

        const folderLongPress: IFolderLongPress = {
          timer: 0,
          isReturned: false,
          handleLongPress: jest
            .fn()
            .mockImplementation((emailUid: number, delay?: number) => undefined),
          handleLongRelease: jest.fn().mockImplementation(() => undefined)
        };

        const { getAllByText } = render(
          <FolderEmailEntry
            email={email}
            toggleSelection={toggleSelection}
            folderEmailActions={folderEmailActions}
            folderLongPress={folderLongPress}
          />
        );

        const pressableSection = getAllByText(selection)[0];

        fireEvent.click(pressableSection);
        fireEvent.touchStart(pressableSection);
        fireEvent.touchEnd(pressableSection);

        expect(folderLongPress.handleLongPress).toHaveBeenCalled();
        expect(folderLongPress.handleLongRelease).toHaveBeenCalled();

        expect(folderEmailActions.viewEmail).toHaveBeenCalledWith(1);
      }
    );
  });

  it.each([[/Subject/], [/00:00:00/i], [/Test Display Name/i]])(
    "with a successful response testing %s pressable sections with isReturned as true",
    (selection) => {
      const email: IFolderEmail = {
        id: 1,
        date: "Fri, 24 Jul 2020 00:00:00 -0300",
        epoch: 1595559600000,
        from: "Test Display Name <test@emailAddress.com>",
        subject: "(no subject)",
        uid: 1,
        ref: "1",
        flags: "\\Seen",
        hasAttachment: false,
        selected: false
      };

      const toggleSelection = jest.fn().mockImplementation((uid: number) => undefined);

      const folderEmailActions: IFolderEmailActions = {
        viewEmail: jest.fn().mockImplementation((uid: number) => undefined),
        replyToEmail: (uid: number) => undefined,
        forwardEmail: (uid: number) => undefined,
        deleteEmail: (uid: number) => undefined
      };

      const folderLongPress: IFolderLongPress = {
        timer: 0,
        isReturned: true,
        handleLongPress: jest
          .fn()
          .mockImplementation((emailUid: number, delay?: number) => undefined),
        handleLongRelease: jest.fn().mockImplementation(() => undefined)
      };

      const { getAllByText } = render(
        <FolderEmailEntry
          email={email}
          toggleSelection={toggleSelection}
          folderEmailActions={folderEmailActions}
          folderLongPress={folderLongPress}
        />
      );

      const pressableSection = getAllByText(selection)[0];

      fireEvent.click(pressableSection);
      fireEvent.touchStart(pressableSection);
      fireEvent.touchEnd(pressableSection);

      expect(folderLongPress.handleLongPress).toHaveBeenCalled();
      expect(folderLongPress.handleLongRelease).toHaveBeenCalled();

      expect(folderEmailActions.viewEmail).not.toHaveBeenCalled();
    }
  );
});
