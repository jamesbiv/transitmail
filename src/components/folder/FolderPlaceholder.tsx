import React from "react";

interface FolderPlaceholderProps {
  height?: number;
}

export const FolderPlaceholder: React.FC<FolderPlaceholderProps> = ({
  height = 0,
}) => {
  return <div style={{ height }}></div>;
};
