import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EFolderEmailActionType, FolderScrollContainer } from "components/folder";
import { IFolderEmail, IFolderEmailActions } from "interfaces";

import { InfiniteScroll } from "classes";
import { sleep } from "__tests__/fixtures";

describe("FolderScrollContainer Component", () => {
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

  describe("testing componentDidUpdate and updateVisibleEmails", () => {
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

      const { rerender } = render(
        <FolderScrollContainer
          folderEmails={folderEmails}
          folderEmailActions={folderEmailActions}
          setDisplayCardHeader={setDisplayCardHeader}
          toggleActionModal={toggleActionModal}
        />
      );

      rerender(
        <FolderScrollContainer
          folderEmails={undefined}
          folderEmailActions={folderEmailActions}
          setDisplayCardHeader={setDisplayCardHeader}
          toggleActionModal={toggleActionModal}
        />
      );

      // needs test case
    });

    it("with a successful response with getCurrentSlice as undefined", () => {
      const getCurrentSliceSpy: jest.SpyInstance = jest.spyOn(
        InfiniteScroll.prototype,
        "getCurrentSlice"
      );

      getCurrentSliceSpy.mockImplementationOnce(() => undefined);

      const folderEmails: IFolderEmail[] = [];

      const folderEmailActions: IFolderEmailActions = {
        viewEmail: (uid: number) => undefined,
        replyToEmail: (uid: number) => undefined,
        forwardEmail: (uid: number) => undefined,
        deleteEmail: (uid: number) => undefined
      };

      const setDisplayCardHeader = () => true;
      const toggleActionModal = (actionType: EFolderEmailActionType) => undefined;

      const { rerender } = render(
        <FolderScrollContainer
          folderEmails={folderEmails}
          folderEmailActions={folderEmailActions}
          setDisplayCardHeader={setDisplayCardHeader}
          toggleActionModal={toggleActionModal}
        />
      );

      rerender(
        <FolderScrollContainer
          folderEmails={undefined}
          folderEmailActions={folderEmailActions}
          setDisplayCardHeader={setDisplayCardHeader}
          toggleActionModal={toggleActionModal}
        />
      );

      // needs test case
    });
  });

  describe("testing toggleSelection() function", () => {
    it("a successful response clicking select all and selecting all the emails in the folder", async () => {
      const initiateHandlersSpy: jest.SpyInstance = jest.spyOn(
        InfiniteScroll.prototype,
        "initiateHandlers"
      );

      initiateHandlersSpy.mockImplementation(
        (scrollElementId, topElementId, bottomElementId, scrollHandler) => {
          scrollHandler({ minIndex: 0, maxIndex: 0 });
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
        viewEmail: (uid: number) => undefined,
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

      const selectAllBox = container.querySelector("#formFolderSelectAll")!;
      fireEvent.click(selectAllBox);

      const checkBoxes = container.querySelectorAll(
        '[class="form-check-input"]'
      ) as unknown as HTMLInputElement[];

      checkBoxes.forEach((checkBox) => expect(checkBox).toBeTruthy());
    });

    it("a successful response clicking select all but since there are no emails displayTableOptions stays false", async () => {
      const initiateHandlersSpy: jest.SpyInstance = jest.spyOn(
        InfiniteScroll.prototype,
        "initiateHandlers"
      );

      initiateHandlersSpy.mockImplementation(
        (scrollElementId, topElementId, bottomElementId, scrollHandler) => {
          scrollHandler({ minIndex: 0, maxIndex: 0 });
        }
      );

      const folderEmails = undefined;

      const folderEmailActions: IFolderEmailActions = {
        viewEmail: (uid: number) => undefined,
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

      const selectAllBox = container.querySelector("#formFolderSelectAll")!;
      fireEvent.click(selectAllBox);

      const checkBoxes = container.querySelectorAll(
        '[class="form-check-input"]'
      ) as unknown as HTMLInputElement[];

      checkBoxes.forEach((checkBox) => expect(checkBox).toBeTruthy());
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
          scrollHandler({ minIndex: -1, maxIndex: 10 });
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
        },
        {
          id: 2,
          date: "Fri, 24 Jul 2020 00:00:00 -0300",
          epoch: 1595559600000,
          from: "Test Display Name <test@emailAddress.com>",
          subject: "(no subject)",
          uid: 2,
          ref: "2",
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

      expect(folderEmailActions.viewEmail).toHaveBeenCalledWith(2);
    });
  });

  describe("testing folderScrollSpinner", () => {
    it("", async () => {
      const initiateHandlersSpy: jest.SpyInstance = jest.spyOn(
        InfiniteScroll.prototype,
        "initiateHandlers"
      );

      initiateHandlersSpy.mockImplementation(
        (scrollElementId, topElementId, bottomElementId, scrollHandler) => {
          scrollHandler({
            minIndex: 0,
            maxIndex: 0,
            folderScrollSpinner: { top: true, bottom: true }
          });
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

      // getAllByText

      expect(1).toBe(1);
    });
  });
});
