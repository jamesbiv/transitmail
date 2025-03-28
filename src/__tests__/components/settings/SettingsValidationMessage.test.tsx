import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { SettingsValidationMessage } from "components/settings";
import { ISettingsValidationMessage } from "interfaces";

describe("SettingsValidation Component", () => {
  describe("test validation variations and types", () => {
    it("as an error", () => {
      const validationMessage: ISettingsValidationMessage = {
        type: "error",
        message: "This is an error"
      };

      const { container } = render(
        <SettingsValidationMessage validationMessage={validationMessage} />
      );

      const isErrorIcon = Boolean(container.querySelector('[data-icon="xmark"]'));
      expect(isErrorIcon).toBeTruthy();

      const validationResponse: HTMLElement = screen.getByRole("alert");
      expect(validationResponse).toHaveTextContent(/This is an error/i);
    });

    it("as a warning", () => {
      const validationMessage: ISettingsValidationMessage = {
        type: "warning",
        message: "This is a warning"
      };

      const { container } = render(
        <SettingsValidationMessage validationMessage={validationMessage} />
      );

      const isWarningIcon = Boolean(container.querySelector('[data-icon="triangle-exclamation"]'));
      expect(isWarningIcon).toBeTruthy();

      const validationResponse: HTMLElement = screen.getByRole("alert");
      expect(validationResponse).toHaveTextContent(/This is a warning/i);
    });

    it("as informational (default)", () => {
      const validationMessage: ISettingsValidationMessage = {
        type: "info",
        message: "This is informational"
      };

      const { container } = render(
        <SettingsValidationMessage validationMessage={validationMessage} />
      );

      const isInfoIcon = Boolean(container.querySelector('[data-icon="check"]'));
      expect(isInfoIcon).toBeTruthy();

      const validationResponse: HTMLElement = screen.getByRole("alert");
      expect(validationResponse).toHaveTextContent(/This is informational/i);
    });
  });
});
