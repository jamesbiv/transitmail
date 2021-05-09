import React from "react";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface ISettingsValidationProps {
  message?: string;
  messageType?: string;
}

export const SettingsValidation: React.FC<ISettingsValidationProps> = ({
  message,
  messageType,
}) => {
  return (
    <Alert
      className={!message?.length ? "d-none" : "d-block"}
      variant={
        messageType === "info"
          ? "success"
          : messageType === "warning"
          ? "warning"
          : "danger"
      }
    >
      <FontAwesomeIcon
        icon={
          messageType === "info"
            ? faCheck
            : messageType === "warning"
            ? faExclamationTriangle
            : faTimes
        }
      />{" "}
      <span
        dangerouslySetInnerHTML={{
          __html: message ?? "",
        }}
      />
    </Alert>
  );
};
