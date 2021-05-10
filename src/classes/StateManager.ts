import {
  IComposePresets,
  IFolderEmail,
  IMessageModalState,
  ISliderState,
} from "interfaces";

interface IFolderEmails {
  emails?: IFolderEmail[];
  latestUid?: string;
}

type TIndexState = {
  sliderState: ISliderState;
  setSliderState: React.Dispatch<ISliderState>;
  setActiveKey: React.Dispatch<string>;
  setMessageModalState: React.Dispatch<IMessageModalState>;
};

export class StateManager {
  /**
   * @var {TIndexState} indexState;
   */
  public indexState: TIndexState = {} as TIndexState;

  /**
   * @var {IComposePresets} composePresets;
   */
  protected composePresets?: IComposePresets;

  /**
   * @var {string} activeUid;
   */
  protected activeUid?: number;

  /**
   * @var {string} folderId;
   */
  protected folderId?: string;

  /**
   * @var {{[key:string] IFolderEmails}} folderEmails;
   */
  protected folderEmails: {
    [key: string]: IFolderEmails | undefined;
  } = {};

  /**
   * @name updateActiveKey
   * @param {string} activeKey
   * @returns void
   */
  public updateActiveKey(activeKey: string): void {
    window.location.hash = "#" + activeKey;

    this.indexState.setActiveKey(activeKey);

    const sliderState: ISliderState = this.indexState.sliderState;

    if (sliderState) {
      this.indexState.setSliderState({
        sliderAction: false,
        sliderInitalDisplay: false,
      });
    }
  }

  /**
   * @name setActiveUid
   * @param {string} activeUid
   * @returns void
   */
  public setActiveUid(activeUid: number): void {
    this.activeUid = activeUid;
  }

  /**
   * @name getActiveUid
   * @returns void
   */
  public getActiveUid(): number | undefined {
    return this.activeUid;
  }

  /**
   * @name setFolderId
   * @param {string} folderId
   * @returns void
   */
  public setFolderId(folderId: string): void {
    this.folderId = folderId;
  }

  /**
   * @name getFolderId
   * @returns void
   */
  public getFolderId(): string | undefined {
    return this.folderId;
  }

  /**
   * @name getCurrentFolder
   * @returns IFolderEmails | undefined
   */
  public getCurrentFolder(): IFolderEmails | undefined {
    if (!this.folderId) {
      return undefined;
    }

    const folderEmails: IFolderEmails | undefined = this.folderEmails?.[
      this.folderId
    ];

    return folderEmails
      ? {
          emails: folderEmails.emails,
          latestUid: folderEmails.latestUid,
        }
      : undefined;
  }

  /**
   * @name updateCurrentFolder
   * @param {IFolderEmail[]} folderEmails
   * @returns void
   */
  public updateCurrentFolder(emails?: IFolderEmail[], latestUid?: string) {
    if (this.folderId) {
      this.folderEmails[this.folderId] = { emails, latestUid };
    }
  }

  /**
   * @name showMessageModal
   * @param {IMessageModalState} messageModalState
   * @returns void
   */
  public showMessageModal(messageModalState: IMessageModalState): void {
    this.indexState.setMessageModalState({ ...messageModalState, show: true });
  }

  /**
   * @name setComposePresets
   * @param {IComposePresets} setComposePresets
   * @returns void
   */
  public setComposePresets(composePresets?: IComposePresets): void {
    this.composePresets = composePresets;
  }

  /**
   * @name getComposePresets
   * @returns IComposePresets
   */
  public getComposePresets(): IComposePresets | undefined {
    return this.composePresets;
  }
}
