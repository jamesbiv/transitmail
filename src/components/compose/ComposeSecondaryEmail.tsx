import React from "react";
import { Form, Col, Row, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import { IComposeSender, ISettingsSecondaryEmail } from "interfaces";

interface IComposeSecondaryEmailProps {
  defaultSender: IComposeSender;
  secondaryEmails?: ISettingsSecondaryEmail[];
  updateSenderDetails: (secondaryEmailKey: number) => void;
}

export const ComposeSecondaryEmail: React.FC<IComposeSecondaryEmailProps> = ({
  defaultSender,
  secondaryEmails,
  updateSenderDetails
}) => {
  return (
    <FormGroup controlId="exampleForm.ControlSelect1">
      <Row>
        <Col xs={4} sm={2}>
          <FormLabel>From:</FormLabel>
        </Col>
        <Col xs={8} sm={10}>
          <FormControl
            size="sm"
            as="select"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateSenderDetails(Number(event.target.value) ?? undefined)
            }
          >
            <option value={undefined}>
              Default Sender - {defaultSender.displayName} &lt;
              {defaultSender.email}&gt;
            </option>
            {secondaryEmails?.map(
              (secondaryEmail: ISettingsSecondaryEmail, secondaryEmailKey: number) => (
                <option key={secondaryEmailKey} value={secondaryEmailKey}>
                  {secondaryEmail.name} &lt;{secondaryEmail.email}&gt;
                </option>
              )
            )}
          </FormControl>
        </Col>
      </Row>
    </FormGroup>
  );
};
