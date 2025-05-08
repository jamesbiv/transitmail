import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeEditorToolbar } from "components/compose";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";

describe("ComposeEditorToolbar Component", () => {
  it("a successful response", () => {
    const initialConfig: InitialConfigType = {
      theme: {},
      namespace: "ComposeEditor",
      onError: (error: Error) => undefined
    };

    const saveEmail = () => undefined;
    const clearComposer = () => undefined;

    render(
      <LexicalComposer initialConfig={initialConfig}>
        <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
      </LexicalComposer>
    );

    expect(true).toBeTruthy();
  });
});
