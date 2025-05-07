import React, { ChangeEvent, Dispatch, Fragment, FunctionComponent, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faEdit, faEnvelope, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { ISettingsErrors, ISettingsSecondaryEmail, ISettingsValidationCondition } from "interfaces";
import { SettingsValidationMessage } from "./SettingsValidationMessage";
import {
  processValidationConditions,
  processValidationErrorMessages,
  secondaryEmailValidationConditions
} from "./SettingsValidationConditions";

/**
 * @interface ISettingsSecondaryEmailsProps
 */
interface ISettingsSecondaryEmailsProps {
  secondaryEmails?: ISettingsSecondaryEmail[];
  updateSecondaryEmails: (secondaryEmails?: ISettingsSecondaryEmail[]) => void;
}

/**
 * SettingsSecondaryEmails
 * @param {ISettingsSecondaryEmailsProps} properties
 * @returns FunctionComponent
 */
export const SettingsSecondaryEmails: FunctionComponent<ISettingsSecondaryEmailsProps> = ({
  secondaryEmails,
  updateSecondaryEmails
}) => {
  const [showSecondaryEmailModal, setShowSecondaryEmailModal] = useState<boolean>(false);

  const [secondaryEmail, setSecondaryEmail] = useState<ISettingsSecondaryEmail>({
    name: "",
    email: "",
    signature: ""
  });

  const createNewSecondaryEmail: () => void = () => {
    setShowSecondaryEmailModal(true);

    setSecondaryEmail({
      name: "",
      email: "",
      signature: ""
    });
  };

  const updateSecondaryEmail: () => void = () => {
    secondaryEmails ??= [];

    const secondaryEmailIndex: number = secondaryEmails.findIndex(
      (secondaryEmailElement) => secondaryEmailElement.key === secondaryEmail.key
    );

    if (secondaryEmailIndex > -1) {
      secondaryEmails[secondaryEmailIndex] = secondaryEmail;
      updateSecondaryEmails(secondaryEmails);

      return;
    }

    secondaryEmail.key = uuidv4();
    secondaryEmails.push(secondaryEmail);

    updateSecondaryEmails(secondaryEmails);
  };

  const editSecondaryEmail: (secondaryEmailKey: string) => void = (secondaryEmailKey) => {
    const secondaryEmailIndex: number = secondaryEmails!.findIndex(
      (secondaryEmail) => secondaryEmail.key === secondaryEmailKey
    );

    setSecondaryEmail(secondaryEmails![secondaryEmailIndex]);

    setShowSecondaryEmailModal(true);
  };

  const deleteSecondaryEmail: (secondaryEmailKey: string) => void = (secondaryEmailKey) => {
    const secondaryEmailIndex: number = secondaryEmails!.findIndex(
      (secondaryEmail) => secondaryEmail.key === secondaryEmailKey
    );

    secondaryEmails!.splice(secondaryEmailIndex, 1);

    updateSecondaryEmails(secondaryEmails!.length ? secondaryEmails : undefined);
  };

  return (
    <Fragment>
      <Card className="mt-3 mb-3">
        <CardHeader>
          <Row>
            <Col xs={12} sm={6}>
              <FontAwesomeIcon className="me-2" icon={faEnvelope} /> Secondary email accounts
            </Col>
            <Col className="text-end text-sm-end text-nowrap mt-3 mt-sm-0" xs={12} sm={6}>
              <Button
                size="sm"
                variant="outline-dark"
                type="button"
                onClick={() => createNewSecondaryEmail()}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Seconday Email
              </Button>
            </Col>
          </Row>
        </CardHeader>
        {!secondaryEmails ? (
          <CardBody className="text-center text-secondary">
            No secondary email accounts found
          </CardBody>
        ) : (
          <ListGroup variant="flush">
            {(secondaryEmails as Required<ISettingsSecondaryEmail>[]).map(
              (secondaryEmail: Required<ISettingsSecondaryEmail>) => (
                <ListGroupItem key={secondaryEmail.key}>
                  <Button
                    variant="danger"
                    className="float-end"
                    size="sm"
                    aria-label=""
                    onClick={() => deleteSecondaryEmail(secondaryEmail.key)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button
                    variant="primary"
                    className="float-end me-2"
                    size="sm"
                    aria-label=""
                    onClick={() => editSecondaryEmail(secondaryEmail.key)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  {`${secondaryEmail.name} <${secondaryEmail.email}>`}
                </ListGroupItem>
              )
            )}
          </ListGroup>
        )}
      </Card>
      <SettingsSecondaryEmailsModal
        secondaryEmail={secondaryEmail}
        setSecondaryEmail={setSecondaryEmail}
        updateSecondaryEmail={updateSecondaryEmail}
        showModal={showSecondaryEmailModal}
        hideModal={() => setShowSecondaryEmailModal(false)}
      />
    </Fragment>
  );
};

/**
 * @interface ISettingsSecondaryEmailsModalProps
 */
interface ISettingsSecondaryEmailsModalProps {
  secondaryEmail: ISettingsSecondaryEmail;
  setSecondaryEmail: Dispatch<ISettingsSecondaryEmail>;
  updateSecondaryEmail: () => void;
  showModal: boolean;
  hideModal: () => void;
}

/**
 * SettingsSecondaryEmailsModal
 * @param {ISettingsSecondaryEmailsModalProps} properties
 * @returns FunctionComponent
 */
export const SettingsSecondaryEmailsModal: FunctionComponent<
  ISettingsSecondaryEmailsModalProps
> = ({ secondaryEmail, setSecondaryEmail, updateSecondaryEmail, showModal, hideModal }) => {
  const [errorMessage, setErrorMessage] = useState<Partial<ISettingsSecondaryEmail> | undefined>(
    undefined
  );

  const [validationMessage, setValidationMessage] = useState<
    { message: string; type: string } | undefined
  >(undefined);

  const setSecondaryEmailValue: (settingName: string, settingValue: string) => void = (
    settingName,
    settingValue
  ) => {
    const secondaryEmailCondition = secondaryEmailValidationConditions.find(
      (validationCondition: ISettingsValidationCondition) =>
        validationCondition.field === settingName
    )!;

    const updatedErrorMessage: Partial<ISettingsSecondaryEmail> | undefined =
      secondaryEmailCondition.constraint(settingValue)
        ? { ...errorMessage, [settingName]: undefined }
        : {
            ...errorMessage,
            [settingName]: secondaryEmailCondition.message
          };

    setErrorMessage(updatedErrorMessage);

    const updatedSettingValue: ISettingsSecondaryEmail = {
      ...secondaryEmail,
      [settingName]: settingValue
    };

    setSecondaryEmail(updatedSettingValue);
  };

  const submitSecondaryEmail: () => void = () => {
    const validationErrors: ISettingsErrors = processValidationConditions(
      secondaryEmailValidationConditions,
      secondaryEmail
    );

    if (Object.keys(validationErrors).length) {
      const errorMessages: string = processValidationErrorMessages(validationErrors);

      setValidationMessage({
        message: `Please check the following errors: ${errorMessages}`,
        type: "error"
      });

      return;
    }

    setValidationMessage(undefined);
    updateSecondaryEmail();

    hideModal();
  };

  const closeSecondaryEmailModal: () => void = () => {
    setValidationMessage(undefined);

    hideModal();
  };

  return (
    <Modal show={showModal} centered={true} aria-labelledby="secondary-email-modal">
      <ModalHeader closeButton onClick={() => closeSecondaryEmailModal()}>
        <ModalTitle id="secondary-email-modal">
          <FontAwesomeIcon icon={faEnvelope} />{" "}
          {secondaryEmail.key ? "Edit secondary email" : "Add new secondary email"}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <SettingsValidationMessage validationMessage={validationMessage} />
        <FormGroup controlId="formSecondaryDisplayName" className="mb-3">
          <FormLabel>
            Display name{" "}
            <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
          </FormLabel>
          <FormControl
            type="text"
            placeholder="Enter a secondary display name"
            isInvalid={!!errorMessage?.name}
            defaultValue={secondaryEmail.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSecondaryEmailValue("name", event.target.value)
            }
          />
          <FormText className="text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
          </FormText>
          <FormControl.Feedback type="invalid">{errorMessage?.name}</FormControl.Feedback>
        </FormGroup>
        <FormGroup controlId="formSecondaryEmailAddress" className="mb-3">
          <FormLabel>
            Email address{" "}
            <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
          </FormLabel>
          <FormControl
            type="email"
            placeholder="Enter a secondary email address"
            isInvalid={!!errorMessage?.email}
            defaultValue={secondaryEmail.email}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSecondaryEmailValue("email", event.target.value)
            }
          />
          <FormText className="text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
          </FormText>
          <FormControl.Feedback type="invalid">{errorMessage?.email}</FormControl.Feedback>
        </FormGroup>
        <FormGroup controlId="formSecondaryEmailSignature">
          <FormLabel>Email signature</FormLabel>
          <FormControl
            as="textarea"
            rows={3}
            placeholder="Enter a secondary email signature"
            isInvalid={!!errorMessage?.signature}
            defaultValue={secondaryEmail.signature}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSecondaryEmailValue("signature", event.target.value)
            }
          />
          <FormControl.Feedback type="invalid">{errorMessage?.signature}</FormControl.Feedback>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => submitSecondaryEmail()}>Ok</Button>
        <Button onClick={() => closeSecondaryEmailModal()}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};
