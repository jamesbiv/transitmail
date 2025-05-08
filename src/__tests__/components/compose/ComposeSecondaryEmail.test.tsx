import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeSecondaryEmail } from "components/compose";
import { IComposeSender, ISettingsSecondaryEmail } from "interfaces";

describe("ComposeSecondaryEmail Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("a successful response", () => {
    const defaultSender: IComposeSender = {
      email: "test@emailAddress.com",
      displayName: "Test display name"
    };

    const secondaryEmails: ISettingsSecondaryEmail[] = [
      {
        key: "uuid-v4-randomKey",
        name: "Secondary email display name",
        email: "test@emailAddress.com",
        signature: "testTignature"
      }
    ];

    const updateSenderDetails = (secondaryEmailKey: number) => undefined;

    const { queryByText } = render(
      <ComposeSecondaryEmail
        defaultSender={defaultSender}
        secondaryEmails={secondaryEmails}
        updateSenderDetails={updateSenderDetails}
      />
    );

    expect(queryByText(/Secondary email display name/i)).toBeInTheDocument();
  });

  it("triggering updateSenderDetails()", async () => {
    const defaultSender: IComposeSender = {
      email: "test@emailAddress.com",
      displayName: "Test display name"
    };

    const secondaryEmails: ISettingsSecondaryEmail[] = [
      {
        key: "uuid-v4-randomKey",
        name: "Secondary email display name",
        email: "test@emailAddress.com",
        signature: "testTignature"
      }
    ];

    const updateSenderDetails = jest
      .fn()
      .mockImplementation((secondaryEmailKey: number) => undefined);

    const { queryByTestId } = render(
      <ComposeSecondaryEmail
        defaultSender={defaultSender}
        secondaryEmails={secondaryEmails}
        updateSenderDetails={updateSenderDetails}
      />
    );

    const selectComposeSecondaryEmails = queryByTestId("selectComposeSecondaryEmails")!;
    fireEvent.change(selectComposeSecondaryEmails, { target: { value: 0 } });

    expect(updateSenderDetails).toHaveBeenCalledWith(0);
  });
});
