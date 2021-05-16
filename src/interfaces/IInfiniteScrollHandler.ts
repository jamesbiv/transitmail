import { IFolderPlaceholder, IFolderScrollSpinner } from "interfaces";

export interface IInfinateScrollHandler {
  minIndex: number;
  maxIndex: number;
  folderPlaceholder?: IFolderPlaceholder;
  folderScrollSpinner?: IFolderScrollSpinner;
  callback?: () => void;
}
