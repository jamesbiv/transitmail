import React from "react";
import { Accordion, ListGroup, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faPlus,
  faMinus,
  faFolderPlus,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { IFoldersEntry, IFoldersSubEntry } from "interfaces";
import { FoldersEntryOptions, EFolderEntryActionType } from ".";

interface IFoldersEntryProps {
  activeFolderId?: string;
  folderEntry: IFoldersEntry;
  toggleActionModal: (
    actionType: EFolderEntryActionType,
    actionFolderId?: string
  ) => void;
  updateActiveKeyFolderId: (activeKey: string, folderId: string) => void;
}

export const FoldersEntry: React.FC<IFoldersEntryProps> = ({
  folderEntry,
  activeFolderId,
  toggleActionModal,
  updateActiveKeyFolderId,
}) => {
  return !folderEntry.folders.length ? (
    <ListGroup.Item
      onClick={() => {
        updateActiveKeyFolderId("folder", folderEntry.ref);
      }}
      key={folderEntry.id}
      className="pointer"
    >
      <Row>
        <Col xs={6} className="text-truncate">
          <FontAwesomeIcon
            icon={folderEntry.icon ? folderEntry.icon : faFolder}
          />{" "}
          {folderEntry.name}
        </Col>
        <Col xs={6} className="text-right text-nowrap pr-1">
          <FoldersEntryOptions
            folderId={folderEntry.ref}
            toggleActionModal={toggleActionModal}
          />
          <Button
            onClick={() => {
              updateActiveKeyFolderId("folder", folderEntry.ref);
            }}
            size="sm"
            variant="primary"
            type="button"
            className="ml-2"
          >
            <FontAwesomeIcon icon={faFolderOpen} />{" "}
            <span className="d-none d-sm-inline-block">Open</span>
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  ) : (
    <React.Fragment key={folderEntry.id}>
      <Accordion.Toggle
        as={ListGroup.Item}
        eventKey={folderEntry.id.toString()}
        className="pointer"
      >
        <Row>
          <Col xs={6} className="text-truncate">
            <FontAwesomeIcon
              className="mr-2"
              icon={
                activeFolderId && Number(activeFolderId) === folderEntry.id
                  ? faMinus
                  : faPlus
              }
            />
            <FontAwesomeIcon icon={faFolderPlus} /> {folderEntry.name}
          </Col>
          <Col xs={6} className="text-right text-nowrap pr-1">
            <FoldersEntryOptions
              folderId={folderEntry.ref}
              toggleActionModal={toggleActionModal}
            />
            <Button
              onClick={() => {
                updateActiveKeyFolderId("folder", folderEntry.ref);
              }}
              size="sm"
              variant="primary"
              type="button"
              className="ml-2"
            >
              <FontAwesomeIcon icon={faFolderOpen} />{" "}
              <span className="d-none d-sm-inline-block">Open</span>
            </Button>
          </Col>
        </Row>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={folderEntry.id.toString()}>
        <ListGroup variant="flush">
          {folderEntry.folders.map((folderSubEntry: IFoldersSubEntry) => (
            <ListGroup.Item
              key={folderSubEntry.id}
              onClick={() => {
                updateActiveKeyFolderId(
                  "folder",
                  `${folderEntry.ref}/${folderSubEntry.ref}`
                );
              }}
              className="pl-sm-5 pointer"
            >
              <Row>
                <Col xs={6} className="text-truncate">
                  <FontAwesomeIcon
                    icon={folderSubEntry.icon ? folderSubEntry.icon : faFolder}
                  />{" "}
                  {folderSubEntry.name}
                </Col>
                <Col xs={6} className="text-right text-nowrap pr-1">
                  <FoldersEntryOptions
                    folderId={folderEntry.ref}
                    toggleActionModal={toggleActionModal}
                  />
                  <Button
                    onClick={() => {
                      updateActiveKeyFolderId(
                        "folder",
                        `${folderEntry.ref}/${folderSubEntry.ref}`
                      );
                    }}
                    size="sm"
                    variant="primary"
                    type="button"
                    className="ml-2"
                  >
                    <FontAwesomeIcon icon={faFolderOpen} />{" "}
                    <span className="d-none d-sm-inline-block">Open</span>
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Accordion.Collapse>
    </React.Fragment>
  );
};
