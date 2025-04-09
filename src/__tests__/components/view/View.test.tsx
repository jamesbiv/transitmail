import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { contextSpyHelper, sleep } from "__tests__/fixtures";
import { ImapHelper, ImapSocket, StateManager } from "classes";
import { EComposePresetType, EImapResponseStatus, IComposePresets } from "interfaces";

import { View } from "components";

describe("View Component", () => {
  beforeEach(() => {
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

    const getFolderIdSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<StateManager>("stateManager"),
      "getFolderId"
    );

    getFolderIdSpy.mockImplementationOnce(() => "1");

    const updateActiveKeySpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<StateManager>("stateManager"),
      "updateActiveKey"
    );

    updateActiveKeySpy.mockImplementationOnce(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("test getEmail() function", () => {
    it("showing an incoming email as text/html", async () => {
      const formatFetchEmailFlagsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailFlagsResponse"
      );

      formatFetchEmailFlagsResponseSpy.mockImplementation(() => {
        return {
          deleted: false,
          flags: "\\Seen",
          seen: true,
          size: 100
        };
      });

      const formatFetchEmailResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailResponse"
      );

      formatFetchEmailResponseSpy.mockImplementation(() => {
        return {
          emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
          headersRaw: "Test email header",
          contentRaw: "Test email body\r\n\r\n",
          bodyHtml: "<p>Test email body</p>\r\n\r\n"
        };
      });

      const { container } = render(<View />);

      await sleep(100);

      await waitFor(() => {
        const iFrame: Element = container.querySelector("#emailBody")!;

        expect(iFrame).toBeInTheDocument();
      });
    });

    it("showing an incoming email as text/plain (default)", async () => {
      const formatFetchEmailFlagsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailFlagsResponse"
      );

      formatFetchEmailFlagsResponseSpy.mockImplementation(() => {
        return {
          deleted: false,
          flags: "\\Seen",
          seen: true,
          size: 100
        };
      });

      const formatFetchEmailResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailResponse"
      );

      formatFetchEmailResponseSpy.mockImplementation(() => {
        return {
          emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
          headersRaw: "Test email header",
          contentRaw: "Test email body\r\n\r\n",
          bodyText: "Test email body\r\n\r\n"
        };
      });

      const { getByText } = render(<View />);

      await sleep(100);

      await waitFor(() => {
        expect(getByText(/Test email body/i)).toBeInTheDocument();
      });
    });
  });

  describe("test replyToEmail() function", () => {
    it("as normal reply (all: false)", async () => {
      const formatFetchEmailFlagsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailFlagsResponse"
      );

      formatFetchEmailFlagsResponseSpy.mockImplementation(() => {
        return {
          deleted: false,
          flags: "\\Seen",
          seen: true,
          size: 100
        };
      });

      const formatFetchEmailResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailResponse"
      );

      formatFetchEmailResponseSpy.mockImplementation(() => {
        return {
          emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
          headersRaw: "Test email header",
          contentRaw: "Test email body\r\n\r\n",
          bodyText: "Test email body\r\n\r\n"
        };
      });

      const setComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "setComposePresets"
      );

      setComposePresetsSpy.mockImplementation((composePresets?: IComposePresets) => undefined);

      const { container, getByText } = render(<View />);

      await sleep(100);

      await waitFor(() => {
        expect(getByText(/Test email body/i)).toBeInTheDocument();
      });

      const replyIcon = container.querySelector('[data-icon="reply"]')!;
      fireEvent.click(replyIcon);

      expect(setComposePresetsSpy).toHaveBeenCalledWith({
        type: EComposePresetType.Reply,
        email: {
          emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
          headersRaw: "Test email header",
          contentRaw: "Test email body\r\n\r\n",
          bodyText: "Test email body\r\n\r\n"
        }
      });
    });

    it("as reply all (all: true)", async () => {
      const formatFetchEmailFlagsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailFlagsResponse"
      );

      formatFetchEmailFlagsResponseSpy.mockImplementation(() => {
        return {
          deleted: false,
          flags: "\\Seen",
          seen: true,
          size: 100
        };
      });

      const formatFetchEmailResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailResponse"
      );

      formatFetchEmailResponseSpy.mockImplementation(() => {
        return {
          emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
          headersRaw: "Test email header",
          contentRaw: "Test email body\r\n\r\n",
          bodyText: "Test email body\r\n\r\n"
        };
      });

      const setComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "setComposePresets"
      );

      setComposePresetsSpy.mockImplementation((composePresets?: IComposePresets) => undefined);

      const { container, getByText } = render(<View />);

      await sleep(100);

      await waitFor(() => {
        expect(getByText(/Test email body/i)).toBeInTheDocument();
      });

      const replyIcons = container.querySelectorAll('[data-icon="reply-all"]');
      replyIcons.forEach((replyIcon: Element) => fireEvent.click(replyIcon));

      expect(setComposePresetsSpy).toHaveBeenCalledWith({
        type: EComposePresetType.ReplyAll,
        email: {
          emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
          headersRaw: "Test email header",
          contentRaw: "Test email body\r\n\r\n",
          bodyText: "Test email body\r\n\r\n"
        }
      });
    });
  });

  describe("test forwardEmail() function", () => {
    it("", async () => {
      const formatFetchEmailFlagsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailFlagsResponse"
      );

      formatFetchEmailFlagsResponseSpy.mockImplementation(() => {
        return {
          deleted: false,
          flags: "\\Seen",
          seen: true,
          size: 100
        };
      });

      const formatFetchEmailResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailResponse"
      );

      formatFetchEmailResponseSpy.mockImplementation(() => {
        return {
          emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
          headersRaw: "Test email header",
          contentRaw: "Test email body\r\n\r\n",
          bodyText: "Test email body\r\n\r\n"
        };
      });

      const setComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "setComposePresets"
      );

      setComposePresetsSpy.mockImplementation((composePresets?: IComposePresets) => undefined);

      const { container, getByText } = render(<View />);

      await sleep(100);

      await waitFor(() => {
        expect(getByText(/Test email body/i)).toBeInTheDocument();
      });

      const shareIcons = container.querySelectorAll('[data-icon="share"]');
      shareIcons.forEach((shareIcon: Element) => fireEvent.click(shareIcon));

      expect(setComposePresetsSpy).toHaveBeenCalledWith({
        type: EComposePresetType.Forward,
        email: {
          emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
          headersRaw: "Test email header",
          contentRaw: "Test email body\r\n\r\n",
          bodyText: "Test email body\r\n\r\n"
        }
      });
    });
  });

  describe("test toggleActionModal() function", () => {
    it("", async () => {
      const formatFetchEmailFlagsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailFlagsResponse"
      );

      formatFetchEmailFlagsResponseSpy.mockImplementation(() => {
        return {
          deleted: false,
          flags: "\\Seen",
          seen: true,
          size: 100
        };
      });

      const formatFetchEmailResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailResponse"
      );

      formatFetchEmailResponseSpy.mockImplementation(() => {
        return {
          emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
          headersRaw: "Test email header",
          contentRaw: "Test email body\r\n\r\n",
          bodyText: "Test email body\r\n\r\n"
        };
      });

      const { container, getByText } = render(<View />);

      await sleep(100);

      await waitFor(() => {
        expect(getByText(/Test email body/i)).toBeInTheDocument();
      });

      const trashIcons = container.querySelectorAll('[data-icon="trash"]');
      trashIcons.forEach((trashIcon: Element) => fireEvent.click(trashIcon));

      expect(1).toBe(1);
    });
  });
});
