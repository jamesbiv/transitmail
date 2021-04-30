import React from "react";

interface IFolderPlaceholderProps {
  height?: number;
}

export const FolderPlaceholder: React.FC<IFolderPlaceholderProps> = ({
  height = 0,
}) => {
  return <div style={{ height }}></div>;
};
