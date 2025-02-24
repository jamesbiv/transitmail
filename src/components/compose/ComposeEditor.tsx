import React, { useState, RefObject, FunctionComponent } from "react";
import { EditorState, LexicalEditor } from "lexical";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";

interface ComposeEditor {
  composeEditorReference: RefObject<LexicalEditor | undefined>;
}

export const ComposeEditor: FunctionComponent<ComposeEditor> = ({ composeEditorReference }) => {
  const [editorState, setEditorState] = useState<EditorState>();

  const initialConfig: InitialConfigType = {
    namespace: "ComposeEditor",
    onError: (error: Error) => {
      throw error;
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin contentEditable={<ContentEditable />} ErrorBoundary={LexicalErrorBoundary} />
      <OnChangePlugin onChange={setEditorState} />
      <EditorRefPlugin editorRef={composeEditorReference} />
    </LexicalComposer>
  );
};

/*    <HistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <ClearEditorPlugin />
      <TabIndentationPlugin />
      <TablePlugin />
      <AutoFocusPlugin />
      <MarkdownShortcutPlugin />*/
