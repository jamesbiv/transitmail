import React, { RefObject, FunctionComponent } from "react";
import { EditorThemeClasses, LexicalEditor } from "lexical";

import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

import { ComposeEditorToolbar } from "./ComposeEditorToolbar";

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
  composeEditorReference: RefObject<LexicalEditor | undefined>;
}

export const ComposeEditor: FunctionComponent<IComposeEditorProps> = ({
  composeEditorReference
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
      <EditorRefPlugin editorRef={composeEditorReference} />
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
