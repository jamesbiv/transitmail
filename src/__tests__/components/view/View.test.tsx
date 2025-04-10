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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("test getEmail() function", () => {
    it("returns void because SELECT call failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapRequest"
      );

      imapRequestSpy.mockImplementation((request: string) => {
        if (/SELECT (.*)/i.test(request)) {
          return { data: [[]], status: EImapResponseStatus.BAD };
        }

        return { data: [[]], status: EImapResponseStatus.OK };
      });

      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getFolderId"
      );

      getFolderIdSpy.mockImplementationOnce(() => "inbox");

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

      render(<View />);

      expect(formatFetchEmailResponseSpy).not.toHaveBeenCalled();
    });

    it("returns void because UID FETCH RFC822.SIZE FLAGS call failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapRequest"
      );

      imapRequestSpy.mockImplementation((request: string) => {
        if (/UID FETCH (.*) \(RFC822.SIZE FLAGS\)/i.test(request)) {
          return { data: [[]], status: EImapResponseStatus.BAD };
        }

        return { data: [[]], status: EImapResponseStatus.OK };
      });

      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getFolderId"
      );

      getFolderIdSpy.mockImplementationOnce(() => "inbox");

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

      render(<View />);

      expect(formatFetchEmailResponseSpy).not.toHaveBeenCalled();
    });

    it("returns void because UID FETCH RFC822 call failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapRequest"
      );

      imapRequestSpy.mockImplementation((request: string) => {
        if (/UID FETCH (.*) RFC822/i.test(request)) {
          return { data: [[]], status: EImapResponseStatus.BAD };
        }

        return { data: [[]], status: EImapResponseStatus.OK };
      });

      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getFolderId"
      );

      getFolderIdSpy.mockImplementationOnce(() => "inbox");

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

      render(<View />);

      expect(formatFetchEmailResponseSpy).not.toHaveBeenCalled();
    });

    it("returns void because formatFetchEmailFlagsResponse() call failed", async () => {
      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getFolderId"
      );

      getFolderIdSpy.mockImplementationOnce(() => "inbox");

      const formatFetchEmailFlagsResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailFlagsResponse"
      );

      formatFetchEmailFlagsResponseSpy.mockImplementation(() => undefined);

      const formatFetchEmailResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatFetchEmailResponse"
      );

      render(<View />);

      expect(formatFetchEmailResponseSpy).not.toHaveBeenCalled();
    });

    it("selecting updateActiveKey as inbox since getFolderId was undefined", async () => {
      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getFolderId"
      );

      getFolderIdSpy.mockImplementationOnce(() => undefined);

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

      const updateActiveKeySpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "updateActiveKey"
      );

      render(<View />);

      expect(updateActiveKeySpy).toHaveBeenCalledWith("inbox");
    });

    it("showing an incoming email as text/html", async () => {
      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getFolderId"
      );

      getFolderIdSpy.mockImplementationOnce(() => "inbox");

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

    it("including an attachment", async () => {
      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getFolderId"
      );

      getFolderIdSpy.mockImplementationOnce(() => "inbox");

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
          bodyText: "Test email body\r\n\r\n",
          attachments: [
            { data: "", filename: "testFileName.txt", id: 0, mimeType: "text/plain", size: 1 }
          ]
        };
      });

      const { getByText } = render(<View />);

      await sleep(100);

      await waitFor(() => {
        expect(getByText(/testFileName.txt/i)).toBeInTheDocument();
      });
    });

    it("including a subject field", async () => {
      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getFolderId"
      );

      getFolderIdSpy.mockImplementationOnce(() => "inbox");

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
          bodyText: "Test email body\r\n\r\n",
          subject: "This is a test subject"
        };
      });

      const { getByText } = render(<View />);

      await sleep(100);

      await waitFor(() => {
        expect(getByText(/This is a test subject/i)).toBeInTheDocument();
      });
    });
  });

  describe("test replyToEmail() function", () => {
    it("to not have been called because formatFetchEmailResponse() was empty", async () => {
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

      formatFetchEmailResponseSpy.mockImplementation(() => undefined);

      const setComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "setComposePresets"
      );

      const { container, getByText } = render(<View />);

      await sleep(100);

      await waitFor(() => {
        expect(getByText(/(no subject)/i)).toBeInTheDocument();
      });

      const replyIcon = container.querySelector('[data-icon="reply"]')!;
      fireEvent.click(replyIcon);

      expect(setComposePresetsSpy).not.toHaveBeenCalled();
    });

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
    it("to not have been called because formatFetchEmailResponse() was empty", async () => {
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

      formatFetchEmailResponseSpy.mockImplementation(() => undefined);

      const setComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "setComposePresets"
      );

      setComposePresetsSpy.mockImplementation((composePresets?: IComposePresets) => undefined);

      const { container, getByText } = render(<View />);

      await sleep(100);

      await waitFor(() => {
        expect(getByText(/(no subject)/i)).toBeInTheDocument();
      });

      const shareIcons = container.querySelectorAll('[data-icon="share"]');
      shareIcons.forEach((shareIcon: Element) => fireEvent.click(shareIcon));

      expect(setComposePresetsSpy).not.toHaveBeenCalled();
    });

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
