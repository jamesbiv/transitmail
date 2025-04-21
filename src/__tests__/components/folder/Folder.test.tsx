import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { contextSpyHelper } from "__tests__/fixtures";

import { Folder } from "components/folder";
import { ImapHelper, ImapSocket, StateManager } from "classes";
import { EImapResponseStatus } from "interfaces";

// jest.mock("contexts/DependenciesContext");

describe("Folder Component", () => {
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

    const imapCheckOrConnectSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<ImapSocket>("imapSocket"),
      "imapCheckOrConnect"
    );

    imapCheckOrConnectSpy.mockImplementationOnce(() => true);

    const getStreamAmountSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<ImapSocket>("imapSocket"),
      "getStreamAmount"
    );

    getStreamAmountSpy.mockImplementationOnce(() => 100);

    const imapRequestSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<ImapSocket>("imapSocket"),
      "imapRequest"
    );

    imapRequestSpy.mockImplementation(async () => {
      return { data: [[]], status: EImapResponseStatus.OK };
    });
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;

    jest.restoreAllMocks();
  });

  describe("testing getFolderEmails()", () => {
    it("a successful response", async () => {
      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementationOnce(() => undefined);

      const formatFetchFolderEmailsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchFolderEmailsResponse"
      );

      formatFetchFolderEmailsResponseSpy.mockImplementationOnce(() => [
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
      ]);

      const updateCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "updateCurrentFolder"
      );

      render(<Folder />);

      await waitFor(() =>
        expect(updateCurrentFolderSpy).toHaveBeenCalledWith([
          {
            date: "Fri, 24 Jul 2020 00:00:00 -0300",
            epoch: 1595559600000,
            flags: "\\Seen",
            from: "Test Display Name <test@emailAddress.com>",
            hasAttachment: false,
            id: 1,
            ref: "1",
            selected: false,
            subject: "(no subject)",
            uid: 1
          }
        ])
      );
    });
  });

  describe("testing checkEmail()", () => {
    it("a successful response ensuring heighest UID selected during email check", async () => {
      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getCurrentFolder"
      );

      getCurrentFolderSpy
        .mockImplementationOnce(() => undefined)
        .mockImplementationOnce(() => {
          return {
            emails: [
              {
                id: 100,
                date: "Fri, 24 Jul 2020 00:00:00 -0300",
                epoch: 1595559600000,
                from: "Test Display Name <test@emailAddress.com>",
                subject: "(no subject)",
                uid: 100,
                ref: "100",
                flags: "\\Seen",
                hasAttachment: false,
                selected: false
              },
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
            ]
          };
        });

      const formatFetchFolderEmailsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchFolderEmailsResponse"
      );

      formatFetchFolderEmailsResponseSpy
        .mockImplementationOnce(() => [
          {
            id: 100,
            date: "Fri, 24 Jul 2020 00:00:00 -0300",
            epoch: 1595559600000,
            from: "Test Display Name <test@emailAddress.com>",
            subject: "(no subject)",
            uid: 100,
            ref: "100",
            flags: "\\Seen",
            hasAttachment: false,
            selected: false
          },
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
        ])
        .mockImplementationOnce(() => [
          {
            id: 1000,
            date: "Fri, 24 Jul 2020 00:00:00 -0300",
            epoch: 1595559600000,
            from: "Test Display Name <test@emailAddress.com>",
            subject: "(no subject)",
            uid: 1000,
            ref: "1000",
            flags: "\\Seen",
            hasAttachment: false,
            selected: false
          }
        ]);

      const updateCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "updateCurrentFolder"
      );

      const { container } = render(<Folder />);

      await waitFor(() => expect(updateCurrentFolderSpy).toHaveBeenCalled());

      const checkEmailIcon = container.querySelector('[data-icon="arrows-rotate"]')!;
      fireEvent.click(checkEmailIcon);

      await waitFor(() =>
        expect(updateCurrentFolderSpy).toHaveBeenCalledWith([
          {
            id: 1000,
            date: "Fri, 24 Jul 2020 00:00:00 -0300",
            epoch: 1595559600000,
            from: "Test Display Name <test@emailAddress.com>",
            subject: "(no subject)",
            uid: 1000,
            ref: "1000",
            flags: "\\Seen",
            hasAttachment: false,
            selected: false
          },
          {
            id: 100,
            date: "Fri, 24 Jul 2020 00:00:00 -0300",
            epoch: 1595559600000,
            from: "Test Display Name <test@emailAddress.com>",
            subject: "(no subject)",
            uid: 100,
            ref: "100",
            flags: "\\Seen",
            hasAttachment: false,
            selected: false
          },
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
        ])
      );
    });

    it("a successful response", async () => {
      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementationOnce(() => undefined);

      const formatFetchFolderEmailsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchFolderEmailsResponse"
      );

      formatFetchFolderEmailsResponseSpy.mockImplementationOnce(() => [
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
      ]);

      const updateCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "updateCurrentFolder"
      );

      const { container } = render(<Folder />);

      await waitFor(() => expect(updateCurrentFolderSpy).toHaveBeenCalled());

      const checkEmailIcon = container.querySelector('[data-icon="arrows-rotate"]')!;
      fireEvent.click(checkEmailIcon);

      await waitFor(() =>
        expect(updateCurrentFolderSpy).toHaveBeenCalledWith([
          {
            date: "Fri, 24 Jul 2020 00:00:00 -0300",
            epoch: 1595559600000,
            flags: "\\Seen",
            from: "Test Display Name <test@emailAddress.com>",
            hasAttachment: false,
            id: 1,
            ref: "1",
            selected: false,
            subject: "(no subject)",
            uid: 1
          }
        ])
      );
    });
  });

  describe("testing searchEmails()", () => {
    it("a successful response", async () => {
      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementation(() => {
        return {
          emails: [
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
          ]
        };
      });

      const formatFetchFolderEmailsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchFolderEmailsResponse"
      );

      formatFetchFolderEmailsResponseSpy.mockImplementationOnce(() => undefined);

      const { container, getAllByText } = render(<Folder />);

      const formSearchFolders = container.querySelector("#formSearchFolders")!;
      fireEvent.change(formSearchFolders, { target: { value: "(no subject)" } });

      expect(getAllByText(/Test Display Name/i)[0]).toBeInTheDocument();
    });
  });

  describe("testing folderEmailActions functions", () => {
    it.each([
      ["viewEmail", "envelope-open", true],
      ["replyToEmail", "reply", true],
      ["forwardEmail", "share", true],
      ["deleteEmail", "trash", false]
    ])(
      "testing folderEmailActions.%s",
      async (action, icon, expectUpdateActiveKeyToHaveBeenCalled = true) => {
        const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
          contextSpyHelper<StateManager>("stateManager"),
          "getCurrentFolder"
        );

        getCurrentFolderSpy.mockImplementation(() => {
          return {
            emails: [
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
            ]
          };
        });

        const formatFetchFolderEmailsResponseSpy: jest.SpyInstance = jest.spyOn(
          contextSpyHelper<ImapHelper>("imapHelper"),
          "formatFetchFolderEmailsResponse"
        );

        formatFetchFolderEmailsResponseSpy.mockImplementation(() => undefined);

        const updateCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
          contextSpyHelper<StateManager>("stateManager"),
          "updateCurrentFolder"
        );

        const updateActiveKeySpy: jest.SpyInstance = jest.spyOn(
          contextSpyHelper<StateManager>("stateManager"),
          "updateActiveKey"
        );

        const { container, getAllByText } = render(<Folder />);

        await waitFor(() => expect(updateCurrentFolderSpy).toHaveBeenCalled());

        const formSearchFolders = container.querySelector("#formSearchFolders")!;
        fireEvent.change(formSearchFolders, { target: { value: "(no subject)" } });

        expect(getAllByText(/Test Display Name/i)[0]).toBeInTheDocument();

        const actionIcons = container.querySelectorAll(`[data-icon="${icon}"]`);
        actionIcons.forEach((actionIcon) => fireEvent.click(actionIcon));

        expectUpdateActiveKeyToHaveBeenCalled
          ? expect(updateActiveKeySpy).toHaveBeenCalled()
          : expect(updateActiveKeySpy).not.toHaveBeenCalled();
      }
    );
  });

  describe("testing toggleActionModal() and updateFolderActionState()", () => {
    it("a successful response", async () => {
      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementationOnce(() => undefined);

      const formatFetchFolderEmailsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchFolderEmailsResponse"
      );

      formatFetchFolderEmailsResponseSpy.mockImplementationOnce(() => [
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
      ]);

      const updateCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "updateCurrentFolder"
      );

      const { container, getByText } = render(<Folder />);

      await waitFor(() =>
        expect(updateCurrentFolderSpy).toHaveBeenCalledWith([
          {
            date: "Fri, 24 Jul 2020 00:00:00 -0300",
            epoch: 1595559600000,
            flags: "\\Seen",
            from: "Test Display Name <test@emailAddress.com>",
            hasAttachment: false,
            id: 1,
            ref: "1",
            selected: false,
            subject: "(no subject)",
            uid: 1
          }
        ])
      );

      const moveIcon = container.querySelector(`[data-icon="suitcase"]`)!;
      fireEvent.click(moveIcon);

      // insert a watching a redering change to validate here

      fireEvent.click(getByText(/Close/i));

      // insert a watching a redering change to validate here
    });
  });
});
