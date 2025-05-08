import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeEditor } from "components/compose";
import { sleep } from "__tests__/fixtures";

describe("ComposeEditor Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("similate an error triggering LexicalComposer error handler", () => {
    const lexicalComposerSpy: jest.SpyInstance = jest.spyOn(
      require("@lexical/react/LexicalComposer"),
      "LexicalComposer"
    );

    lexicalComposerSpy.mockImplementationOnce(async (props) => {
      const { initialConfig } = props;

      initialConfig.onError(new Error("Test error"));

      await sleep(100);
    });

    const bodyMimeType: string = "text/plain";
    const bodyPlaceholder: string = "Test placeholder";

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

    expect(lexicalComposerSpy).toHaveBeenCalled();
  });

  it("a successful response as text/plain", () => {
    const createTextNodeSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$createTextNode");

    const bodyMimeType: string = "text/plain";
    const bodyPlaceholder: string = "Test placeholder";

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

    expect(createTextNodeSpy).toHaveBeenCalled();
  });

  it("a successful response as text/html", () => {
    const insertNodesSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$insertNodes");

    const bodyMimeType: string = "text/html";
    const bodyPlaceholder: string = "Test placeholder";

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

    expect(insertNodesSpy).toHaveBeenCalled();
  });

  it("a successful response as invalid", () => {
    const createTextNodeSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$createTextNode");
    const insertNodesSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$insertNodes");

    const bodyMimeType: string = "invalid";
    const bodyPlaceholder: string = "Test placeholder";

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

    expect(createTextNodeSpy && insertNodesSpy).not.toHaveBeenCalled();
  });

  it("a successful response if bodyPlaceholder is not set", () => {
    const createTextNodeSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$createTextNode");
    const insertNodesSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$insertNodes");

    const bodyMimeType: string = "invalid";
    const bodyPlaceholder: undefined = undefined;

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

    expect(createTextNodeSpy && insertNodesSpy).not.toHaveBeenCalled();
  });
});
