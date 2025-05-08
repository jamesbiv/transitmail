import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ComposeMessage } from "components/compose";
import { IComposeMessage } from "interfaces";

describe("ComposeMessage Component", () => {
  describe("test validation variations and types", () => {
    it("to not be displayed", () => {
      const composeMessage: IComposeMessage | undefined = undefined;

      const { container } = render(<ComposeMessage composeMessage={composeMessage} />);

      const isHidden = Boolean(
        container.querySelector('[class="fade d-none alert alert-success show"]')
      );

      expect(isHidden).toBeTruthy();
    });

    it("as an error", () => {
      const composeMessage: IComposeMessage = {
        type: "error",
        message: "This is an error"
      };

      const { container } = render(<ComposeMessage composeMessage={composeMessage} />);

      const isErrorIcon = Boolean(container.querySelector('[data-icon="xmark"]'));
      expect(isErrorIcon).toBeTruthy();

      const validationResponse: HTMLElement = screen.getByRole("alert");
      expect(validationResponse).toHaveTextContent(/This is an error/i);
    });

    it("as a warning", () => {
      const composeMessage: IComposeMessage = {
        type: "warning",
        message: "This is a warning"
      };

      const { container } = render(<ComposeMessage composeMessage={composeMessage} />);

      const isWarningIcon = Boolean(container.querySelector('[data-icon="triangle-exclamation"]'));
      expect(isWarningIcon).toBeTruthy();

      const validationResponse: HTMLElement = screen.getByRole("alert");
      expect(validationResponse).toHaveTextContent(/This is a warning/i);
    });

    it("as informational (default)", () => {
      const composeMessage: IComposeMessage = {
        type: "info",
        message: "This is informational"
      };

      const { container } = render(<ComposeMessage composeMessage={composeMessage} />);

      const isInfoIcon = Boolean(container.querySelector('[data-icon="check"]'));
      expect(isInfoIcon).toBeTruthy();

      const validationResponse: HTMLElement = screen.getByRole("alert");
      expect(validationResponse).toHaveTextContent(/This is informational/i);
    });
  });
});
