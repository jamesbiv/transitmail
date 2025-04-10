import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EViewActionType, ViewHeader } from "components/view";
import { IEmail } from "interfaces";

describe("ViewHeader Component", () => {
  describe("testing optional renderings", () => {
    it("with a Reply-to address", () => {
      const email: IEmail = {
        contentRaw: "",
        emailRaw: "",
        headersRaw: "",
        replyTo: "test@emailAddress.com"
      };

      const toggleActionModal = jest
        .fn()
        .mockImplementation((actionType: EViewActionType) => undefined);

      const replyToEmail = jest.fn().mockImplementation((all?: boolean) => undefined);

      const forwardEmail = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <ViewHeader
          email={email}
          toggleActionModal={toggleActionModal}
          replyToEmail={replyToEmail}
          forwardEmail={forwardEmail}
        />
      );

      expect(getByText(/Reply to: test@emailAddress.com/i)).toBeTruthy();
    });

    it("with a CC address", () => {
      const email: IEmail = {
        contentRaw: "",
        emailRaw: "",
        headersRaw: "",
        cc: "test@emailAddress.com"
      };

      const toggleActionModal = jest
        .fn()
        .mockImplementation((actionType: EViewActionType) => undefined);

      const replyToEmail = jest.fn().mockImplementation((all?: boolean) => undefined);

      const forwardEmail = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <ViewHeader
          email={email}
          toggleActionModal={toggleActionModal}
          replyToEmail={replyToEmail}
          forwardEmail={forwardEmail}
        />
      );

      expect(getByText(/Cc: test@emailAddress.com/i)).toBeTruthy();
    });
  });

  describe("testing replyToEmail()", () => {
    it("with all as false", () => {
      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const toggleActionModal = jest
        .fn()
        .mockImplementation((actionType: EViewActionType) => undefined);

      const replyToEmail = jest.fn().mockImplementation((all?: boolean) => undefined);

      const forwardEmail = jest.fn().mockImplementation(() => undefined);

      const { container } = render(
        <ViewHeader
          email={email}
          toggleActionModal={toggleActionModal}
          replyToEmail={replyToEmail}
          forwardEmail={forwardEmail}
        />
      );

      const replyIcons = container.querySelectorAll('[data-icon="reply"]');

      replyIcons.forEach((replyIcon: Element) => {
        fireEvent.click(replyIcon);
      });

      expect(replyToEmail).toHaveBeenCalled();
    });

    it("with all as true", () => {
      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const toggleActionModal = jest
        .fn()
        .mockImplementation((actionType: EViewActionType) => undefined);

      const replyToEmail = jest.fn().mockImplementation((all?: boolean) => undefined);

      const forwardEmail = jest.fn().mockImplementation(() => undefined);

      const { container } = render(
        <ViewHeader
          email={email}
          toggleActionModal={toggleActionModal}
          replyToEmail={replyToEmail}
          forwardEmail={forwardEmail}
        />
      );

      const replyIcons = container.querySelectorAll('[data-icon="reply-all"]');

      replyIcons.forEach((replyIcon: Element) => {
        fireEvent.click(replyIcon);
      });

      expect(replyToEmail).toHaveBeenCalled();
    });
  });

  describe("testing forwardEmail()", () => {
    it("a successful response", () => {
      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const toggleActionModal = jest
        .fn()
        .mockImplementation((actionType: EViewActionType) => undefined);

      const replyToEmail = jest.fn().mockImplementation((all?: boolean) => undefined);

      const forwardEmail = jest.fn().mockImplementation(() => undefined);

      const { container } = render(
        <ViewHeader
          email={email}
          toggleActionModal={toggleActionModal}
          replyToEmail={replyToEmail}
          forwardEmail={forwardEmail}
        />
      );

      const shareIcons = container.querySelectorAll('[data-icon="share"]');

      shareIcons.forEach((shareIcon: Element) => {
        fireEvent.click(shareIcon);
      });

      expect(forwardEmail).toHaveBeenCalled();
    });
  });

  describe("testing toggleActionModal()", () => {
    it("being called with EViewActionType.MOVEs", () => {
      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const toggleActionModal = jest
        .fn()
        .mockImplementation((actionType: EViewActionType) => undefined);

      const replyToEmail = jest.fn().mockImplementation((all?: boolean) => undefined);

      const forwardEmail = jest.fn().mockImplementation(() => undefined);

      const { container } = render(
        <ViewHeader
          email={email}
          toggleActionModal={toggleActionModal}
          replyToEmail={replyToEmail}
          forwardEmail={forwardEmail}
        />
      );

      const slidersIcon = container.querySelector('[data-icon="sliders"]')!;
      fireEvent.click(slidersIcon);

      const penToSquareIcon = container.querySelector('[data-icon="pen-to-square"]')!;
      fireEvent.click(penToSquareIcon);

      expect(toggleActionModal).toHaveBeenCalledWith(EViewActionType.MOVE);
    });

    it("being called with EViewActionType.COPY", () => {
      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const toggleActionModal = jest
        .fn()
        .mockImplementation((actionType: EViewActionType) => undefined);

      const replyToEmail = jest.fn().mockImplementation((all?: boolean) => undefined);

      const forwardEmail = jest.fn().mockImplementation(() => undefined);

      const { container } = render(
        <ViewHeader
          email={email}
          toggleActionModal={toggleActionModal}
          replyToEmail={replyToEmail}
          forwardEmail={forwardEmail}
        />
      );

      const slidersIcon = container.querySelector('[data-icon="sliders"]')!;
      fireEvent.click(slidersIcon);

      const copyIcon = container.querySelector('[data-icon="copy"]')!;
      fireEvent.click(copyIcon);

      expect(toggleActionModal).toHaveBeenCalledWith(EViewActionType.COPY);
    });

    it("being called with EViewActionType.FLAG", () => {
      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const toggleActionModal = jest
        .fn()
        .mockImplementation((actionType: EViewActionType) => undefined);

      const replyToEmail = jest.fn().mockImplementation((all?: boolean) => undefined);

      const forwardEmail = jest.fn().mockImplementation(() => undefined);

      const { container } = render(
        <ViewHeader
          email={email}
          toggleActionModal={toggleActionModal}
          replyToEmail={replyToEmail}
          forwardEmail={forwardEmail}
        />
      );

      const slidersIcon = container.querySelector('[data-icon="sliders"]')!;
      fireEvent.click(slidersIcon);

      const flagIcon = container.querySelector('[data-icon="flag"]')!;
      fireEvent.click(flagIcon);

      expect(toggleActionModal).toHaveBeenCalledWith(EViewActionType.FLAG);
    });

    it("being called with EViewActionType.VIEW", () => {
      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const toggleActionModal = jest
        .fn()
        .mockImplementation((actionType: EViewActionType) => undefined);

      const replyToEmail = jest.fn().mockImplementation((all?: boolean) => undefined);

      const forwardEmail = jest.fn().mockImplementation(() => undefined);

      const { container } = render(
        <ViewHeader
          email={email}
          toggleActionModal={toggleActionModal}
          replyToEmail={replyToEmail}
          forwardEmail={forwardEmail}
        />
      );

      const slidersIcon = container.querySelector('[data-icon="sliders"]')!;
      fireEvent.click(slidersIcon);

      const codeIcon = container.querySelector('[data-icon="code"]')!;
      fireEvent.click(codeIcon);

      expect(toggleActionModal).toHaveBeenCalledWith(EViewActionType.VIEW);
    });

    it("being called with EViewActionType.DELETE", () => {
      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const toggleActionModal = jest
        .fn()
        .mockImplementation((actionType: EViewActionType) => undefined);

      const replyToEmail = jest.fn().mockImplementation((all?: boolean) => undefined);

      const forwardEmail = jest.fn().mockImplementation(() => undefined);

      const { container } = render(
        <ViewHeader
          email={email}
          toggleActionModal={toggleActionModal}
          replyToEmail={replyToEmail}
          forwardEmail={forwardEmail}
        />
      );

      const codeIcons = container.querySelectorAll('[data-icon="trash"]');
      codeIcons.forEach((codeIcon) => fireEvent.click(codeIcon));

      expect(toggleActionModal).toHaveBeenCalledWith(EViewActionType.DELETE);
    });
  });
});
