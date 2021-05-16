export interface IFolderLongPress {
  timer: number;
  isReturned: boolean;
  handleLongPress: (emailUid: number, delay?: number) => void;
  handleLongRelease: () => void;
}
