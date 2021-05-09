import React, { useState } from "react";
import { faAsterisk, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Card, Col, Form, Row } from "react-bootstrap";
import { ISettingsFolders } from "interfaces";

interface ISettingsFormFoldersProps {
  folderSettings: ISettingsFolders;
}

export const SettingsFormFolders: React.FC<ISettingsFormFoldersProps> = ({
  folderSettings,
}) => {
  const [collapasableStatus, toggleCollapasableStatus] = useState<boolean>(
    false
  );
  const [errorMessage, setErrorMessage] = useState<
    Partial<ISettingsFolders> | undefined
  >(undefined);

  const setFolderSetting = (
    folderType: keyof ISettingsFolders,
    folderName: string
  ) => {
    if (!folderName.length) {
      setErrorMessage({ [folderType]: `This must have a valid folder name` });

      return;
    }

    folderSettings[folderType] = folderName;
  };

  return (
    <Accordion>
      <Card className="mt-3">
        <Accordion.Toggle
          as={Card.Header}
          eventKey="0"
          className="pointer"
          onClick={() => toggleCollapasableStatus(!collapasableStatus)}
        >
          <FontAwesomeIcon
            className="mr-2"
            icon={collapasableStatus ? faMinus : faPlus}
          />
          Folder Settings
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Row>
              <Col xs={12} sm={6}>
                <Form.Group controlId="formFolderArchive">
                  <Form.Label>
                    Archive Folder{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    isInvalid={!!errorMessage?.archiveFolder}
                    defaultValue={folderSettings.archiveFolder}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFolderSetting("archiveFolder", event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.archiveFolder}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formFolderTrash">
                  <Form.Label>
                    Trash Folder{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    isInvalid={!!errorMessage?.trashFolder}
                    defaultValue={folderSettings.trashFolder}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFolderSetting("trashFolder", event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.trashFolder}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formFolderDrafts">
                  <Form.Label>
                    Drafts Folder{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    isInvalid={!!errorMessage?.draftsFolder}
                    defaultValue={folderSettings.draftsFolder}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFolderSetting("draftsFolder", event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.draftsFolder}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group controlId="formFolderSentItems">
                  <Form.Label>
                    Sent Items Folder{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    isInvalid={!!errorMessage?.sentItemsFolder}
                    defaultValue={folderSettings.sentItemsFolder}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFolderSetting("sentItemsFolder", event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.sentItemsFolder}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formFolderSpam">
                  <Form.Label>
                    Spam Folder{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    isInvalid={!!errorMessage?.spamFolder}
                    defaultValue={folderSettings.spamFolder}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFolderSetting("spamFolder", event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.spamFolder}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
