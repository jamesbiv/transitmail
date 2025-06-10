import React, { Fragment, FunctionComponent, ReactNode } from "react";
import {
  Button,
  Row,
  Col,
  AccordionCollapse,
  ListGroup,
  ListGroupItem,
  useAccordionButton
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFolderOpen,
  faFolderPlus,
  faFolderMinus
} from "@fortawesome/free-solid-svg-icons";
import { IFoldersEntry, IFoldersSubEntry } from "interfaces";
import { FoldersEntryOptions, EFolderEntryActionType } from ".";

/**
 * @interface IAccordionListGroupItemProps
 */
interface IAccordionListGroupItemProps {
  children: ReactNode;
  eventKey: string;
}

/**
 * AccordionListGroupItem
 * @param {IAccordionListGroupItemProps} properties
 * @returns {ReactNode}
 */
const AccordionListGroupItem: FunctionComponent<IAccordionListGroupItemProps> = ({
  children,
  eventKey
}) => {
  const accordionOnClick = useAccordionButton(eventKey);

  return (
    <ListGroupItem className="pointer" onClick={accordionOnClick}>
      {children}
    </ListGroupItem>
  );
};

/**
 * @interface IFoldersEntryProps
 */
interface IFoldersEntryProps {
  activeFolderId?: string;
  folderEntry: IFoldersEntry;
  toggleActionModal: (actionType: EFolderEntryActionType, actionFolderId?: string) => void;
  updateActiveKeyFolderId: (activeKey: string, folderId: string) => void;
}

/**
 * FoldersEntry
 * @param {IFoldersEntryProps} properties
 * @returns {ReactNode}
 */
export const FoldersEntry: FunctionComponent<IFoldersEntryProps> = ({
  folderEntry,
  activeFolderId,
  toggleActionModal,
  updateActiveKeyFolderId
}) => {
  return !folderEntry.folders.length ? (
    <ListGroupItem
      onClick={() => updateActiveKeyFolderId("folder", folderEntry.ref)}
      key={folderEntry.id}
      className="pointer"
    >
      <Row>
        <Col xs={6} className="text-truncate">
          <FontAwesomeIcon icon={folderEntry?.icon ?? faFolder} /> {folderEntry.name}
        </Col>
        <Col xs={6} className="text-end text-nowrap pe-1">
          <FoldersEntryOptions folderId={folderEntry.ref} toggleActionModal={toggleActionModal} />
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
    <Fragment>
      <AccordionListGroupItem eventKey={folderEntry.id.toString()}>
        <Row>
          <Col xs={6} className="text-truncate">
            <FontAwesomeIcon
              icon={
                activeFolderId && Number(activeFolderId) === folderEntry.id
                  ? faFolderMinus
                  : faFolderPlus
              }
            />{" "}
            {folderEntry.name}
          </Col>
          <Col xs={6} className="text-end text-nowrap pe-1">
            <FoldersEntryOptions folderId={folderEntry.ref} toggleActionModal={toggleActionModal} />
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
      </AccordionListGroupItem>
      <AccordionCollapse eventKey={folderEntry.id.toString()} as={ListGroupItem} className="p-0">
        <ListGroup variant="flush">
          {folderEntry.folders.map((folderSubEntry: IFoldersSubEntry) => (
            <ListGroupItem
              key={folderSubEntry.id}
              onClick={() =>
                updateActiveKeyFolderId("folder", `${folderEntry.ref}/${folderSubEntry.ref}`)
              }
              className="ps-sm-5 pointer"
            >
              <Row>
                <Col xs={6} className="text-truncate">
                  <FontAwesomeIcon icon={folderSubEntry?.icon ?? faFolder} /> {folderSubEntry.name}
                </Col>
                <Col xs={6} className="text-end text-nowrap pe-1">
                  <FoldersEntryOptions
                    folderId={`${folderEntry.ref}/${folderSubEntry.ref}`}
                    toggleActionModal={toggleActionModal}
                  />
                  <Button
                    onClick={() =>
                      updateActiveKeyFolderId("folder", `${folderEntry.ref}/${folderSubEntry.ref}`)
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
            </ListGroupItem>
          ))}
        </ListGroup>
      </AccordionCollapse>
    </Fragment>
  );
};
