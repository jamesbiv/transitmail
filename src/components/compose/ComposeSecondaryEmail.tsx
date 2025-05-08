import React, { ChangeEvent, FunctionComponent } from "react";
import { Col, Row, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import { IComposeSender, ISettingsSecondaryEmail } from "interfaces";

/**
 * @interface IComposeSecondaryEmailProps
 */
interface IComposeSecondaryEmailProps {
  defaultSender: IComposeSender;
  secondaryEmails?: ISettingsSecondaryEmail[];
  updateSenderDetails: (secondaryEmailKey: number) => void;
}

/**
 * ComposeSecondaryEmail
 * @param {IComposeSecondaryEmailProps} properties
 * @returns FunctionComponent
 */
export const ComposeSecondaryEmail: FunctionComponent<IComposeSecondaryEmailProps> = ({
  defaultSender,
  secondaryEmails,
  updateSenderDetails
}) => {
  return (
    <FormGroup controlId="formComposeSecondaryEmails">
      <Row>
        <Col xs={4} sm={2}>
          <FormLabel>From:</FormLabel>
        </Col>
        <Col xs={8} sm={10}>
          <FormControl
            data-testid="selectComposeSecondaryEmails"
            as="select"
            size="sm"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateSenderDetails(Number(event.target.value))
            }
          >
            <option value={undefined}>
              Default Sender - {defaultSender.displayName} &lt;
              {defaultSender.email}&gt;
            </option>
            {secondaryEmails?.map(
              (secondaryEmail: ISettingsSecondaryEmail, secondaryEmailKey: number) => (
                <option key={secondaryEmail.key} value={secondaryEmailKey}>
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
