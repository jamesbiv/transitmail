import React, { useContext, useEffect, useState } from "react";
import { IFoldersEntry } from "interfaces";
import { FoldersEntry, FoldersEntryActions, EFolderEntryActionType } from ".";
import { Card, Col, Accordion, Spinner, Button, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faPlus,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import { DependenciesContext } from "contexts";

export const Folders: React.FC = () => {
  const { imapHelper, imapSocket, stateManager } = useContext(
    DependenciesContext
  );

  const [folders, setFolders] = useState<IFoldersEntry[] | undefined>(
    undefined
  );

  const [activeFolderId, setActiveFolderId] = useState<string | undefined>(
    undefined
  );

  const [actionFolderId, setActionFolderId] = useState<string | undefined>(
    undefined
  );

  const [actionType, setActionType] = useState<EFolderEntryActionType>(
    EFolderEntryActionType.ADD
  );

  const [showActionModal, setShowActionModal] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (imapSocket.getReadyState() !== 1) {
        imapSocket.imapConnect();
      }

      await updateFolders();
    })();
  }, []);

  const updateFolders = async (): Promise<void> => {
    const listResponse = await imapSocket.imapRequest(`LIST "" "*"`);

    const folders: IFoldersEntry[] = imapHelper.formatListFoldersResponse(
      listResponse.data
    );

    setFolders(folders);
  };

  const updateActiveKeyFolderId = (
    activeKey: string,
    folderId: string
  ): void => {
    stateManager.setFolderId(folderId);
    stateManager.updateActiveKey(activeKey);
  };

  const toggleActionModal = (
    actionType: EFolderEntryActionType,
    actionFolderId?: string
  ): void => {
    setActionFolderId(actionFolderId);
    setActionType(actionType), setShowActionModal(true);
  };

  return (
    <React.Fragment>
      <Card className="mt-0 mt-sm-3 mb-3">
        <Card.Header>
          <Row>
            <Col xs={12} sm={6}>
              <h4 className="p-0 m-0 text-nowrap">
                <FontAwesomeIcon icon={faFolderOpen} /> Folders
                <Button
                  className="ml-2 float-right float-sm-none"
                  onClick={() => updateFolders()}
                  size="sm"
                  variant="primary"
                  type="button"
                >
                  <FontAwesomeIcon icon={faSync} spin={!folders?.length} />
                </Button>
              </h4>
            </Col>
            <Col
              className="text-right text-sm-right text-nowrap mt-3 mt-sm-0"
              xs={12}
              sm={6}
            >
              <Button
                size="sm"
                variant="outline-dark"
                type="button"
                onClick={() => toggleActionModal(EFolderEntryActionType.ADD)}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Folder
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Spinner
          className={`mt-3 mb-3 ml-auto mr-auto ${
            folders?.length ? "d-none" : ""
          }`}
          animation="grow"
          variant="dark"
        />
        <Accordion
          onSelect={(id: string | null) => setActiveFolderId(id ?? undefined)}
          className={!folders?.length ? "d-none" : ""}
        >
          {folders?.map((folderEntry: IFoldersEntry) => (
            <FoldersEntry
              folderEntry={folderEntry}
              key={folderEntry.id}
              activeFolderId={activeFolderId}
              toggleActionModal={toggleActionModal}
              updateActiveKeyFolderId={updateActiveKeyFolderId}
            />
          ))}
        </Accordion>
      </Card>
      <FoldersEntryActions
        folderId={actionFolderId}
        folders={folders}
        actionType={actionType}
        showActionModal={showActionModal}
        imapSocket={imapSocket}
        getFolders={updateFolders}
        onHide={() => setShowActionModal(false)}
      />
    </React.Fragment>
  );
};
