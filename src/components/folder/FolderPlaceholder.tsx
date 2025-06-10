import React, { FunctionComponent } from "react";

/**
 * @interface IFolderPlaceholderProps
 */
interface IFolderPlaceholderProps {
  height?: number;
}

/**
 * FolderPlaceholder
 * @param {IFolderPlaceholderProps} properties
 * @returns {ReactNode}
 */
export const FolderPlaceholder: FunctionComponent<IFolderPlaceholderProps> = ({ height = 0 }) => {
  return <div style={{ height }}></div>;
};
