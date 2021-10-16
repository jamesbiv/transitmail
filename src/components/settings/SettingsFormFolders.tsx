import React, { useState } from "react";
import { faAsterisk, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Card, Col, Form, Row } from "react-bootstrap";
import { ISettingsFolders, ISettingsValidationCondition } from "interfaces";
import { validationConditions } from ".";

interface ISettingsFormFoldersProps {
  folderSettings: ISettingsFolders;
  displayFormFolders: boolean;
  setDisplayFormFolders: React.Dispatch<boolean>;
}

export const SettingsFormFolders: React.FC<ISettingsFormFoldersProps> = ({
  folderSettings,
  displayFormFolders,
  setDisplayFormFolders,
}) => {
  const [errorMessage, setErrorMessage] =
    useState<Partial<ISettingsFolders> | undefined>(undefined);

  const setFolderSetting = (
    folderName: keyof ISettingsFolders,
    folderValue: string
  ) => {
    const settingsCondition = validationConditions.find(
      (validationCondition: ISettingsValidationCondition) =>
        validationCondition.field === "folderSettings" &&
        validationCondition.subField === folderName
    );

    if (!settingsCondition) {
      return;
    }

    const updatedErrorMessage: Partial<ISettingsFolders> | undefined =
      settingsCondition.constraint(folderValue)
        ? { ...errorMessage, [folderName]: undefined }
        : {
            ...errorMessage,
            [folderName]: settingsCondition.message,
          };

    setErrorMessage(updatedErrorMessage);

    folderSettings[folderName] = folderValue;
  };

  return (
    <Accordion activeKey={displayFormFolders ? "0" : undefined}>
      <Card className="mt-3">
        <Card.Header
          className="pointer"
          onClick={() => setDisplayFormFolders(!displayFormFolders)}
        >
          <FontAwesomeIcon
            className="me-2"
            icon={displayFormFolders ? faMinus : faPlus}
          />
          Folder Settings
        </Card.Header>
        <Accordion.Collapse eventKey="0" as={Card.Body}>
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
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
