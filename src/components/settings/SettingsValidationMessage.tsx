import React, { FunctionComponent } from "react";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationTriangle,
  faTimes,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { ISettingsValidationMessage } from "interfaces";

/**
 * @interface ISettingsValidationProps
 */
interface ISettingsValidationProps {
  validationMessage?: ISettingsValidationMessage;
}

/**
 * SettingsValidationMessage
 * @param {ISettingsValidationProps} properties
 * @returns FunctionComponent
 */
export const SettingsValidationMessage: FunctionComponent<ISettingsValidationProps> = ({
  validationMessage
}) => {
  let alertVariant: string;
  let alertIcon: IconDefinition;

  switch (validationMessage?.type) {
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
    <Alert className={!validationMessage ? "d-none" : "d-block"} variant={alertVariant}>
      <FontAwesomeIcon icon={alertIcon} />{" "}
      <span dangerouslySetInnerHTML={{ __html: validationMessage?.message ?? "" }} />
    </Alert>
  );
};
