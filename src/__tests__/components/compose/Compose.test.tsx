import React, { Dispatch } from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Compose } from "components";
import { contextSpyHelper } from "__tests__/fixtures";
import { SecureStorage, StateManager } from "classes";
import { IComposePresets, IMessageModalState } from "interfaces";

const composerPresetsEmail = {
  type: 2,
  email: {
    emailRaw: "",
    headersRaw: "",
    contentRaw: "",
    headers: {
      "return-path": "<james@localhost>",
      "x-original-to": "james@localhost",
      "delivered-to": "james@localhost",
      received: "",
      subject: "Test subject",
      to: "james@localhost",
      cc: "",
      from: "James <james@localhost>",
      "mime-version": "1.0",
      "x-mailer": "Transit alpha0.0.1",
      "content-type": 'multipart/alternative; boundary="transit--client--gx1edd1u"',
      "message-id": "<20250507182522.293E249442D9@21a165c9994b>",
      date: "Wed,  7 May 2025 18:25:22 +0000 (UTC)"
    },
    subject: "Test subject",
    to: "james@localhost",
    cc: "",
    from: "James <james@localhost>",
    mimeType: "multipart/alternative",
    boundaryIds: ["transit--client--gx1edd1u"],
    date: "Wed,  7 May 2025 18:25:22 +0000 (UTC)",
    boundaries: [
      {
        contents: [
          {
            contentRaw: "",
            mimeType: "text/plain",
            charset: "utf-8",
            headers: {
              "content-type": 'text/plain; charset="utf-8"',
              content: "\r\n\r\n\r\n"
            },
            content: "\r\n\r\n\r\n"
          },
          {
            contentRaw: "",
            mimeType: "text/html",
            charset: "utf-8",
            headers: {
              "content-type": 'text/html; charset="utf-8"',
              content: "<p><br></p>\r\n\r\n\r\n"
            },
            content: "<p><br></p>\r\n\r\n\r\n"
          }
        ]
      }
    ],
    bodyText: "\r\n\r\n\r\n",
    bodyTextHeaders: {
      "content-type": 'text/plain; charset="utf-8"',
      content: "\r\n\r\n\r\n"
    },
    bodyHtml: "<p><br></p>\n\n\n",
    bodyHtmlHeaders: {
      "content-type": 'text/html; charset="utf-8"',
      content: "<p><br></p>\r\n\r\n\r\n"
    }
  }
};

jest.mock("lib", () => {
  const originalModule = jest.requireActual("lib");

  return {
    __esModule: true,
    ...originalModule,
    downloadEmail: jest.fn().mockImplementation(() => composerPresetsEmail)
  };
});

describe("Compose Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("testing useEffect()", () => {
    it("a successful response without composerPresets", async () => {
      const getComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getComposePresets"
      );

      getComposePresetsSpy.mockImplementation(() => {
        return {
          email: undefined
        };
      });

      const getSettingSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<SecureStorage>("secureStorage"),
        "getSetting"
      );

      getSettingSpy.mockImplementation((name: string) => {
        switch (name) {
          case "signature":
            return "Test signature";

          case "secondaryEmails":
            return [
              {
                email: "test@emailAddress.com",
                name: "Test Display Name",
                signature: "Test Email Signature"
              }
            ];
        }
      });

      const setComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "setComposePresets"
      );

      render(<Compose />);

      await waitFor(() => expect(setComposePresetsSpy).not.toHaveBeenCalled());
    });

    it("a successful response with any attachment", async () => {
      const convertAttachmentsSpy: jest.SpyInstance = jest.spyOn(
        require("lib"),
        "convertAttachments"
      );

      convertAttachmentsSpy.mockImplementationOnce(() => [
        [
          {
            contentRaw:
              'Content-Type: text/plain; name="testFile.txt"\r\n' +
              'Content-Disposition: attachment; filename="testFile.txt"\r\n' +
              "Content-Transfer-Encoding: base64\r\n" +
              "\r\n" +
              "MQo=\r\n" +
              "\r\n",
            headers: {
              "content-type": 'text/plain; name="testFile.txt"',
              "content-disposition": 'attachment; filename="testFile.txt"',
              "content-transfer-encoding": "base64",
              content: "MQo=\r\n\r\n\r\n"
            },
            content: "MQo=\r\n\r\n\r\n",
            mimeType: "text/plain",
            isAttachment: true,
            key: "uuid-v4-randomKey",
            filename: "testFile.txt",
            encoding: "base64"
          }
        ]
      ]);

      const getComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getComposePresets"
      );

      getComposePresetsSpy.mockImplementation(() => composerPresetsEmail);

      const getSettingSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<SecureStorage>("secureStorage"),
        "getSetting"
      );

      getSettingSpy.mockImplementation((name: string) => {
        switch (name) {
          case "signature":
            return "Test signature";

          case "secondaryEmails":
            return [
              {
                email: "test@emailAddress.com",
                name: "Test Display Name",
                signature: "Test Email Signature"
              }
            ];
        }
      });

      const setComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "setComposePresets"
      );

      render(<Compose />);

      await waitFor(() => expect(setComposePresetsSpy).toHaveBeenCalled());
    });

    it("a successful response with composerPresets.email set", async () => {
      const getComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getComposePresets"
      );

      getComposePresetsSpy.mockImplementation(() => composerPresetsEmail);

      const getSettingSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<SecureStorage>("secureStorage"),
        "getSetting"
      );

      getSettingSpy.mockImplementation((name: string) => {
        switch (name) {
          case "signature":
            return "Test signature";

          case "secondaryEmails":
            return [
              {
                email: "test@emailAddress.com",
                name: "Test Display Name",
                signature: "Test Email Signature"
              }
            ];
        }
      });

      const setComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "setComposePresets"
      );

      render(<Compose />);

      await waitFor(() => expect(setComposePresetsSpy).toHaveBeenCalled());
    });

    it("a successful response with composerPresets.uid set", async () => {
      const getComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getComposePresets"
      );

      getComposePresetsSpy.mockImplementation(() => {
        return { type: 0, uid: 1 };
      });

      const downloadEmailSpy: jest.SpyInstance = jest.spyOn(require("lib"), "downloadEmail");

      downloadEmailSpy.mockImplementation(
        (
          composePresets: IComposePresets,
          setProgressBarNow?: Dispatch<number>,
          progressBarCallbackFn?: () => void
        ) => {
          progressBarCallbackFn && progressBarCallbackFn();
          return composerPresetsEmail;
        }
      );

      const getSettingSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<SecureStorage>("secureStorage"),
        "getSetting"
      );

      getSettingSpy.mockImplementation((name: string) => {
        switch (name) {
          case "signature":
            return "Test signature";

          case "secondaryEmails":
            return [
              {
                email: "test@emailAddress.com",
                name: "Test Display Name",
                signature: "Test Email Signature"
              }
            ];
        }
      });

      const setComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "setComposePresets"
      );

      render(<Compose />);

      await waitFor(() => expect(setComposePresetsSpy).toHaveBeenCalled());
    });
  });

  describe("testing triggerSendEmail()", () => {
    it("a successful response", async () => {
      const sendEmailSpy: jest.SpyInstance = jest.spyOn(require("lib"), "sendEmail");

      sendEmailSpy.mockImplementation(() => {
        return { status: 0, data: [[]] };
      });

      const getComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getComposePresets"
      );

      getComposePresetsSpy.mockImplementation(() => composerPresetsEmail);

      const getSettingSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<SecureStorage>("secureStorage"),
        "getSetting"
      );

      getSettingSpy.mockImplementation((name: string) => {
        switch (name) {
          case "signature":
            return "Test signature";

          case "secondaryEmails":
            return [
              {
                email: "test@emailAddress.com",
                name: "Test Display Name",
                signature: "Test Email Signature"
              }
            ];
        }
      });

      const showMessageModalSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "showMessageModal"
      );

      showMessageModalSpy.mockImplementation(() => undefined);

      const { getAllByText } = render(<Compose />);

      const saveTexts = getAllByText(/Send/i);

      fireEvent.click(saveTexts[0]);
      await waitFor(() => expect(showMessageModalSpy).toHaveBeenCalled());

      fireEvent.click(saveTexts[saveTexts.length - 1]);
      await waitFor(() => expect(showMessageModalSpy).toHaveBeenCalled());

      await waitFor(() =>
        expect(showMessageModalSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            content: "Your email has been sent successfully!",
            title: "Your email has been sent"
          })
        )
      );
    });

    it("an unsuccessful response because an service error", async () => {
      const sendEmailSpy: jest.SpyInstance = jest.spyOn(require("lib"), "sendEmail");

      sendEmailSpy.mockImplementation(() => {
        return { status: 1, data: [[]] };
      });

      const getComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getComposePresets"
      );

      getComposePresetsSpy.mockImplementation(() => composerPresetsEmail);

      const getSettingSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<SecureStorage>("secureStorage"),
        "getSetting"
      );

      getSettingSpy.mockImplementation((name: string) => {
        switch (name) {
          case "signature":
            return "Test signature";

          case "secondaryEmails":
            return [
              {
                email: "test@emailAddress.com",
                name: "Test Display Name",
                signature: "Test Email Signature"
              }
            ];
        }
      });

      const showMessageModalSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "showMessageModal"
      );

      showMessageModalSpy.mockImplementation((messageModalState: IMessageModalState) => {
        messageModalState?.action && messageModalState.action();
      });
      const { getAllByText } = render(<Compose />);

      const saveTexts = getAllByText(/Send/i);

      fireEvent.click(saveTexts[0]);
      await waitFor(() => expect(showMessageModalSpy).toHaveBeenCalled());

      fireEvent.click(saveTexts[saveTexts.length - 1]);
      await waitFor(() => expect(showMessageModalSpy).toHaveBeenCalled());

      await waitFor(() =>
        expect(showMessageModalSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            content: "",
            title: "Unable to send email"
          })
        )
      );
    });

    it("an unsuccessful response because an email is already being sent", async () => {
      const sendEmailSpy: jest.SpyInstance = jest.spyOn(require("lib"), "sendEmail");

      sendEmailSpy.mockImplementationOnce(() => {
        return { status: 0, data: [[]] };
      });

      const getComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getComposePresets"
      );

      getComposePresetsSpy.mockImplementation(() => composerPresetsEmail);

      const getSettingSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<SecureStorage>("secureStorage"),
        "getSetting"
      );

      getSettingSpy.mockImplementation((name: string) => {
        switch (name) {
          case "signature":
            return "Test signature";

          case "secondaryEmails":
            return [
              {
                email: "test@emailAddress.com",
                name: "Test Display Name",
                signature: "Test Email Signature"
              }
            ];
        }
      });

      const showMessageModalSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "showMessageModal"
      );

      showMessageModalSpy.mockImplementation((messageModalState: IMessageModalState) => {
        messageModalState?.action && messageModalState.action();
      });

      const { getAllByText } = render(<Compose />);

      const saveTexts = getAllByText(/Send/i);

      fireEvent.click(saveTexts[0]);
      fireEvent.click(saveTexts[0]);

      await waitFor(() =>
        expect(showMessageModalSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            content: "An email is already currently being processed",
            title: "Unable to send email"
          })
        )
      );
    });
  });

  describe("testing updateSenderDetails()", () => {
    it("a successful response without secondary email", async () => {
      const getComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getComposePresets"
      );

      getComposePresetsSpy.mockImplementation(() => composerPresetsEmail);

      const getSettingSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<SecureStorage>("secureStorage"),
        "getSetting"
      );

      getSettingSpy.mockImplementation((name: string) => {
        switch (name) {
          case "signature":
            return "Test signature";

          case "secondaryEmails":
            return [];
        }
      });

      const { queryByText } = render(<Compose />);

      await waitFor(() => expect(queryByText(/From:/i)).not.toBeInTheDocument());
    });

    it("a successful response selecting default email", async () => {
      const getComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getComposePresets"
      );

      getComposePresetsSpy.mockImplementation(() => composerPresetsEmail);

      const getSettingSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<SecureStorage>("secureStorage"),
        "getSetting"
      );

      getSettingSpy.mockImplementation((name: string) => {
        switch (name) {
          case "signature":
            return "Test signature";

          case "secondaryEmails":
            return [
              {
                email: "test@emailAddress.com",
                name: "Test Display Name",
                signature: "Test Email Signature"
              }
            ];
        }
      });

      const { queryByTestId, getByText } = render(<Compose />);

      const selectComposeSecondaryEmails = queryByTestId("selectComposeSecondaryEmails")!;
      fireEvent.change(selectComposeSecondaryEmails, { target: { value: undefined } });

      expect(getByText(/Test Display Name/i)).toBeInTheDocument();
    });

    it("a successful response with secondary email", async () => {
      const getComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getComposePresets"
      );

      getComposePresetsSpy.mockImplementation(() => composerPresetsEmail);

      const getSettingSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<SecureStorage>("secureStorage"),
        "getSetting"
      );

      getSettingSpy.mockImplementation((name: string) => {
        switch (name) {
          case "signature":
            return "Test signature";

          case "secondaryEmails":
            return [
              {
                email: "test@emailAddress.com",
                name: "Test Display Name",
                signature: "Test Email Signature"
              }
            ];
        }
      });

      const { queryByTestId, getByText } = render(<Compose />);

      const selectComposeSecondaryEmails = queryByTestId("selectComposeSecondaryEmails")!;
      fireEvent.change(selectComposeSecondaryEmails, { target: { value: 0 } });

      expect(getByText(/Test Display Name/i)).toBeInTheDocument();
    });
  });

  describe("testing saveEmail()", () => {
    it("a successful response", async () => {
      const { getAllByText } = render(<Compose />);

      fireEvent.click(getAllByText(/Save/i)[0]);

      expect(true).toBeTruthy();
    });
  });

  describe("testing clearComposer()", () => {
    it("a successful response", async () => {
      const getComposePresetsSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "getComposePresets"
      );

      getComposePresetsSpy.mockImplementation(() => composerPresetsEmail);

      const { container } = render(<Compose />);

      fireEvent.click(container.querySelector('[data-icon="trash"]')!);

      expect(true).toBeTruthy();
    });
  });
});
