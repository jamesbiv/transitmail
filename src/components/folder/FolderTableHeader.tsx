import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltUp,
  faLongArrowAltDown,
} from "@fortawesome/free-solid-svg-icons";
import { IFolderEmail } from "interfaces";

interface IFolderTableHeaderProps {
  emails: IFolderEmail[];
  toggleSelection: (uid: number, forceToogle?: boolean) => void;
  updateVisibleEmails: (definedLength?: number) => void;
}

export const FolderTableHeader: React.FC<IFolderTableHeaderProps> = ({
  emails,
  toggleSelection,
  updateVisibleEmails,
}) => {
  const sortFolder: (field: string, direction?: string) => void = (
    field,
    direction = "asc"
  ) => {
    if (direction === "asc") {
      emails.sort((a: IFolderEmail, b: IFolderEmail) =>
        a[field] > b[field] ? 1 : -1
      );
    } else {
      emails.sort((a: IFolderEmail, b: IFolderEmail) =>
        a[field] < b[field] ? 1 : -1
      );
    }

    updateVisibleEmails();
  };

  return (
    <Row className="border-bottom pt-1 pb-1 font-weight-bold bg-light">
      <Col
        xs={0}
        sm={0}
        md={1}
        lg={1}
        className="d-none d-sm-block mr-3 folder-checkbox"
      >
        <Form.Check
          type="checkbox"
          id=""
          label=""
          onChange={(event: React.SyntheticEvent) => {
            event.stopPropagation();

            toggleSelection(-1);
          }}
        />
      </Col>
      <Col xs={4} sm={2} md={2} lg={2} className="pl-3 pl-sm-0 text-nowrap">
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
      <Col xs={5} sm={2} md={2} lg={2} className="pl-3 pl-sm-0 text-nowrap">
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
      <Col
        xs={0}
        sm={4}
        md={4}
        lg={5}
        className="d-none d-sm-block text-nowrap"
      >
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
      <Col
        className="d-none d-sm-block ml-auto text-right"
        xs={3}
        sm={3}
        md={3}
        lg={2}
      >
        Actions
      </Col>
    </Row>
  );
};
