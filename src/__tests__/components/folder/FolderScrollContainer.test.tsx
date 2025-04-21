import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EFolderEmailActionType, FolderScrollContainer } from "components/folder";
import { IFolderEmail, IFolderEmailActions } from "interfaces";

import { InfiniteScroll } from "classes";
import { sleep } from "__tests__/fixtures";

describe("FolderTableOptions Component", () => {
  const originalIntersectionObserver = global.IntersectionObserver;

  beforeEach(() => {
    global.IntersectionObserver = class {
      readonly root = document.createElement("root");
      readonly rootMargin: string = "";
      readonly thresholds: ReadonlyArray<number> = [];

      disconnect() {
        return undefined;
      }
      observe(target: Element) {
        return undefined;
      }
      takeRecords() {
        return [];
      }
      unobserve(target: Element) {
        return undefined;
      }
    };
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;

    jest.restoreAllMocks();
  });

  describe("", () => {
    it("with a successful response", () => {
      const folderEmails: IFolderEmail[] = [];

      const folderEmailActions: IFolderEmailActions = {
        viewEmail: (uid: number) => undefined,
        replyToEmail: (uid: number) => undefined,
        forwardEmail: (uid: number) => undefined,
        deleteEmail: (uid: number) => undefined
      };

      const setDisplayCardHeader = () => true;
      const toggleActionModal = (actionType: EFolderEmailActionType) => undefined;

      render(
        <FolderScrollContainer
          folderEmails={folderEmails}
          folderEmailActions={folderEmailActions}
          setDisplayCardHeader={setDisplayCardHeader}
          toggleActionModal={toggleActionModal}
        />
      );

      // needs test case
    });
  });

  describe("testing toggleSelection() function", () => {
    it("", () => {
      const initiateHandlersSpy: jest.SpyInstance = jest.spyOn(
        InfiniteScroll.prototype,
        "initiateHandlers"
      );

      initiateHandlersSpy.mockImplementation(
        (scrollElementId, topElementId, bottomElementId, scrollHandler) => {
          scrollHandler(0, 10, { top: 1, bottom: 1 }, { top: true, bottom: true });
        }
      );

      const folderEmails: IFolderEmail[] = [
        {
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
        }
      ];

      const folderEmailActions: IFolderEmailActions = {
        viewEmail: jest.fn().mockImplementation((uid: number) => undefined),
        replyToEmail: (uid: number) => undefined,
        forwardEmail: (uid: number) => undefined,
        deleteEmail: (uid: number) => undefined
      };

      const setDisplayCardHeader = () => true;
      const toggleActionModal = (actionType: EFolderEmailActionType) => undefined;

      const { container } = render(
        <FolderScrollContainer
          folderEmails={folderEmails}
          folderEmailActions={folderEmailActions}
          setDisplayCardHeader={setDisplayCardHeader}
          toggleActionModal={toggleActionModal}
        />
      );

      const checkBox = container.querySelector('[class="form-check-input"]')!;
      fireEvent.click(checkBox);

      // needs test case
    });
  });

  describe("testing handleLongPress function", () => {
    it("", async () => {
      const initiateHandlersSpy: jest.SpyInstance = jest.spyOn(
        InfiniteScroll.prototype,
        "initiateHandlers"
      );

      initiateHandlersSpy.mockImplementation(
        (scrollElementId, topElementId, bottomElementId, scrollHandler) => {
          scrollHandler(0, 10, { top: 1, bottom: 1 }, { top: true, bottom: true });
        }
      );

      const folderEmails: IFolderEmail[] = [
        {
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
        }
      ];

      const folderEmailActions: IFolderEmailActions = {
        viewEmail: jest.fn().mockImplementation((uid: number) => undefined),
        replyToEmail: (uid: number) => undefined,
        forwardEmail: (uid: number) => undefined,
        deleteEmail: (uid: number) => undefined
      };

      const setDisplayCardHeader = () => true;
      const toggleActionModal = (actionType: EFolderEmailActionType) => undefined;

      const { getAllByText } = render(
        <FolderScrollContainer
          folderEmails={folderEmails}
          folderEmailActions={folderEmailActions}
          setDisplayCardHeader={setDisplayCardHeader}
          toggleActionModal={toggleActionModal}
        />
      );

      const pressableSection = getAllByText(/Subject/)[0];

      fireEvent.click(pressableSection);

      fireEvent.touchStart(pressableSection);

      await sleep(1500);

      fireEvent.touchEnd(pressableSection);

      expect(folderEmailActions.viewEmail).toHaveBeenCalledWith(1);
    });
  });
});
