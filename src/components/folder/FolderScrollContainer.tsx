import React from "react";
import { InfiniteScroll } from "classes";
import {
  IFolderEmail,
  IFolderEmailActions,
  IFolderLongPress,
  IFolderPlaceholder,
  IFolderScrollSpinner,
  IInfinateScrollHandler
} from "interfaces";
import { Card, Spinner } from "react-bootstrap";
import { FolderEmailEntry, FolderPlaceholder, FolderTableHeader, FolderTableOptions } from ".";
import { EFolderEmailActionType } from ".";

interface IFolderScrollContainerProps {
  folderEmails?: IFolderEmail[];
  folderEmailActions: IFolderEmailActions;
  setDisplayCardHeader: React.Dispatch<boolean>;
  toggleActionModal: (actionType: EFolderEmailActionType) => void;
}

interface IFolderScrollContainerState {
  visibleEmails?: IFolderEmail[];
  displayTableOptions: boolean;
  displayTableHeader: boolean;
  folderPlaceholder?: IFolderPlaceholder;
  folderScrollSpinner?: IFolderScrollSpinner;
}

export class FolderScrollContainer extends React.PureComponent<
  IFolderScrollContainerProps,
  IFolderScrollContainerState
> {
  /**
   * @var {InfiniteScroll} infiniteScroll
   */
  protected infiniteScroll: InfiniteScroll;

  /**
   * @var {args: IInfinateScrollHandler) => void} scrollHandler
   */
  protected scrollHandler: (args: IInfinateScrollHandler) => void;

  /**
   * @var {boolean} toggleSelectionAll
   */
  protected toggleSelectionAll: boolean;

  /**
   * @var {IFolderLongPress} folderLongPress
   */
  private folderLongPress: IFolderLongPress;

  /**
   * @constructor
   */
  constructor(props: IFolderScrollContainerProps) {
    super(props);

    this.state = {
      displayTableOptions: false,
      displayTableHeader: true
    };

    this.infiniteScroll = new InfiniteScroll();

    this.toggleSelectionAll = false;

    this.folderLongPress = {
      timer: 0,
      isReturned: false,
      handleLongPress: this.handleLongPress,
      handleLongRelease: this.handleLongRelease
    };

    this.scrollHandler = ({
      minIndex,
      maxIndex,
      folderPlaceholder,
      folderScrollSpinner,
      callback
    }) => {
      const displayHeaders: boolean = minIndex === 0;

      this.props.setDisplayCardHeader(displayHeaders);

      this.setState(
        {
          visibleEmails: this.props.folderEmails?.slice(minIndex, maxIndex),
          displayTableHeader: displayHeaders,
          folderPlaceholder,
          folderScrollSpinner
        },
        callback
      );
    };
  }

  public componentDidMount = async () => {
    this.infiniteScroll.initiateHandlers(
      "container-main",
      "topObserver",
      "bottomObserver",
      this.scrollHandler
    );

    if (this.props.folderEmails?.length) {
      this.infiniteScroll.setTotalEntries(this.props.folderEmails.length);

      this.infiniteScroll.startTopObservation();
      this.infiniteScroll.startBottomObservation();
      this.infiniteScroll.startHandleScroll();
    }
  };

  public componentWillUnmount = () => {
    this.infiniteScroll.stopHandleScroll();
    this.infiniteScroll.stopObservertions();
  };

  public componentDidUpdate = async (prevProps: IFolderScrollContainerProps) => {
    if (this.props.folderEmails !== prevProps.folderEmails) {
      this.infiniteScroll.setTotalEntries(this.props.folderEmails?.length ?? 0);

      this.updateVisibleEmails();
    }
  };

  public updateVisibleEmails = (definedLength?: number): void => {
    const currentSlice = this.infiniteScroll.getCurrentSlice();

    if (currentSlice) {
      this.setState({
        visibleEmails: this.props.folderEmails?.slice(currentSlice.minIndex, currentSlice.maxIndex)
      });
    }
  };

  public toggleTableOptionsDisplay = () => {
    this.setState({
      displayTableOptions:
        this.props.folderEmails?.some((folderEmail: IFolderEmail) => folderEmail.selected) ?? false
    });
  };

  public toggleSelection = (emailUid: number, forceToogle?: boolean): void => {
    if (emailUid === -1) {
      this.toggleSelectionAll = forceToogle !== undefined ? forceToogle : !this.toggleSelectionAll;
    }

    this.props.folderEmails?.forEach((folderEmail: IFolderEmail, emailKey: number) => {
      if (!this.props.folderEmails?.[emailKey]) {
        return;
      }

      if (emailUid === -1) {
        this.props.folderEmails[emailKey].selected = this.toggleSelectionAll;
      } else if (folderEmail.uid === emailUid) {
        if (forceToogle !== undefined) {
          this.props.folderEmails[emailKey].selected = forceToogle;
        } else {
          this.props.folderEmails[emailKey].selected = !this.props.folderEmails[emailKey].selected;
        }
      }
    });

    this.updateVisibleEmails();

    this.toggleTableOptionsDisplay();
  };

  public clearAllSelections = (): void =>
    this.props.folderEmails?.forEach((folderEmail: IFolderEmail, emailKey: number) => {
      if (this.props.folderEmails?.[emailKey]) {
        this.props.folderEmails[emailKey].selected = false;
      }
    });

  public handleLongPress: (emailUid: number, delay?: number) => void = (emailUid, delay = 1000) => {
    this.folderLongPress.isReturned = false;

    this.folderLongPress.timer = setTimeout((handler: TimerHandler): void => {
      this.folderLongPress.isReturned = true;

      this.toggleSelection(emailUid);
    }, delay);
  };

  public handleLongRelease: () => void = () => {
    clearTimeout(this.folderLongPress.timer);

    this.folderLongPress.timer = 0;
  };

  render() {
    return (
      <Card.Body className="p-0">
        <FolderTableOptions
          displayTableOptions={this.state.displayTableOptions}
          toggleSelection={this.toggleSelection}
          toggleActionModal={this.props.toggleActionModal}
        />
        {this.state.displayTableHeader && (
          <FolderTableHeader
            folderEmails={this.props.folderEmails ?? []}
            toggleSelectionAll={this.toggleSelectionAll}
            toggleSelection={this.toggleSelection}
            updateVisibleEmails={this.updateVisibleEmails}
          />
        )}
        <FolderPlaceholder height={this.state.folderPlaceholder?.top} />
        {this.state.folderScrollSpinner?.top && (
          <div className="w-100 text-center d-block d-sm-none">
            <Spinner className="mt-3 mb-3" animation="grow" variant="dark" />
          </div>
        )}
        <div id="topObserver"></div>
        {this.state.visibleEmails?.map((visibleEmail: IFolderEmail) => (
          <FolderEmailEntry
            key={visibleEmail.id}
            email={visibleEmail}
            toggleSelection={this.toggleSelection}
            folderEmailActions={this.props.folderEmailActions}
            folderLongPress={this.folderLongPress}
          />
        ))}
        <div id="bottomObserver"></div>
        {this.state.folderScrollSpinner?.bottom && (
          <div className="w-100 text-center d-block d-sm-none">
            <Spinner className="mt-3 mb-3" animation="grow" variant="dark" />
          </div>
        )}
        <FolderPlaceholder height={this.state.folderPlaceholder?.bottom} />
      </Card.Body>
    );
  }
}
