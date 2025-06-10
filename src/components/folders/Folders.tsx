import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { IFoldersEntry } from "interfaces";
import { FoldersEntry, FoldersEntryActions, EFolderEntryActionType } from ".";
import { Card, Col, Accordion, Spinner, Button, Row, ListGroup, CardHeader } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faPlus, faSync } from "@fortawesome/free-solid-svg-icons";
import { DependenciesContext } from "contexts";
import { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";

/**
 * Folders
 * @returns {ReactNode}
 */
export const Folders: FunctionComponent = () => {
  const { imapHelper, imapSocket, stateManager } = useContext(DependenciesContext);

  const [folders, setFolders] = useState<IFoldersEntry[] | undefined>(undefined);

  const [activeFolderId, setActiveFolderId] = useState<string | undefined>(undefined);

  const [actionFolderId, setActionFolderId] = useState<string | undefined>(undefined);

  const [actionType, setActionType] = useState<EFolderEntryActionType>(EFolderEntryActionType.ADD);

  const [showActionModal, setShowActionModal] = useState<boolean>(false);

  let initalizeFolderRun: boolean = false;

  useEffect(() => {
    if (!initalizeFolderRun) {
      initalizeFolderRun = true;

      try {
        imapSocket.imapCheckOrConnect();
      } catch (error: unknown) {
        throw new Error(`Websockets: ${(error as Error).message}`);
      }

      updateFolders();
    }
  }, []);

  const updateFolders = async (): Promise<void> => {
    const listResponse = await imapSocket.imapRequest(`LIST "" "*"`);

    const folders: IFoldersEntry[] = imapHelper.formatListFoldersResponse(listResponse.data);

    setFolders(folders);
  };

  const updateActiveKeyFolderId = (activeKey: string, folderId: string): void => {
    stateManager.setFolderId(folderId);
    stateManager.updateActiveKey(activeKey);
  };

  const toggleActionModal = (actionType: EFolderEntryActionType, actionFolderId?: string): void => {
    setActionFolderId(actionFolderId);
    setActionType(actionType);
    setShowActionModal(true);
  };

  return (
    <Fragment>
      <Card className="mt-0 mt-sm-3 mb-3">
        <CardHeader>
          <Row className="pt-2 pt-sm-0">
            <Col xs={12} sm={6}>
              <h4 className="p-0 m-0 text-nowrap">
                <FontAwesomeIcon icon={faFolderOpen} /> Folders
                <Button
                  className="ms-2 float-end float-sm-none"
                  onClick={() => updateFolders()}
                  size="sm"
                  variant="primary"
                  type="button"
                >
                  <FontAwesomeIcon icon={faSync} spin={!folders?.length} />
                </Button>
              </h4>
            </Col>
            <Col className="text-end text-sm-end text-nowrap mt-3 mt-sm-0" xs={12} sm={6}>
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
        </CardHeader>
        <Spinner
          className={`mt-3 mb-3 ms-auto me-auto ${folders?.length ? "d-none" : ""}`}
          animation="grow"
          variant="dark"
        />
        <Accordion
          onSelect={(id: AccordionEventKey) => setActiveFolderId(id as string)}
          className={!folders?.length ? "d-none" : ""}
        >
          <ListGroup variant="flush">
            {folders?.map((folderEntry: IFoldersEntry) => (
              <FoldersEntry
                folderEntry={folderEntry}
                key={folderEntry.id}
                activeFolderId={activeFolderId}
                toggleActionModal={toggleActionModal}
                updateActiveKeyFolderId={updateActiveKeyFolderId}
              />
            ))}
          </ListGroup>
        </Accordion>
      </Card>
      <FoldersEntryActions
        folderId={actionFolderId}
        folders={folders}
        actionType={actionType}
        showActionModal={showActionModal}
        imapSocket={imapSocket}
        getFolders={updateFolders}
        hideActionModal={() => setShowActionModal(false)}
      />
    </Fragment>
  );
};
