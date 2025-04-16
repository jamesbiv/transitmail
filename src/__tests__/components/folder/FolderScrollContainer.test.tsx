import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EFolderEmailActionType, FolderScrollContainer } from "components/folder";
import { IFolderEmail, IFolderEmailActions } from "interfaces";

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
    });
  });
});
