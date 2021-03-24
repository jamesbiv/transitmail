import React from "react";

import { ImapSocket, LocalStorage, EmailParser, StateManager } from "classes";

import { Folder } from "../folder";

interface IInboxProps {
  dependencies: {
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
