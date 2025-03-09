import React, { FunctionComponent, Dispatch, useEffect } from "react";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $insertNodes,
  EditorThemeClasses,
  LexicalNode,
  ParagraphNode,
  TextNode
} from "lexical";

import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

import { ComposeEditorToolbar } from "./ComposeEditorToolbar";
import { $generateNodesFromDOM, $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const ComposerTheme: EditorThemeClasses = {
  link: "editor-link",
  text: {
    bold: "text-bold",
    italic: "text-italic",
    underline: "text-underline"
  },
  list: {
    ol: "ordered-list",
    ul: "unordered-list"
  }
};

interface IComposeEditorProps {
  bodyMimeType: string | undefined;
  body: string | undefined;
  setBody: Dispatch<string | undefined>;
}

export const ComposeEditor: FunctionComponent<IComposeEditorProps> = ({
  bodyMimeType,
  body,
  setBody
}) => {
  const initialConfig: InitialConfigType = {
    theme: ComposerTheme,
    namespace: "ComposeEditor",
    onError: (error: Error) => {
      throw error;
    },
    nodes: [ListNode, ListItemNode, LinkNode]
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ComposeUpdatePlugin bodyMimeType={bodyMimeType} body={body} setBody={setBody} />

      <div id="compose-editor" className="mt-2 mb-2">
        <ComposeEditorToolbar />
        <div className="mt-3 p-3 border rounded inner-shaddow">
          <RichTextPlugin
            contentEditable={<ContentEditable className="content-editable" />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ClearEditorPlugin />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};

interface IComposeUpdatePluginProps {
  bodyMimeType: string | undefined;
  body: string | undefined;
  setBody: Dispatch<string | undefined>;
}

const ComposeUpdatePlugin: FunctionComponent<IComposeUpdatePluginProps> = ({
  bodyMimeType,
  body,
  setBody
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerUpdateListener(() => {
      editor.read(() => {
        switch (bodyMimeType) {
          case "text/html": {
            const htmlString = $generateHtmlFromNodes(editor);

            setBody(htmlString);

            break;
          }

          case "text/plain": {
            break;
          }

          default: {
            // nothing
          }
        }
      });
    });

    editor.update(() => {
      if (!body) {
        return;
      }

      switch (bodyMimeType) {
        case "text/html": {
          const parser = new DOMParser();
          const htmlString: string = body;

          const dom: Document = parser.parseFromString(htmlString, "text/html");
          const nodes: LexicalNode[] = $generateNodesFromDOM(editor, dom);

          $getRoot().clear();

          $insertNodes(nodes);

          break;
        }

        case "text/plain": {
          const bodyText: string = body;

          const textNode: TextNode = $createTextNode(bodyText);
          const paragraphNode: ParagraphNode = $createParagraphNode().append(textNode);

          $getRoot().clear().append(paragraphNode);

          break;
        }

        default:
        // nothing
      }
    });
  }, [body]);

  return undefined;
};
