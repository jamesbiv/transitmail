import React from "react";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface ISettingsValidationProps {
  validation?: { message: string; type: string };
}

export const SettingsValidation: React.FC<ISettingsValidationProps> = ({
  validation,
}) => {
  return (
    <Alert
      className={!validation ? "d-none" : "d-block"}
      variant={
        validation?.type === "info"
          ? "success"
          : validation?.type === "warning"
          ? "warning"
          : "danger"
      }
    >
      <FontAwesomeIcon
        icon={
          validation?.type === "info"
            ? faCheck
            : validation?.type === "warning"
            ? faExclamationTriangle
            : faTimes
        }
      />{" "}
      <span
        dangerouslySetInnerHTML={{
          __html: validation?.message ?? "",
        }}
      />
    </Alert>
  );
};
