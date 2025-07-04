import React, { ChangeEvent, FunctionComponent } from "react";
import { Button, CardHeader, Col, FormControl, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faSync } from "@fortawesome/free-solid-svg-icons";

/**
 * @interface FolderCardHeaderProps
 */
interface FolderCardHeaderProps {
  folderName: string;
  folderSpinner: boolean;
  checkEmail: () => Promise<void>;
  searchEmails: (searchQuery: string) => void;
}

/**
 * FolderCardHeader
 * @returns {ReactNode}
 */
export const FolderCardHeader: FunctionComponent<FolderCardHeaderProps> = ({
  folderName,
  folderSpinner,
  checkEmail,
  searchEmails
}) => {
  return (
    <CardHeader>
      <Row className="pt-2 pt-sm-0">
        <Col xs={12} sm={6} md={7} lg={9}>
          <h4 className="p-0 m-0 text-nowrap text-truncate">
            <FontAwesomeIcon icon={faInbox} /> {folderName}
            <Button
              className="ms-2 float-end float-sm-none"
              onClick={() => checkEmail()}
              size="sm"
              variant="primary"
              type="button"
            >
              <FontAwesomeIcon icon={faSync} spin={folderSpinner} />
            </Button>
          </h4>
        </Col>
        <Col xs={12} sm={6} md={5} lg={3} className="mt-3 mt-sm-0">
          <FormControl
            id="formSearchFolders"
            type="text"
            placeholder="Search &hellip;"
            onChange={(event: ChangeEvent<HTMLInputElement>) => searchEmails(event.target.value)}
          />
        </Col>
      </Row>
    </CardHeader>
  );
};
