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
import { $generateNodesFromDOM, $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { ComposeEditorToolbar } from "./ComposeEditorToolbar";

/**
 * @constant {EditorThemeClasses} ComposerTheme
 */
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
  },
  indent: "editor-indent"
};

/**
 * @interface IComposeEditorProps
 */
interface IComposeEditorProps {
  bodyMimeType?: string;
  bodyPlaceholder?: string;
  setBody: Dispatch<string | undefined>;
  saveEmail: () => void;
  clearComposer: () => void;
}

/**
 * ComposeEditor
 * @param {IComposeEditorProps} properties
 * @returns FunctionComponent
 */
export const ComposeEditor: FunctionComponent<IComposeEditorProps> = ({
  bodyMimeType,
  bodyPlaceholder,
  setBody,
  saveEmail,
  clearComposer
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
      <ComposeEditorUpdatePlugin
        bodyMimeType={bodyMimeType}
        bodyPlaceholder={bodyPlaceholder}
        setBody={setBody}
      />

      <div id="compose-editor" className="mt-2 mb-2">
        <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
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

/**
 * @interface IComposeEditorUpdatePluginProps
 */
interface IComposeEditorUpdatePluginProps {
  bodyMimeType?: string;
  bodyPlaceholder?: string;
  setBody: Dispatch<string | undefined>;
}

/**
 * ComposeEditorUpdatePlugin
 * @param {IComposeEditorUpdatePluginProps} properties
 * @returns FunctionComponent
 */
const ComposeEditorUpdatePlugin: FunctionComponent<IComposeEditorUpdatePluginProps> = ({
  bodyMimeType,
  bodyPlaceholder,
  setBody
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeUpdateListener: () => void = editor.registerUpdateListener(() => {
      editor.read(() => {
        switch (bodyMimeType) {
          case "text/html": {
            const htmlString: string = $generateHtmlFromNodes(editor);

            setBody(htmlString);

            break;
          }

          case "text/plain": {
            const textString: string = $getRoot().getTextContent();

            setBody(textString);

            break;
          }

          default: {
            // nothing
          }
        }
      });
    });

    return () => removeUpdateListener();
  }, [editor]);

  useEffect(() => {
    editor.update(() => {
      if (!bodyPlaceholder) {
        return;
      }

      switch (bodyMimeType) {
        case "text/html": {
          const parser = new DOMParser();
          const htmlString: string = bodyPlaceholder;

          const dom: Document = parser.parseFromString(htmlString, "text/html");
          const nodes: LexicalNode[] = $generateNodesFromDOM(editor, dom);

          $getRoot().clear();

          $insertNodes(nodes);

          break;
        }

        case "text/plain": {
          const bodyText: string = bodyPlaceholder;

          const textNode: TextNode = $createTextNode(bodyText);
          const paragraphNode: ParagraphNode = $createParagraphNode().append(textNode);

          $getRoot().clear().append(paragraphNode);

          break;
        }

        default:
        // nothing
      }
    });
  }, [bodyPlaceholder]);

  return undefined;
};
