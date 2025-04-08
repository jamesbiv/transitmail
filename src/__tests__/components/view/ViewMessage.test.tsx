import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ViewMessage } from "components/view";
import { IViewMessage } from "interfaces";

describe("View Component", () => {
  describe("test validation variations and types", () => {
    it("to not be displayed", () => {
      const viewMessage: IViewMessage | undefined = undefined;

      const { container } = render(<ViewMessage viewMessage={viewMessage} />);

      const isHidden = Boolean(
        container.querySelector('[class="fade d-none alert alert-success show"]')
      );

      expect(isHidden).toBeTruthy();
    });

    it("as an error", () => {
      const viewMessage: IViewMessage = {
        type: "error",
        message: "This is an error"
      };

      const { container } = render(<ViewMessage viewMessage={viewMessage} />);

      const isErrorIcon = Boolean(container.querySelector('[data-icon="xmark"]'));
      expect(isErrorIcon).toBeTruthy();

      const validationResponse: HTMLElement = screen.getByRole("alert");
      expect(validationResponse).toHaveTextContent(/This is an error/i);
    });

    it("as a warning", () => {
      const viewMessage: IViewMessage = {
        type: "warning",
        message: "This is a warning"
      };

      const { container } = render(<ViewMessage viewMessage={viewMessage} />);

      const isWarningIcon = Boolean(container.querySelector('[data-icon="triangle-exclamation"]'));
      expect(isWarningIcon).toBeTruthy();

      const validationResponse: HTMLElement = screen.getByRole("alert");
      expect(validationResponse).toHaveTextContent(/This is a warning/i);
    });

    it("as informational (default)", () => {
      const viewMessage: IViewMessage = {
        type: "info",
        message: "This is informational"
      };

      const { container } = render(<ViewMessage viewMessage={viewMessage} />);

      const isInfoIcon = Boolean(container.querySelector('[data-icon="check"]'));
      expect(isInfoIcon).toBeTruthy();

      const validationResponse: HTMLElement = screen.getByRole("alert");
      expect(validationResponse).toHaveTextContent(/This is informational/i);
    });
  });
});
