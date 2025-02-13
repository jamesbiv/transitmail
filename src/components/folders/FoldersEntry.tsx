import React from "react";
import {
  Accordion,
  ListGroup,
  Button,
  Row,
  Col,
  useAccordionButton,
  AccordionCollapse,
  ListGroupItem,
} from "react-bootstrap";
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
  toggleAccordionActiveKey: (eventKey: string) => void;
}

export const FoldersEntry: React.FC<IFoldersEntryProps> = ({
  folderEntry,
  activeFolderId,
  toggleActionModal,
  updateActiveKeyFolderId,
  toggleAccordionActiveKey,
}) => {
  return !folderEntry.folders.length ? (
    <ListGroupItem
      onClick={() => updateActiveKeyFolderId("folder", folderEntry.ref)}
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
        <Col xs={6} className="text-end text-nowrap pe-1">
          <FoldersEntryOptions
            folderId={folderEntry.ref}
            toggleActionModal={toggleActionModal}
          />
          <Button
            onClick={() => updateActiveKeyFolderId("folder", folderEntry.ref)}
            size="sm"
            variant="primary"
            type="button"
            className="ms-2"
          >
            <FontAwesomeIcon icon={faFolderOpen} />{" "}
            <span className="d-none d-sm-inline-block">Open</span>
          </Button>
        </Col>
      </Row>
    </ListGroupItem>
  ) : (
    <React.Fragment>
      <ListGroup.Item
        onClick={() => toggleAccordionActiveKey(folderEntry.id.toString())}
        className="pointer"
      >
        <Row>
          <Col xs={6} className="text-truncate">
            <FontAwesomeIcon
              className="me-2"
              icon={
                activeFolderId && Number(activeFolderId) === folderEntry.id
                  ? faMinus
                  : faPlus
              }
            />
            <FontAwesomeIcon icon={faFolderPlus} /> {folderEntry.name}
          </Col>
          <Col xs={6} className="text-end text-nowrap pe-1">
            <FoldersEntryOptions
              folderId={folderEntry.ref}
              toggleActionModal={toggleActionModal}
            />
            <Button
              onClick={() => updateActiveKeyFolderId("folder", folderEntry.ref)}
              size="sm"
              variant="primary"
              type="button"
              className="ms-2"
            >
              <FontAwesomeIcon icon={faFolderOpen} />{" "}
              <span className="d-none d-sm-inline-block">Open</span>
            </Button>
          </Col>
        </Row>
      </ListGroup.Item>
      <AccordionCollapse
        eventKey={folderEntry.id.toString()}
        as={ListGroup.Item}
        className="p-0"
      >
        <ListGroup variant="flush">
          {folderEntry.folders.map((folderSubEntry: IFoldersSubEntry) => (
            <ListGroup.Item
              key={folderSubEntry.id}
              onClick={() =>
                updateActiveKeyFolderId(
                  "folder",
                  `${folderEntry.ref}/${folderSubEntry.ref}`
                )
              }
              className="ps-sm-5 pointer"
            >
              <Row>
                <Col xs={6} className="text-truncate">
                  <FontAwesomeIcon
                    icon={folderSubEntry.icon ? folderSubEntry.icon : faFolder}
                  />{" "}
                  {folderSubEntry.name}
                </Col>
                <Col xs={6} className="text-end text-nowrap pe-1">
                  <FoldersEntryOptions
                    folderId={`${folderEntry.ref}/${folderSubEntry.ref}`}
                    toggleActionModal={toggleActionModal}
                  />
                  <Button
                    onClick={() =>
                      updateActiveKeyFolderId(
                        "folder",
                        `${folderEntry.ref}/${folderSubEntry.ref}`
                      )
                    }
                    size="sm"
                    variant="primary"
                    type="button"
                    className="ms-2"
                  >
                    <FontAwesomeIcon icon={faFolderOpen} />{" "}
                    <span className="d-none d-sm-inline-block">Open</span>
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </AccordionCollapse>
    </React.Fragment>
  );
};
