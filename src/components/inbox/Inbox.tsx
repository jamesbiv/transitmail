import React from "react";

import {
  ImapHelper,
  ImapSocket,
  LocalStorage,
  EmailParser,
  StateManager,
} from "classes";

import { Folder } from "../folder";

interface IInboxProps {
  dependencies: {
    imapHelper: ImapHelper;
    imapSocket: ImapSocket;
    localStorage: LocalStorage;
    emailParser: EmailParser;
    stateManager: StateManager;
  };
}

export const Inbox: React.FC<IInboxProps> = ({ dependencies }) => {
  dependencies.stateManager.setFolderId("INBOX");

  return <Folder dependencies={dependencies} />;
};
