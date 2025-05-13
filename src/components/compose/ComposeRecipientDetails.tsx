import React, { ChangeEvent, Dispatch, Fragment, FunctionComponent } from "react";
import {
  Button,
  Row,
  Col,
  InputGroup,
  DropdownButton,
  Dropdown,
  FormGroup,
  FormLabel,
  FormControl
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { IComposeRecipient } from "interfaces";

/**
 * @interface IComposeRecipientDetailsProps
 */
interface IComposeRecipientDetailsProps {
  recipients: IComposeRecipient[];
  subject?: string;
  setRecipients: Dispatch<IComposeRecipient[]>;
  setSubject: Dispatch<string | undefined>;
}

/**
 * ComposeRecipientDetails
 * @param {IComposeRecipientDetailsProps} properties
 * @returns FunctionComponent
 */
export const ComposeRecipientDetails: FunctionComponent<IComposeRecipientDetailsProps> = ({
  recipients,
  subject,
  setRecipients,
  setSubject
}) => {
  const updateRecipientType = (type: string, recipientKey: number): void => {
    const updatedRecipients: IComposeRecipient[] = [...recipients];

    updatedRecipients[recipientKey].type = type;

    setRecipients(updatedRecipients);
  };

  const updateRecipientValue = (value: string, recipientKey: number): void => {
    const updatedRecipients: IComposeRecipient[] = [...recipients];

    updatedRecipients[recipientKey].value = value;

    setRecipients(updatedRecipients);
  };

  const addRecipient = (): void => {
    const updatedRecipients: IComposeRecipient[] = [...recipients];
    const updatedRecipientsLength: number = updatedRecipients.length;

    const lastRecipientId: number = updatedRecipients[updatedRecipientsLength - 1].id;

    updatedRecipients.push({
      id: lastRecipientId + 1,
      type: updatedRecipientsLength >= 2 ? "Bcc" : "Cc",
      value: ""
    });

    setRecipients(updatedRecipients);
  };

  const deleteRecipient = (deleteRecipientKey: number): void => {
    const updatedRecipients: IComposeRecipient[] = recipients.filter(
      (recipient: IComposeRecipient, recipientKey: number) => recipientKey !== deleteRecipientKey
    );

    if (updatedRecipients.length === 1) {
      updatedRecipients[0].type = "To";
    }

    setRecipients(updatedRecipients);
  };

  return (
    <Fragment>
      {recipients.map((recipient: IComposeRecipient, recipientKey: number) => (
        <FormGroup as={Row} key={recipient.id} controlId="formComposeTo" className="mt-1 mb-0">
          <FormLabel column xs={4} sm={2} className="pt-0">
            <DropdownButton
              size="sm"
              variant="outline-dark"
              id={recipient.id.toString()}
              title={recipient.type}
            >
              {["To", "Cc", "Bcc"].map((recipientType: string) => (
                <Dropdown.Item
                  key={recipientType}
                  onClick={() => updateRecipientType(recipientType, recipientKey)}
                >
                  {recipientType}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </FormLabel>
          <Col xs={8} sm={10}>
            <InputGroup>
              <FormControl
                size="sm"
                type="text"
                placeholder="Enter email address"
                defaultValue={recipient.value}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateRecipientValue(event.target.value, recipientKey)
                }
              />
              {recipients.length > 1 && (
                <Button
                  size="sm"
                  value={recipients[0].value}
                  variant="outline-danger"
                  className="border"
                  type="button"
                  onClick={() => deleteRecipient(recipientKey)}
                >
                  <FontAwesomeIcon icon={faTrash} />{" "}
                </Button>
              )}
              {((recipientKey === 0 && recipients.length === 1) ||
                recipientKey === recipients.length - 1) && (
                <Button
                  size="sm"
                  className="border"
                  variant="light"
                  type="button"
                  onClick={() => addRecipient()}
                >
                  <FontAwesomeIcon icon={faPlus} />{" "}
                  <span className="d-none d-sm-inline-block">Add</span>
                </Button>
              )}
            </InputGroup>
          </Col>
        </FormGroup>
      ))}
      <FormGroup as={Row} controlId="formComposeSubject">
        <FormLabel xs={4} sm={2} column className="pt-1 pb-0 text-nowrap">
          Subject
        </FormLabel>
        <Col xs={8} sm={10}>
          <FormControl
            size="sm"
            name="subject"
            type="text"
            defaultValue={subject}
            placeholder="Enter email subject"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSubject(event.target.value)}
          />
        </Col>
      </FormGroup>
    </Fragment>
  );
};
