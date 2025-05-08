import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeRecipientDetails } from "components/compose";
import { IComposeRecipient } from "interfaces";

describe("ComposeRecipientDetails Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("testing default rendering", () => {
    it("a successful response without recipients", () => {
      const recipients: IComposeRecipient[] = [];
      const subject: string = "";
      const setRecipients = () => undefined;
      const setSubject = () => undefined;

      const { getByText } = render(
        <ComposeRecipientDetails
          recipients={recipients}
          subject={subject}
          setRecipients={setRecipients}
          setSubject={setSubject}
        />
      );

      expect(getByText(/Subject/i)).toBeInTheDocument();
    });

    it("a successful response with recipients", () => {
      const recipients: IComposeRecipient[] = [
        {
          id: 1,
          type: "To",
          value: "Test Display Name <test@emailAddress.com>"
        },
        {
          id: 2,
          type: "Cc",
          value: "Test Cc Name <test@emailAddress.com>"
        }
      ];

      const subject: string = "";

      const setRecipients = () => undefined;
      const setSubject = () => undefined;

      const { getByText } = render(
        <ComposeRecipientDetails
          recipients={recipients}
          subject={subject}
          setRecipients={setRecipients}
          setSubject={setSubject}
        />
      );

      expect(getByText(/Cc/i)).toBeInTheDocument();
    });
  });

  describe("testing updateRecipientType()", () => {
    it("a successful response", () => {
      const recipients: IComposeRecipient[] = [
        {
          id: 1,
          type: "To",
          value: "Test Display Name <test@emailAddress.com>"
        }
      ];

      const subject: string = "";

      const setRecipients = jest.fn().mockImplementation(() => undefined);
      const setSubject = () => undefined;

      const { container, getAllByText } = render(
        <ComposeRecipientDetails
          recipients={recipients}
          subject={subject}
          setRecipients={setRecipients}
          setSubject={setSubject}
        />
      );

      const dropDownMenu = container.querySelector('[id="1"]')!;

      fireEvent.click(dropDownMenu);
      fireEvent.click(getAllByText(/Cc/i)[0]);

      expect(setRecipients).toHaveBeenCalledWith([
        { id: 1, type: "Cc", value: "Test Display Name <test@emailAddress.com>" }
      ]);
    });
  });

  describe("testing updateRecipientValue()", () => {
    it("a successful response", () => {
      const recipients: IComposeRecipient[] = [
        {
          id: 1,
          type: "To",
          value: "Test Display Name <test@emailAddress.com>"
        }
      ];

      const subject: string = "";

      const setRecipients = jest.fn().mockImplementation(() => undefined);
      const setSubject = () => undefined;

      const { getByPlaceholderText } = render(
        <ComposeRecipientDetails
          recipients={recipients}
          subject={subject}
          setRecipients={setRecipients}
          setSubject={setSubject}
        />
      );

      fireEvent.change(getByPlaceholderText(/Enter email address/i), {
        target: { value: "test@emailAddress.com" }
      });

      expect(setRecipients).toHaveBeenCalledWith([
        { id: 1, type: "To", value: "test@emailAddress.com" }
      ]);
    });
  });

  describe("testing deleteRecipient()", () => {
    it("a successful response with two recpients", () => {
      const recipients: IComposeRecipient[] = [
        {
          id: 1,
          type: "To",
          value: "Test Display Name <test@emailAddress.com>"
        },
        {
          id: 2,
          type: "Cc",
          value: "Test Cc Name <test@emailAddress.com>"
        }
      ];

      const subject: string = "";

      const setRecipients = jest.fn().mockImplementation(() => undefined);
      const setSubject = () => undefined;

      const { container } = render(
        <ComposeRecipientDetails
          recipients={recipients}
          subject={subject}
          setRecipients={setRecipients}
          setSubject={setSubject}
        />
      );

      const checkEmailIcon = container.querySelector('[data-icon="trash"]')!;
      fireEvent.click(checkEmailIcon);

      expect(setRecipients).toHaveBeenCalledWith([
        { id: 2, type: "To", value: "Test Cc Name <test@emailAddress.com>" }
      ]);
    });

    it("a successful response with three or more recpients", () => {
      const recipients: IComposeRecipient[] = [
        {
          id: 1,
          type: "To",
          value: "Test Display Name <test@emailAddress.com>"
        },
        {
          id: 2,
          type: "Cc",
          value: "Test Cc Name <test@emailAddress.com>"
        },
        {
          id: 3,
          type: "Bcc",
          value: "Test Bcc Name <test@emailAddress.com>"
        }
      ];

      const subject: string = "";

      const setRecipients = jest.fn().mockImplementation(() => undefined);
      const setSubject = () => undefined;

      const { container } = render(
        <ComposeRecipientDetails
          recipients={recipients}
          subject={subject}
          setRecipients={setRecipients}
          setSubject={setSubject}
        />
      );

      const checkEmailIcon = container.querySelector('[data-icon="trash"]')!;
      fireEvent.click(checkEmailIcon);

      expect(setRecipients).toHaveBeenCalledWith([
        {
          id: 2,
          type: "Cc",
          value: "Test Cc Name <test@emailAddress.com>"
        },
        {
          id: 3,
          type: "Bcc",
          value: "Test Bcc Name <test@emailAddress.com>"
        }
      ]);
    });
  });

  describe("testing addRecipient()", () => {
    it("a successful response with one recpient", () => {
      const recipients: IComposeRecipient[] = [
        {
          id: 1,
          type: "To",
          value: "Test Display Name <test@emailAddress.com>"
        }
      ];

      const subject: string = "";

      const setRecipients = jest.fn().mockImplementation(() => undefined);
      const setSubject = () => undefined;

      const { container } = render(
        <ComposeRecipientDetails
          recipients={recipients}
          subject={subject}
          setRecipients={setRecipients}
          setSubject={setSubject}
        />
      );

      const checkEmailIcon = container.querySelector('[data-icon="plus"]')!;
      fireEvent.click(checkEmailIcon);

      expect(setRecipients).toHaveBeenCalledWith([
        { id: 1, type: "To", value: "Test Display Name <test@emailAddress.com>" },
        { id: 2, type: "Cc", value: "" }
      ]);
    });

    it("a successful response with two or more recpients", () => {
      const recipients: IComposeRecipient[] = [
        {
          id: 1,
          type: "To",
          value: "Test Display Name <test@emailAddress.com>"
        },
        {
          id: 2,
          type: "Cc",
          value: "Test Cc Name <test@emailAddress.com>"
        }
      ];

      const subject: string = "";

      const setRecipients = jest.fn().mockImplementation(() => undefined);
      const setSubject = () => undefined;

      const { container } = render(
        <ComposeRecipientDetails
          recipients={recipients}
          subject={subject}
          setRecipients={setRecipients}
          setSubject={setSubject}
        />
      );

      const checkEmailIcon = container.querySelector('[data-icon="plus"]')!;
      fireEvent.click(checkEmailIcon);

      expect(setRecipients).toHaveBeenCalledWith([
        { id: 1, type: "To", value: "Test Display Name <test@emailAddress.com>" },
        { id: 2, type: "Cc", value: "Test Cc Name <test@emailAddress.com>" },
        { id: 3, type: "Bcc", value: "" }
      ]);
    });
  });

  describe("testing setSubject()", () => {
    it("a successful response", () => {
      const recipients: IComposeRecipient[] = [
        {
          id: 1,
          type: "To",
          value: "Test Display Name <test@emailAddress.com>"
        },
        {
          id: 2,
          type: "Cc",
          value: "Test Cc Name <test@emailAddress.com>"
        }
      ];

      const subject: string = "";

      const setRecipients = () => undefined;
      const setSubject = jest.fn().mockImplementation(() => undefined);

      const { getByPlaceholderText } = render(
        <ComposeRecipientDetails
          recipients={recipients}
          subject={subject}
          setRecipients={setRecipients}
          setSubject={setSubject}
        />
      );

      fireEvent.change(getByPlaceholderText(/Enter email subject/i), {
        target: { value: "Test email subject" }
      });

      expect(setSubject).toHaveBeenCalledWith("Test email subject");
    });
  });
});
