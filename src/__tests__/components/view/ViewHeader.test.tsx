import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EViewActionType, ViewHeader } from "components/view";
import { IEmail } from "interfaces";

describe("ViewHeader Component", () => {
  it("testing replyToEmail()", () => {
    const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

    const toggleActionModal = jest
      .fn()
      .mockImplementation((actionType: EViewActionType) => undefined);

    const replyToEmail = jest.fn().mockImplementation((all?: boolean) => undefined);

    const forwardEmail = jest.fn().mockImplementation(() => undefined);

    const { getAllByText } = render(
      <ViewHeader
        email={email}
        toggleActionModal={toggleActionModal}
        replyToEmail={replyToEmail}
        forwardEmail={forwardEmail}
      />
    );

    const HTMLElements: HTMLElement[] = getAllByText(/Reply/i);

    HTMLElements.forEach((HTMLElement) => {
      fireEvent.click(HTMLElement);
    });

    expect(replyToEmail).toHaveBeenCalled();
  });
});
