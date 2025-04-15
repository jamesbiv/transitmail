import { Dispatch } from "react";
import {
  IComposePresets,
  IFolderEmail,
  IFolderEmails,
  IMessageModalState,
  ISliderState
} from "interfaces";

/**
 * @type TIndexState
 */
type TIndexState = {
  sliderState: ISliderState;
  setSliderState: Dispatch<ISliderState>;
  setActiveKey: Dispatch<string>;
  setMessageModalState: Dispatch<IMessageModalState>;
};

/**
 * @class StateManager
 */
export class StateManager {
  /**
   * @public {TIndexState} indexState;
   */
  public indexState: TIndexState = {} as TIndexState;

  /**
   * @protected {IComposePresets} composePresets;
   */
  protected composePresets?: IComposePresets;

  /**
   * @protected {string} activeUid;
   */
  protected activeUid?: number;

  /**
   * @protected {string} folderId;
   */
  protected folderId?: string;

  /**
   * @protected {{[key:string] IFolderEmails}} folderEmails;
   */
  protected folderEmails: { [key: string]: IFolderEmails | undefined } = {};

  /**
   * @method updateActiveKey
   * @param {string} activeKey
   * @returns void
   */
  public updateActiveKey(activeKey: string): void {
    window.location.hash = "#" + activeKey;

    const setActiveKey: Dispatch<string> = this.indexState.setActiveKey;

    if (typeof setActiveKey === "function") {
      this.indexState.setActiveKey(activeKey);
    }

    const sliderState: ISliderState = this.indexState.sliderState;

    if (sliderState) {
      this.indexState.setSliderState({
        sliderAction: false,
        sliderInitalDisplay: false
      });
    }
  }

  /**
   * @method setActiveUid
   * @param {string} activeUid
   * @returns void
   */
  public setActiveUid(activeUid: number): void {
    this.activeUid = activeUid;
  }

  /**
   * @method getActiveUid
   * @returns void
   */
  public getActiveUid(): number | undefined {
    return this.activeUid;
  }

  /**
   * @method setFolderId
   * @param {string} folderId
   * @returns void
   */
  public setFolderId(folderId: string): void {
    this.folderId = folderId;
  }

  /**
   * @method getFolderId
   * @returns void
   */
  public getFolderId(): string | undefined {
    return this.folderId;
  }

  /**
   * @method getCurrentFolder
   * @returns IFolderEmails | undefined
   */
  public getCurrentFolder(): IFolderEmails | undefined {
    if (!this.folderId) {
      return undefined;
    }

    const folderEmails: IFolderEmails | undefined = this.folderEmails?.[this.folderId];

    return folderEmails
      ? {
          emails: folderEmails.emails,
          latestUid: folderEmails.latestUid
        }
      : undefined;
  }

  /**
   * @method updateCurrentFolder
   * @param {IFolderEmail[]} folderEmails
   * @returns void
   */
  public updateCurrentFolder(emails?: IFolderEmail[], latestUid?: string): void {
    if (this.folderId) {
      this.folderEmails[this.folderId] = { emails, latestUid };
    }
  }

  /**
   * @method showMessageModal
   * @param {IMessageModalState} messageModalState
   * @returns void
   */
  public showMessageModal(messageModalState: IMessageModalState): void {
    this.indexState.setMessageModalState({ ...messageModalState, show: true });
  }

  /**
   * @method setComposePresets
   * @param {IComposePresets} setComposePresets
   * @returns void
   */
  public setComposePresets(composePresets?: IComposePresets): void {
    this.composePresets = composePresets;
  }

  /**
   * @method getComposePresets
   * @returns IComposePresets
   */
  public getComposePresets(): IComposePresets | undefined {
    return this.composePresets;
  }
}
