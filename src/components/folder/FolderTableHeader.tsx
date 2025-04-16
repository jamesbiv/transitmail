import React, { FunctionComponent } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltUp, faLongArrowAltDown } from "@fortawesome/free-solid-svg-icons";
import { IFolderEmail } from "interfaces";

/**
 * @interface IFolderTableHeaderProps
 */
interface IFolderTableHeaderProps {
  folderEmails: IFolderEmail[];
  toggleSelectionAll: boolean;
  toggleSelection: (uid: number, forceToogle?: boolean) => void;
  updateVisibleEmails: (definedLength?: number) => void;
}

/**
 * FolderTableHeader
 * @param {IFolderTableHeaderProps} properties
 * @returns FunctionComponent
 */
export const FolderTableHeader: FunctionComponent<IFolderTableHeaderProps> = ({
  folderEmails,
  toggleSelectionAll,
  toggleSelection,
  updateVisibleEmails
}) => {
  const sortFolder: (field: string, direction?: string) => void = (field, direction) => {
    const sortDirection =
      direction === "asc"
        ? (first: IFolderEmail, second: IFolderEmail) => (first[field] > second[field] ? 1 : -1)
        : (first: IFolderEmail, second: IFolderEmail) => (first[field] < second[field] ? 1 : -1);

    folderEmails.sort(sortDirection);

    updateVisibleEmails();
  };

  return (
    <Row className="border-bottom p-2 font-weight-bold bg-light g-0">
      <Col xs={0} sm={0} md={1} lg={1} className="d-none d-sm-block me-3 folder-checkbox">
        <Form.Check
          type="checkbox"
          id="formFolderSelectAll"
          label=""
          checked={toggleSelectionAll}
          onChange={(event: React.SyntheticEvent) => {
            event.stopPropagation();

            toggleSelection(-1);
          }}
        />
      </Col>
      <Col xs={4} sm={2} md={2} lg={2} className="ps-3 ps-sm-0 text-nowrap">
        Date{" "}
        <FontAwesomeIcon
          onClick={() => sortFolder("epoch", "asc")}
          size="sm"
          icon={faLongArrowAltUp}
          className="text-secondary pointer"
        />
        <FontAwesomeIcon
          onClick={() => sortFolder("epoch", "desc")}
          size="sm"
          icon={faLongArrowAltDown}
          className="text-secondary pointer"
        />
      </Col>
      <Col xs={5} sm={2} md={2} lg={2} className="ps-3 ps-sm-0 text-nowrap">
        From{" "}
        <FontAwesomeIcon
          onClick={() => sortFolder("from", "asc")}
          size="sm"
          icon={faLongArrowAltUp}
          className="text-secondary pointer"
        />
        <FontAwesomeIcon
          onClick={() => sortFolder("from", "desc")}
          size="sm"
          icon={faLongArrowAltDown}
          className="text-secondary pointer"
        />
      </Col>
      <Col xs={0} sm={4} md={4} lg={5} className="d-none d-sm-block text-nowrap">
        Subject{" "}
        <FontAwesomeIcon
          onClick={() => sortFolder("subject", "asc")}
          size="sm"
          icon={faLongArrowAltUp}
          className="text-secondary pointer"
        />
        <FontAwesomeIcon
          onClick={() => sortFolder("subject", "desc")}
          size="sm"
          icon={faLongArrowAltDown}
          className="text-secondary pointer"
        />
      </Col>
      <Col xs={3} sm={3} md={3} lg={2} className="d-none d-sm-block ms-auto text-end">
        Actions
      </Col>
    </Row>
  );
};
