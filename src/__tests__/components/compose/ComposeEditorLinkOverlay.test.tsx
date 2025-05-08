import React, { RefObject } from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeEditorLinkOverlay } from "components/compose";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";

describe("ComposeRecipientDetails Component", () => {
  it("a successful response", () => {
    const initialConfig: InitialConfigType = {
      theme: {},
      namespace: "ComposeEditor",
      onError: (error: Error) => undefined
    };

    const linkUrl: string = "https://www.testUrl.com";
    const showLinkOverlay: boolean = true;

    const overlayTarget = {} as RefObject<undefined>;

    const toggleLinkOverlay = () => true;

    render(
      <LexicalComposer initialConfig={initialConfig}>
        <ComposeEditorLinkOverlay
          linkUrl={linkUrl}
          showLinkOverlay={showLinkOverlay}
          overlayTarget={overlayTarget}
          toggleLinkOverlay={toggleLinkOverlay}
        />
      </LexicalComposer>
    );

    expect(true).toBeTruthy();
  });
});
