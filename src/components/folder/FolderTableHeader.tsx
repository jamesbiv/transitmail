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
  toggleSelection: (uid: number) => void;
  updateEmails: (emails: IFolderEmail[]) => void;
}

export const FolderTableHeader: React.FC<IFolderTableHeaderProps> = ({
  emails,
  toggleSelection,
  updateEmails,
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

    updateEmails(emails);
  };

  return (
    <Row className="border-bottom pt-1 pb-1 font-weight-bold bg-light">
      <Col className="d-none d-sm-block folder-checkbox">
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
      <Col>
        <Container fluid className="pl-0 pr-0">
          <Row>
            <Col xs={4} sm={2} md={2} lg={2} className="text-nowrap">
              Date{" "}
              <FontAwesomeIcon
                onClick={() => {
                  sortFolder("epoch", "asc");
                }}
                size="sm"
                icon={faLongArrowAltUp}
                className="text-secondary pointer"
              />
              <FontAwesomeIcon
                onClick={() => {
                  sortFolder("epoch", "desc");
                }}
                size="sm"
                icon={faLongArrowAltDown}
                className="text-secondary pointer"
              />
            </Col>
            <Col xs={6} sm={2} md={2} lg={2} className="text-nowrap">
              From{" "}
              <FontAwesomeIcon
                onClick={() => {
                  sortFolder("from", "asc");
                }}
                size="sm"
                icon={faLongArrowAltUp}
                className="text-secondary pointer"
              />
              <FontAwesomeIcon
                onClick={() => {
                  sortFolder("from", "desc");
                }}
                size="sm"
                icon={faLongArrowAltDown}
                className="text-secondary pointer"
              />
            </Col>
            <Col
              className="d-none d-sm-block text-nowrap"
              xs={1}
              sm={5}
              md={4}
              lg={5}
            >
              Subject{" "}
              <FontAwesomeIcon
                onClick={() => {
                  sortFolder("subject", "asc");
                }}
                size="sm"
                icon={faLongArrowAltUp}
                className="text-secondary pointer"
              />
              <FontAwesomeIcon
                onClick={() => {
                  sortFolder("subject", "desc");
                }}
                size="sm"
                icon={faLongArrowAltDown}
                className="text-secondary pointer"
              />
            </Col>
            <Col
              className="d-none d-sm-block text-right"
              xs={2}
              sm={3}
              md={4}
              lg={3}
            >
              Actions
            </Col>
          </Row>
        </Container>
      </Col>
    </Row>
  );
};
