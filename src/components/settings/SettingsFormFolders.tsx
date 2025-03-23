import React, { ChangeEvent, Dispatch, FunctionComponent, useState } from "react";
import { faAsterisk, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionCollapse,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row
} from "react-bootstrap";
import { ISettingsFolders, ISettingsValidationCondition } from "interfaces";
import { validationConditions } from ".";

/**
 * @interface ISettingsFormFoldersProps
 */
interface ISettingsFormFoldersProps {
  folderSettings: ISettingsFolders;
  displayFormFolders: boolean;
  setDisplayFormFolders: Dispatch<boolean>;
}

/**
 * SettingsFormFolders
 * @param {SettingsFormFolders} properties
 * @returns FunctionComponent
 */
export const SettingsFormFolders: FunctionComponent<ISettingsFormFoldersProps> = ({
  folderSettings,
  displayFormFolders,
  setDisplayFormFolders
}) => {
  const [errorMessage, setErrorMessage] = useState<Partial<ISettingsFolders> | undefined>(
    undefined
  );

  const setFolderSetting = (folderName: keyof ISettingsFolders, folderValue: string): void => {
    const settingsCondition = validationConditions.find(
      (validationCondition: ISettingsValidationCondition) =>
        validationCondition.field === "folderSettings" &&
        validationCondition.subField === folderName
    );

    if (!settingsCondition) {
      return;
    }

    const updatedErrorMessage: Partial<ISettingsFolders> | undefined = settingsCondition.constraint(
      folderValue
    )
      ? { ...errorMessage, [folderName]: undefined }
      : {
          ...errorMessage,
          [folderName]: settingsCondition.message
        };

    setErrorMessage(updatedErrorMessage);

    folderSettings[folderName] = folderValue;
  };

  return (
    <Accordion activeKey={displayFormFolders ? "0" : undefined}>
      <Card className="mt-3">
        <CardHeader className="pointer" onClick={() => setDisplayFormFolders(!displayFormFolders)}>
          <FontAwesomeIcon className="me-2" icon={displayFormFolders ? faMinus : faPlus} />
          Folder Settings
        </CardHeader>
        <AccordionCollapse eventKey="0" as={CardBody}>
          <Row>
            <Col xs={12} sm={6}>
              <FormGroup controlId="formFolderArchive">
                <FormLabel>
                  Archive Folder{" "}
                  <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                </FormLabel>
                <FormControl
                  type="text"
                  placeholder=""
                  isInvalid={!!errorMessage?.archiveFolder}
                  defaultValue={folderSettings.archiveFolder}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setFolderSetting("archiveFolder", event.target.value)
                  }
                />
                <FormControl.Feedback type="invalid">
                  {errorMessage?.archiveFolder}
                </FormControl.Feedback>
              </FormGroup>
              <FormGroup controlId="formFolderTrash">
                <FormLabel>
                  Trash Folder{" "}
                  <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                </FormLabel>
                <FormControl
                  type="text"
                  placeholder=""
                  isInvalid={!!errorMessage?.trashFolder}
                  defaultValue={folderSettings.trashFolder}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setFolderSetting("trashFolder", event.target.value)
                  }
                />
                <FormControl.Feedback type="invalid">
                  {errorMessage?.trashFolder}
                </FormControl.Feedback>
              </FormGroup>
              <FormGroup controlId="formFolderDrafts">
                <FormLabel>
                  Drafts Folder{" "}
                  <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                </FormLabel>
                <FormControl
                  type="text"
                  placeholder=""
                  isInvalid={!!errorMessage?.draftsFolder}
                  defaultValue={folderSettings.draftsFolder}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setFolderSetting("draftsFolder", event.target.value)
                  }
                />
                <FormControl.Feedback type="invalid">
                  {errorMessage?.draftsFolder}
                </FormControl.Feedback>
              </FormGroup>
            </Col>
            <Col xs={12} sm={6}>
              <FormGroup controlId="formFolderSentItems">
                <FormLabel>
                  Sent Items Folder{" "}
                  <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                </FormLabel>
                <FormControl
                  type="text"
                  placeholder=""
                  isInvalid={!!errorMessage?.sentItemsFolder}
                  defaultValue={folderSettings.sentItemsFolder}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setFolderSetting("sentItemsFolder", event.target.value)
                  }
                />
                <FormControl.Feedback type="invalid">
                  {errorMessage?.sentItemsFolder}
                </FormControl.Feedback>
              </FormGroup>
              <FormGroup controlId="formFolderSpam">
                <FormLabel>
                  Spam Folder{" "}
                  <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                </FormLabel>
                <FormControl
                  type="text"
                  placeholder=""
                  isInvalid={!!errorMessage?.spamFolder}
                  defaultValue={folderSettings.spamFolder}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setFolderSetting("spamFolder", event.target.value)
                  }
                />
                <FormControl.Feedback type="invalid">
                  {errorMessage?.spamFolder}
                </FormControl.Feedback>
              </FormGroup>
            </Col>
          </Row>
        </AccordionCollapse>
      </Card>
    </Accordion>
  );
};
