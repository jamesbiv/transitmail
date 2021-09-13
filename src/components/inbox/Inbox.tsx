import { DependenciesContext } from "contexts";
import React, { useContext } from "react";
import { Folder } from "../folder";

export const Inbox: React.FC = () => {
  const { stateManager } = useContext(DependenciesContext);

  stateManager.setFolderId("INBOX");

  return <Folder />;
};
