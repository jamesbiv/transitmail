import React, { FunctionComponent } from "react";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationTriangle,
  faTimes,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { IViewMessage } from "interfaces";

/**
 * @interface ISettingsValidationProps
 */
interface IViewMessageProps {
  viewMessage?: IViewMessage;
}

/**
 * ViewMessage
 * @param {IViewMessageProps} properties
 * @returns {ReactNode}
 */
export const ViewMessage: FunctionComponent<IViewMessageProps> = ({ viewMessage }) => {
  let alertVariant: string;
  let alertIcon: IconDefinition;

  switch (viewMessage?.type) {
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
    <Alert className={!viewMessage ? "d-none" : "d-block"} variant={alertVariant}>
      <FontAwesomeIcon icon={alertIcon} />{" "}
      <span dangerouslySetInnerHTML={{ __html: viewMessage?.message ?? "" }} />
    </Alert>
  );
};
