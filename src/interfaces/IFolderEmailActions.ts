export interface IFolderEmailActions {
  viewEmail: (uid: number) => void;
  replyToEmail: (uid: number) => void;
  forwardEmail: (uid: number) => void;
  deleteEmail: (uid: number) => void;
}
