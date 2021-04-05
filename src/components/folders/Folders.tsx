import React from "react";
import { ImapHelper, ImapSocket, LocalStorage, StateManager } from "classes";
import { IFoldersEntry } from "interfaces";
import { FoldersEntry, FoldersEntryActions, EFolderEntryActionType } from ".";
import { Card, Col, Accordion, Spinner, Button, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faPlus,
  faSync,
} from "@fortawesome/free-solid-svg-icons";

interface IFoldersProps {
  dependencies: {
    imapHelper: ImapHelper;
    imapSocket: ImapSocket;
    localStorage: LocalStorage;
    stateManager: StateManager;
  };
}

interface IFoldersState {
  folders: IFoldersEntry[];
  activeFolderId?: string;
  actionFolderId?: string;
  actionType: EFolderEntryActionType;
  showActionModal: boolean;
}

export class Folders extends React.PureComponent<IFoldersProps, IFoldersState> {
  /**
   * @var {ImapSocket} imapSocket
   */
  protected imapSocket: ImapSocket;

  /**
   * @var {ImapHelper} imapHelper
   */
  protected imapHelper: ImapHelper;

  /**
   * @var {LocalStorage} localStorage
   */
  protected localStorage: LocalStorage;

  /**
   * @var {StateManager} stateManager
   */
  protected stateManager: StateManager;

  constructor(props: IFoldersProps) {
    super(props);

    this.imapSocket = props.dependencies.imapSocket;
    this.imapHelper = props.dependencies.imapHelper;
    this.localStorage = props.dependencies.localStorage;
    this.stateManager = props.dependencies.stateManager;

    this.state = {
      folders: [],
      actionType: EFolderEntryActionType.ADD,
      showActionModal: false,
    };

    this.getFolders = this.getFolders.bind(this);
  }

  componentDidMount() {
    if (this.imapSocket.getReadyState() !== 1) {
      this.imapSocket.imapConnect();
    }

    this.getFolders();
  }

  async getFolders(): Promise<void> {
    const listResponse = await this.imapSocket.imapRequest(`LIST "" "*"`);

    const folders: IFoldersEntry[] = this.imapHelper.formatListFoldersResponse(
      listResponse.data
    );

    this.setState({ folders });
  }

  updateFolders(): void {
    this.setState({ folders: [] });
    this.getFolders();
  }

  updateActiveKeyFolderId = (activeKey: string, folderId: string): void => {
    this.stateManager.setFolderId(folderId);
    this.stateManager.updateActiveKey(activeKey);
  };

  toggleActionModal = (
    actionType: EFolderEntryActionType,
    actionFolderId?: string
  ): void => {
    this.setState({ actionFolderId, actionType, showActionModal: true });
  };

  render() {
    return (
      <React.Fragment>
        <Card className="mt-0 mt-sm-3">
          <Card.Header>
            <Row>
              <Col xs={6}>
                <h4 className="p-0 m-0 text-nowrap">
                  <FontAwesomeIcon icon={faFolderOpen} /> Folders
                  <Button
                    className="ml-2 float-right float-sm-none"
                    onClick={() => this.updateFolders()}
                    size="sm"
                    variant="primary"
                    type="button"
                  >
                    <FontAwesomeIcon
                      icon={faSync}
                      spin={!this.state.folders.length}
                    />
                  </Button>
                </h4>
              </Col>
              <Col
                className="d-none d-sm-block text-right text-sm-right text-nowrap"
                xs={6}
              >
                <Button
                  size="sm"
                  variant="outline-dark"
                  type="button"
                  className="mr-2"
                  onClick={() => {
                    this.toggleActionModal(EFolderEntryActionType.ADD);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} /> Add Folder
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Spinner
            className={`mt-3 mb-3 ml-auto mr-auto ${
              this.state.folders.length ? "d-none" : ""
            }`}
            animation="grow"
            variant="dark"
          />
          <Accordion
            onSelect={(id: string | null) =>
              this.setState({ activeFolderId: id ?? undefined })
            }
            className={!this.state.folders.length ? "d-none" : ""}
          >
            {this.state.folders.map((folderEntry: IFoldersEntry) => (
              <FoldersEntry
                folderEntry={folderEntry}
                key={folderEntry.id}
                activeFolderId={this.state.activeFolderId}
                toggleActionModal={this.toggleActionModal}
                updateActiveKeyFolderId={this.updateActiveKeyFolderId}
              />
            ))}
          </Accordion>
        </Card>
        <FoldersEntryActions
          folderId={this.state.actionFolderId}
          folders={this.state.folders}
          actionType={this.state.actionType}
          showActionModal={this.state.showActionModal}
          imapSocket={this.imapSocket}
          getFolders={this.getFolders}
          onHide={() => this.setState({ showActionModal: false })}
        />
      </React.Fragment>
    );
  }
}
