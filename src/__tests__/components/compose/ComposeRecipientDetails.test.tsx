import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeRecipientDetails } from "components/compose";
import { IComposeRecipient } from "interfaces";

describe("ComposeRecipientDetails Component", () => {
  it("a successful response", () => {
    const recipients: IComposeRecipient[] = [];
    const subject: string = "";
    const setRecipients = () => [];
    const setSubject = () => undefined;

    render(
      <ComposeRecipientDetails
        recipients={recipients}
        subject={subject}
        setRecipients={setRecipients}
        setSubject={setSubject}
      />
    );

    expect(true).toBeTruthy();
  });
});
