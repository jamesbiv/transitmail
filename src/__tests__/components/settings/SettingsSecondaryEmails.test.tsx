import React from "react";

import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { SettingsSecondaryEmails, SettingsSecondaryEmailsModal } from "components/settings";
import { ISettingsSecondaryEmail } from "interfaces";

describe("SettingsSecondaryEmails Component", () => {
  describe("Test createNewSecondaryEmail() function", () => {
    it("trigger createNewSecondaryEmail()", async () => {
      let secondaryEmails: ISettingsSecondaryEmail[] | undefined = undefined;

      const updateSecondaryEmails: (updatedSecondaryEmails?: ISettingsSecondaryEmail[]) => void = (
        updatedSecondaryEmails
      ) => {
        secondaryEmails = updatedSecondaryEmails;
      };

      const { getByText, getByPlaceholderText } = render(
        <SettingsSecondaryEmails
          secondaryEmails={secondaryEmails}
          updateSecondaryEmails={updateSecondaryEmails}
        />
      );

      fireEvent.click(getByText(/Add Seconday Email/i));

      await waitFor(() => {
        expect(getByText(/Add new secondary email/i)).toBeInTheDocument();
      });

      const formSecondaryDisplayName = getByPlaceholderText("Enter a secondary display name");
      fireEvent.change(formSecondaryDisplayName, { target: { value: "Test Display Name" } });

      const formSecondaryEmailAddress = getByPlaceholderText("Enter a secondary email address");
      fireEvent.change(formSecondaryEmailAddress, { target: { value: "test@emailAddress.com" } });

      const formSecondaryEmailSignature = getByPlaceholderText("Enter a secondary email signature");
      fireEvent.change(formSecondaryEmailSignature, { target: { value: "Test Email Signature" } });

      fireEvent.click(getByText(/Ok/i));

      expect(secondaryEmails).toEqual([
        {
          email: "test@emailAddress.com",
          key: undefined,
          name: "Test Display Name",
          signature: "Test Email Signature"
        }
      ]);
    });
  });

  describe("Test editSecondaryEmail() function", () => {
    it("trigger editSecondaryEmail()", () => {
      const secondaryEmails: ISettingsSecondaryEmail[] | undefined = [
        {
          key: "15605ee6-d6e4-4a5c-8718-6b0c92e94e9b",
          name: "Test Display Name",
          email: "test@emailAddress.com",
          signature: "Test Email Signature"
        }
      ];

      const updateSecondaryEmails: (secondaryEmails?: ISettingsSecondaryEmail[]) => void = (
        secondaryEmails
      ) => undefined;

      const { container, getByText } = render(
        <SettingsSecondaryEmails
          secondaryEmails={secondaryEmails}
          updateSecondaryEmails={updateSecondaryEmails}
        />
      );

      const updateSecondaryEmailIcon = container.querySelector('[data-icon="pen-to-square"]')!;
      fireEvent.click(updateSecondaryEmailIcon);

      expect(getByText(/Edit secondary email/i)).toBeInTheDocument();
    });
  });

  describe("Test deleteSecondaryEmail() function", () => {
    it("with only one element as to return an undefined value for secondaryEmails", () => {
      let secondaryEmails: ISettingsSecondaryEmail[] | undefined = [
        {
          key: "15605ee6-d6e4-4a5c-8718-6b0c92e94e9b",
          name: "Test Display Name",
          email: "test@emailAddress.com",
          signature: "Test Email Signature"
        }
      ];

      const updateSecondaryEmails: (updatedSecondaryEmails?: ISettingsSecondaryEmail[]) => void = (
        updatedSecondaryEmails
      ) => {
        secondaryEmails = updatedSecondaryEmails;
      };

      const { container } = render(
        <SettingsSecondaryEmails
          secondaryEmails={secondaryEmails}
          updateSecondaryEmails={updateSecondaryEmails}
        />
      );

      const deleteSecondaryEmailIcon = container.querySelector('[data-icon="trash"]')!;
      fireEvent.click(deleteSecondaryEmailIcon);

      expect(secondaryEmails).toEqual(undefined);
    });

    it("with more than one element to ensure an array for secondaryEmails", () => {
      let secondaryEmails: ISettingsSecondaryEmail[] | undefined = [
        {
          key: "15605ee6-d6e4-4a5c-8718-6b0c92e94e9b",
          name: "Test Display Name",
          email: "test@emailAddress.com",
          signature: "Test Email Signature"
        },
        {
          key: "15605ee6-d6e4-4a5c-8718-6b0c92e94e9c",
          name: "Test Display Name",
          email: "test@emailAddress.com",
          signature: "Test Email Signature"
        }
      ];

      const updateSecondaryEmails: (updatedSecondaryEmails?: ISettingsSecondaryEmail[]) => void = (
        updatedSecondaryEmails
      ) => {
        secondaryEmails = updatedSecondaryEmails;
      };

      const { container } = render(
        <SettingsSecondaryEmails
          secondaryEmails={secondaryEmails}
          updateSecondaryEmails={updateSecondaryEmails}
        />
      );

      const deleteSecondaryEmailIcon = container.querySelector('[data-icon="trash"]')!;
      fireEvent.click(deleteSecondaryEmailIcon);

      expect(secondaryEmails.length).toBe(1);
    });
  });
});

describe("SettingsSecondaryEmailsModal Component", () => {
  describe("Test submitSecondaryEmail() function", () => {
    it("with validation errors", async () => {
      const secondaryEmail: ISettingsSecondaryEmail = {
        name: "Test Display Name",
        email: "test@emailAddress.com",
        signature: "Test Email Signature"
      };

      const setSecondaryEmail = (updatedSecondaryEmail: ISettingsSecondaryEmail) => {
        Object.assign(secondaryEmail, updatedSecondaryEmail);
      };

      const updateSecondaryEmail = () => {};

      const showSecondaryEmailModal: boolean = true;

      let hideModalTriggered: boolean = false;

      const hideModal = () => {
        hideModalTriggered = true;
      };

      const { getByText, getByPlaceholderText } = render(
        <SettingsSecondaryEmailsModal
          secondaryEmail={secondaryEmail}
          setSecondaryEmail={setSecondaryEmail}
          updateSecondaryEmail={updateSecondaryEmail}
          showModal={showSecondaryEmailModal}
          hideModal={hideModal}
        />
      );

      await waitFor(() => {
        expect(getByText(/Add new secondary email/i)).toBeInTheDocument();
      });

      const formSecondaryDisplayName = getByPlaceholderText("Enter a secondary display name");
      fireEvent.change(formSecondaryDisplayName, { target: { value: "" } });

      const formSecondaryEmailAddress = getByPlaceholderText("Enter a secondary email address");
      fireEvent.change(formSecondaryEmailAddress, { target: { value: "" } });

      const formSecondaryEmailSignature = getByPlaceholderText("Enter a secondary email signature");
      fireEvent.change(formSecondaryEmailSignature, { target: { value: "" } });

      fireEvent.click(getByText(/Ok/i));

      expect(hideModalTriggered).toBeFalsy();
    });

    it("with a successful save", async () => {
      const secondaryEmail: ISettingsSecondaryEmail = {
        name: "",
        email: "",
        signature: ""
      };

      const setSecondaryEmail = (updatedSecondaryEmail: ISettingsSecondaryEmail) => {
        Object.assign(secondaryEmail, updatedSecondaryEmail);
      };

      const updateSecondaryEmail = () => {};

      const showSecondaryEmailModal: boolean = true;

      let hideModalTriggered: boolean = false;

      const hideModal = () => {
        hideModalTriggered = true;
      };

      const { getByText, getByPlaceholderText } = render(
        <SettingsSecondaryEmailsModal
          secondaryEmail={secondaryEmail}
          setSecondaryEmail={setSecondaryEmail}
          updateSecondaryEmail={updateSecondaryEmail}
          showModal={showSecondaryEmailModal}
          hideModal={hideModal}
        />
      );

      const formSecondaryDisplayName = getByPlaceholderText("Enter a secondary display name");
      fireEvent.change(formSecondaryDisplayName, { target: { value: "Test Display Name" } });

      const formSecondaryEmailAddress = getByPlaceholderText("Enter a secondary email address");
      fireEvent.change(formSecondaryEmailAddress, { target: { value: "test@emailAddress.com" } });

      const formSecondaryEmailSignature = getByPlaceholderText("Enter a secondary email signature");
      fireEvent.change(formSecondaryEmailSignature, { target: { value: "Test Email Signature" } });

      fireEvent.click(getByText(/Ok/i));

      expect(hideModalTriggered).toBeTruthy();
    });
  });

  describe("Test closeSecondaryEmailModal() function", () => {
    it("testing modal header close button", () => {
      const secondaryEmail: ISettingsSecondaryEmail = {
        key: "15605ee6-d6e4-4a5c-8718-6b0c92e94e9b",
        name: "",
        email: "",
        signature: ""
      };

      const setSecondaryEmail = () => {};
      const updateSecondaryEmail = () => {};

      const showSecondaryEmailModal: boolean = true;

      let hideModalTriggered: boolean = false;

      const hideModal = () => {
        hideModalTriggered = true;
      };

      const { getByLabelText } = render(
        <SettingsSecondaryEmailsModal
          secondaryEmail={secondaryEmail}
          setSecondaryEmail={setSecondaryEmail}
          updateSecondaryEmail={updateSecondaryEmail}
          showModal={showSecondaryEmailModal}
          hideModal={hideModal}
        />
      );

      fireEvent.click(getByLabelText(/Close/i));

      expect(hideModalTriggered).toBeTruthy();
    });

    it("testing modal footer close button", () => {
      const secondaryEmail: ISettingsSecondaryEmail = {
        key: "15605ee6-d6e4-4a5c-8718-6b0c92e94e9b",
        name: "",
        email: "",
        signature: ""
      };

      const setSecondaryEmail = () => {};
      const updateSecondaryEmail = () => {};

      const showSecondaryEmailModal: boolean = true;

      let hideModalTriggered: boolean = false;

      const hideModal = () => {
        hideModalTriggered = true;
      };

      const { getByText } = render(
        <SettingsSecondaryEmailsModal
          secondaryEmail={secondaryEmail}
          setSecondaryEmail={setSecondaryEmail}
          updateSecondaryEmail={updateSecondaryEmail}
          showModal={showSecondaryEmailModal}
          hideModal={hideModal}
        />
      );

      fireEvent.click(getByText(/Close/i));

      expect(hideModalTriggered).toBeTruthy();
    });
  });
});
