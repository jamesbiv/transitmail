import React, { ChangeEvent } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { IComposeRecipient } from "interfaces";

interface IComposeRecipientDetailsProps {
  recipients: IComposeRecipient[];
  subject?: string;
  updateRecipients: (recipients: IComposeRecipient[]) => void;
  updateSubject: (subject: string) => void;
}

export const ComposeRecipientDetails: React.FC<IComposeRecipientDetailsProps> = ({
  updateRecipients,
  updateSubject,
  recipients,
  subject,
}) => {
  return (
    <div>
      {recipients.map((recipient: IComposeRecipient, key: number) => (
        <Form.Group as={Row} key={key} controlId="formComposeTo">
          <Form.Label column xs={4} sm={2} className="pt-0">
            <DropdownButton
              size="sm"
              variant="outline-dark"
              id={recipient.id.toString()}
              title={recipient.type}
            >
              {["To", "Cc", "Bcc"].map((item: string) => (
                <Dropdown.Item
                  key={item}
                  onClick={() => {
                    recipients[key].type = item;

                    updateRecipients(recipients);
                  }}
                >
                  {item}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Form.Label>
          <Col xs={8} sm={10}>
            <InputGroup>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter email address"
                defaultValue={recipient.value}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  recipients[key].value = event.target.value;

                  updateRecipients(recipients);
                }}
              />
              <InputGroup.Append>
                {recipients.length > 1 && (
                  <Button
                    size="sm"
                    value={recipients[0].value}
                    variant="outline-danger"
                    className="border"
                    type="button"
                    onClick={() => {
                      // maybe change to splice
                      recipients = recipients.filter(
                        (
                          recipientEntry: IComposeRecipient,
                          recipientKey: number
                        ) => recipientKey !== key
                      );

                      if (recipients.length === 1) {
                        recipients[0].type = "To";
                      }

                      updateRecipients(recipients);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />{" "}
                  </Button>
                )}
                {((key === 0 && recipients.length === 1) ||
                  key === recipients.length - 1) && (
                  <Button
                    size="sm"
                    className="border"
                    variant="light"
                    type="button"
                    onClick={() => {
                      recipients.push({
                        id: recipient.id + 1,
                        type: key >= 1 ? "Bcc" : "Cc",
                        //value: recipient.value,
                      });
                      
                      updateRecipients(recipients);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />{" "}
                    <span className="d-none d-sm-inline-block">Add</span>
                  </Button>
                )}
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Form.Group>
      ))}
      <Form.Group as={Row} controlId="formComposeSubject">
        <Form.Label xs={4} sm={2} column className="pt-1 text-nowrap">
          Subject
        </Form.Label>
        <Col xs={8} sm={10}>
          <Form.Control
            size="sm"
            name="subject"
            type="text"
            defaultValue={subject}
            placeholder="Enter email subject"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateSubject(event.target.value)
            }
          />
        </Col>
      </Form.Group>
    </div>
  );
};
