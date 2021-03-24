import { IFolderEmail, IMessageModalData } from "interfaces";

interface IComposePresets {
  email: string;
  subject?: string;
  from?: string;
}

interface IFolderEmails {
  emails?: IFolderEmail[];
  latestUid?: string;
}

type TIndexClass = React.Component<
  {},
  {
    activeKey: string;
    sliderAction: boolean;
    messageModalData: IMessageModalData;
    showMessageModal: boolean;
  }
>;

class StateManager {
  /**
   * @var {TIndexClass} indexClass;
   */
  protected indexClass: TIndexClass;

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
   * @constructor
   * @params {TIndexClass} indexClass
   */
  constructor(indexClass: TIndexClass) {
    this.indexClass = indexClass;
  }

  /**
   * updateActiveKey
   * @param {string} activeKey
   * @returns void
   */
  public updateActiveKey(activeKey: string): void {
    window.location.hash = "#" + activeKey;

    /* Update page location */
    this.indexClass.setState({
      activeKey: activeKey,
    });

    if (this.indexClass.state.sliderAction) {
      this.indexClass.setState({
        sliderAction: false,
      });
    }
  }

  /**
   * setActiveUid
   * @param {string} activeUid
   * @returns void
   */
  public setActiveUid(activeUid: number): void {
    this.activeUid = activeUid;
  }

  /**
   * getActiveUid
   * @returns void
   */
  public getActiveUid(): number | undefined {
    return this.activeUid;
  }

  /**
   * setFolderId
   * @param {string} folderId
   * @returns void
   */
  public setFolderId(folderId: string): void {
    this.folderId = folderId;
  }

  /**
   * getFolderId
   * @returns void
   */
  public getFolderId(): string | undefined {
    return this.folderId;
  }

  /**
   * getCurrentFolder
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
   * updateCurrentFolder
   * @param {IFolderEmail[]} folderEmails
   * @returns void
   */
  public updateCurrentFolder(emails?: IFolderEmail[], latestUid?: string) {
    if (this.folderId) {
      this.folderEmails[this.folderId] = { emails, latestUid };
    }
  }

  /**
   * showMessageModal
   * @param {string} messageModalData
   * @returns void
   */
  public showMessageModal(messageModalData: IMessageModalData): void {
    this.indexClass.setState({
      messageModalData: messageModalData,
      showMessageModal: true,
    });
  }

  /**
   * setComposePresets
   * @param {IComposePresets} setComposePresets
   * @returns void
   */
  public setComposePresets(composePresets: IComposePresets): void {
    this.composePresets = composePresets;
  }

  /**
   * getComposePresets
   * @returns IComposePresets
   */
  public getComposePresets(): IComposePresets | undefined {
    return this.composePresets;
  }
}

export default StateManager;
