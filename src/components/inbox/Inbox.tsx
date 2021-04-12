import React from "react";

import {
  ImapHelper,
  ImapSocket,
  LocalStorage,
  EmailParser,
  StateManager,
  MimeTools,
} from "classes";

import { Folder } from "../folder";

interface IInboxProps {
  dependencies: {
    imapHelper: ImapHelper;
    imapSocket: ImapSocket;
    localStorage: LocalStorage;
    emailParser: EmailParser;
    stateManager: StateManager;
    mimeTools: MimeTools;
  };
}

export const Inbox: React.FC<IInboxProps> = ({ dependencies }) => {
  dependencies.stateManager.setFolderId("INBOX");

  return <Folder dependencies={dependencies} />;
};
