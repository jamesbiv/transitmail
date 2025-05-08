import React, { FunctionComponent } from "react";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationTriangle,
  faTimes,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { IComposeMessage } from "interfaces";

/**
 * @interface IComposeMessageProps
 */
interface IComposeMessageProps {
  composeMessage?: IComposeMessage;
}

/**
 * ComposeMessage
 * @param {IComposeMessageProps} properties
 * @returns FunctionComponent
 */
export const ComposeMessage: FunctionComponent<IComposeMessageProps> = ({ composeMessage }) => {
  let alertVariant: string;
  let alertIcon: IconDefinition;

  switch (composeMessage?.type) {
    case "error":
      alertVariant = "danger";
      alertIcon = faTimes;
      break;

    case "warning":
      alertVariant = "warning";
      alertIcon = faExclamationTriangle;
      break;

    case "info":
    default:
      alertVariant = "success";
      alertIcon = faCheck;
      break;
  }

  return (
    <Alert className={!composeMessage ? "d-none" : "d-block"} variant={alertVariant}>
      <FontAwesomeIcon icon={alertIcon} />{" "}
      <span dangerouslySetInnerHTML={{ __html: composeMessage?.message ?? "" }} />
    </Alert>
  );
};
