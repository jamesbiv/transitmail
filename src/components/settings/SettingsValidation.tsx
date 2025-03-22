import React, { FunctionComponent } from "react";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationTriangle,
  faTimes,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";

/**
 * @interface ISettingsValidationProps
 */
interface ISettingsValidationProps {
  validation?: { message: string; type: string };
}

/**
 * SettingsValidation
 * @param {ISettingsValidationProps} properties
 * @returns FunctionComponent
 */
export const SettingsValidation: FunctionComponent<ISettingsValidationProps> = ({ validation }) => {
  let alertVariant: string;
  let alertIcon: IconDefinition;

  switch (validation?.type) {
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
    <Alert className={!validation ? "d-none" : "d-block"} variant={alertVariant}>
      <FontAwesomeIcon icon={alertIcon} />{" "}
      <span dangerouslySetInnerHTML={{ __html: validation?.message ?? "" }} />
    </Alert>
  );
};
