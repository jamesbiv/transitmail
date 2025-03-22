import React, { ChangeEvent, Fragment, FunctionComponent, useState } from "react";
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
import { ISettingsErrors, ISettingsSecondaryEmail } from "interfaces";
import { SettingsValidation } from "./SettingsValidation";

/**
 * @interface ISettingsSecondaryEmailsProps
 */
interface ISettingsSecondaryEmailsProps {
  secondaryEmails: ISettingsSecondaryEmail[] | undefined;
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
  const [showModal, setShowModal] = useState<boolean>(false);

  const [secondaryEmail, setSecondaryEmail] = useState<ISettingsSecondaryEmail>({
    name: "",
    email: "",
    signature: ""
  });

  const [secondaryEmailKey, setSecondaryEmailKey] = useState<number | undefined>(undefined);

  const createNewSecondaryEmail: () => void = () => {
    setSecondaryEmail({
      name: "",
      email: "",
      signature: ""
    });

    setSecondaryEmailKey(undefined);

    setShowModal(true);
  };

  const editSecondaryEmail: (emailKey: number) => void = (emailKey) => {
    if (!secondaryEmails?.[emailKey]) {
      return;
    }

    setSecondaryEmail(secondaryEmails?.[emailKey]);
    setSecondaryEmailKey(emailKey);

    setShowModal(true);
  };

  const updateSecondaryEmail: () => void = () => {
    if (!secondaryEmails) {
      secondaryEmails = [];
    }

    if (secondaryEmails?.[secondaryEmailKey ?? NaN]) {
      secondaryEmails[secondaryEmailKey!] = secondaryEmail;
    } else {
      secondaryEmails.push(secondaryEmail);
    }

    updateSecondaryEmails(secondaryEmails);
  };

  const updateSecondaryEmailSetting: (name: string, data: string) => void = (name, data) => {
    setSecondaryEmail({ ...secondaryEmail, [name]: data });
  };

  const deleteSecondaryEmail: (emailKey: number) => void = (emailKey) => {
    if (secondaryEmails) {
      secondaryEmails.splice(emailKey, 1);
    }

    updateSecondaryEmails(secondaryEmails?.length ? secondaryEmails : undefined);

    setSecondaryEmailKey(emailKey);
  };

  return (
    <Fragment>
      <Card className="mt-3 mb-3">
        <CardHeader>
          <Row>
            <Col xs={12} sm={6}>
              <FontAwesomeIcon className="me-2" icon={faEnvelope} />
              Secondary email accounts
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
        {!secondaryEmails?.length ? (
          <CardBody className="text-center text-secondary">
            No secondary email accounts found
          </CardBody>
        ) : (
          <ListGroup variant="flush">
            {secondaryEmails?.map((emailData: ISettingsSecondaryEmail, emailKey: number) => (
              <ListGroupItem key={emailKey}>
                <Button
                  variant="danger"
                  className="float-end"
                  size="sm"
                  aria-label=""
                  onClick={() => deleteSecondaryEmail(emailKey)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Button
                  variant="primary"
                  className="float-end me-2"
                  size="sm"
                  aria-label=""
                  onClick={() => editSecondaryEmail(emailKey)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                {`${emailData.name} <${emailData.email}>`}
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </Card>
      <SettingsSecondaryEmailsModal
        secondaryEmail={secondaryEmail}
        secondaryEmailKey={secondaryEmailKey}
        updateSecondaryEmail={updateSecondaryEmail}
        updateSecondaryEmailSetting={updateSecondaryEmailSetting}
        showModal={showModal}
        onHide={() => setShowModal(false)}
      />
    </Fragment>
  );
};

/**
 * @interface ISettingsSecondaryEmailsModalProps
 */
interface ISettingsSecondaryEmailsModalProps {
  secondaryEmail: ISettingsSecondaryEmail;
  secondaryEmailKey: number | undefined;
  updateSecondaryEmail: () => void;
  updateSecondaryEmailSetting: (name: string, data: string) => void;
  showModal: boolean;
  onHide: () => void;
}

/**
 * SettingsSecondaryEmailsModal
 * @param {ISettingsSecondaryEmailsModalProps} properties
 * @returns FunctionComponent
 */
export const SettingsSecondaryEmailsModal: FunctionComponent<
  ISettingsSecondaryEmailsModalProps
> = ({
  secondaryEmail,
  secondaryEmailKey,
  updateSecondaryEmail,
  updateSecondaryEmailSetting,
  showModal,
  onHide
}) => {
  const [validation, setValidation] = useState<{ message: string; type: string } | undefined>(
    undefined
  );

  const submitSecondaryEmail = async () => {
    const emailRegex: RegExp =
      /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const errors: ISettingsErrors = {};

    if (secondaryEmail.name === "") {
      errors.name = "Please specify a valid display name";
    }
    if (!emailRegex.test(secondaryEmail.email) || secondaryEmail.email === "") {
      errors.email = "Please specify a valid email address";
    }
    if (secondaryEmail.signature?.length > 1000) {
      errors.signature = "Signature must have a maximum of 1000 characters";
    }

    if (Object.keys(errors).length) {
      const errorMessages = `<ul> ${Object.keys(errors).reduce(
        (errorResponse: string, key: string): string => {
          errorResponse += "<li>" + errors[key] + "</li>";

          return errorResponse;
        },
        ""
      )}</ul>`;

      setValidation({
        message: `Please check the following errors: ${errorMessages}`,
        type: "error"
      });

      return;
    }

    setValidation(undefined);
    updateSecondaryEmail();

    onHide();
  };

  return (
    <Modal show={showModal} centered={true} aria-labelledby="contained-modal-title-vcenter">
      <ModalHeader closeButton onClick={() => onHide()}>
        <ModalTitle id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={faEnvelope} />{" "}
          {secondaryEmailKey ? "Edit secondary email" : "Add new secondary email"}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <SettingsValidation validation={validation} />
        <FormGroup controlId="formSecondaryEmailDisplayName">
          <FormLabel>
            Display name{" "}
            <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
          </FormLabel>
          <FormControl
            type="text"
            placeholder="Enter a secondary display name"
            defaultValue={secondaryEmail.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateSecondaryEmailSetting("name", event.target.value)
            }
          />
          <FormText className="text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
          </FormText>
          <FormControl.Feedback type="invalid"> </FormControl.Feedback>
        </FormGroup>
        <FormGroup controlId="formSecondaryEmailEmailAddress">
          <FormLabel>
            Email address{" "}
            <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
          </FormLabel>
          <FormControl
            type="email"
            placeholder="Enter a secondary email address"
            defaultValue={secondaryEmail.email}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateSecondaryEmailSetting("email", event.target.value)
            }
          />
          <FormText className="text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
          </FormText>
          <FormControl.Feedback type="invalid">{""}</FormControl.Feedback>
        </FormGroup>
        <FormGroup controlId="formSecondaryEmailEmailSignature">
          <FormLabel>Email signature</FormLabel>
          <FormControl
            as="textarea"
            rows={3}
            placeholder="Enter a secondary email signature"
            defaultValue={secondaryEmail.signature}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateSecondaryEmailSetting("signature", event.target.value)
            }
          />
          <FormControl.Feedback type="invalid">{""}</FormControl.Feedback>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => submitSecondaryEmail()}>Ok</Button>
        <Button onClick={() => onHide()}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};
