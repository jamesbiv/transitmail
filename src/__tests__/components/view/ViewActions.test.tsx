import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EViewActionType, ViewActions } from "components/view";
import { IEmail, IEmailFlags } from "interfaces";

describe("ViewActions Component", () => {
  describe("ViewActionMove Component", () => {
    it("a successful result", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.MOVE;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Move folder to/i)).toBeInTheDocument();
    });
  });

  describe("the ViewActionCopy Component", () => {
    it("a successful result", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.COPY;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Copy folder to/i)).toBeInTheDocument();
    });
  });

  describe("the ViewActionFlag Component", () => {
    it("a successful result", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.FLAG;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      [/Answered/i, /Urgent/i, /Draft/i].forEach((flagType: RegExp) => {
        expect(getByText(flagType)).toBeInTheDocument();
      });
    });
  });

  describe("ViewActionView Component", () => {
    it("a successful result", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.VIEW;

      const email: IEmail = { contentRaw: "", emailRaw: "emailRaw", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/emailRaw/i)).toBeInTheDocument();
    });
  });

  describe("the ViewActionDelete Component", () => {
    it("a successful result", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.DELETE;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Are you sure you want to delete this email?/i)).toBeInTheDocument();
    });
  });
});
