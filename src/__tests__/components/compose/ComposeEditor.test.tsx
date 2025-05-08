import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeEditor } from "components/compose";

describe("ComposeEditor Component", () => {
  it("a successful response", () => {
    const bodyMimeType: string = "";
    const bodyPlaceholder: string = "";

    const setBody = () => undefined;
    const saveEmail = () => undefined;
    const clearComposer = () => undefined;

    render(
      <ComposeEditor
        bodyMimeType={bodyMimeType}
        bodyPlaceholder={bodyPlaceholder}
        setBody={setBody}
        saveEmail={saveEmail}
        clearComposer={clearComposer}
      />
    );

    expect(true).toBeTruthy();
  });
});
