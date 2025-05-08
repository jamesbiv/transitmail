import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeAttachments } from "components/compose";
import { IComposeAttachment } from "interfaces";

describe("ComposeAttachments Component", () => {
  it("a successful response", () => {
    const attachments: IComposeAttachment[] = [];
    const setAttachments = () => [];

    render(<ComposeAttachments attachments={attachments} setAttachments={setAttachments} />);

    expect(true).toBeTruthy();
  });
});
