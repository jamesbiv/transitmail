import React, { FunctionComponent, useContext } from "react";
import { DependenciesContext } from "contexts";
import { Folder } from "../folder";

/**
 * Inbox
 * @returns FunctionComponent
 */
export const Inbox: FunctionComponent = () => {
  const { stateManager } = useContext(DependenciesContext);

  stateManager.setFolderId("INBOX");

  return <Folder />;
};
