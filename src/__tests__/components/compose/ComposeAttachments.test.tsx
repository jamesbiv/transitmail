import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeAttachments } from "components/compose";
import { IComposeAttachment } from "interfaces";

describe("ComposeAttachments Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("testing attachment icons", () => {
    it("a successful response testing each icon type", () => {
      const attachments: IComposeAttachment[] = [
        { data: "", filename: "filename.jpg", id: 0, mimeType: "image/jpeg", size: 1 },
        { data: "", filename: "filename.pdf", id: 1, mimeType: "application/pdf", size: 1 },
        { data: "", filename: "filename.doc", id: 2, mimeType: "application/msword", size: 1 },
        {
          data: "",
          filename: "filename.xls",
          id: 3,
          mimeType: "application/vnd.me-excel",
          size: 1
        },
        { data: "", filename: "filename.msc", id: 4, mimeType: "some/mime-type", size: 1 }
      ];

      const setAttachments = () => [];

      const { getByText } = render(
        <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
      );

      expect(getByText(/filename.jpg/i)).toBeInTheDocument();
      expect(getByText(/filename.pdf/i)).toBeInTheDocument();
      expect(getByText(/filename.doc/i)).toBeInTheDocument();
      expect(getByText(/filename.xls/i)).toBeInTheDocument();
      expect(getByText(/filename.msc/i)).toBeInTheDocument();
    });
  });

  describe("testing loadAttachments()", () => {
    it("a successful response", async () => {
      const originalFileReader = global.FileReader;

      const { TextEncoder } = require("util");

      const resultArrayBuffer = new TextEncoder().encode("Test attachment").buffer;

      global.FileReader = class {
        onload = () => undefined;
        result = resultArrayBuffer;

        readAsArrayBuffer(blob: Blob) {
          this.onload();
        }
      } as never;

      const attachments: IComposeAttachment[] = [
        { data: "", filename: "filename.msc", id: 0, mimeType: "some/mime-type", size: 1 }
      ];

      const setAttachments = jest.fn().mockImplementation(() => []);

      const { container } = render(
        <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
      );

      const attachmentString = "Test attachment";
      const fileBlob = new Blob([attachmentString], { type: "text/plain" });
      const mockFile: File = new File([fileBlob], "mockFilename", { type: "" });

      const fileList = [mockFile];
      Object.setPrototypeOf(fileList, FileList.prototype);

      const attachmentInput = container.querySelector('[id="attachmentInput"]')!;
      fireEvent.change(attachmentInput, { target: { files: fileList } });

      expect(setAttachments).toHaveBeenCalledWith([
        {
          data: "",
          filename: "filename.msc",
          id: 0,
          mimeType: "some/mime-type",
          size: 1
        },
        {
          data: "Test attachment",
          filename: "mockFilename",
          id: 1,
          mimeType: "",
          size: 15
        }
      ]);

      global.FileReader = originalFileReader;
    });

    it("a successful response but with 0 byte attachment", async () => {
      const originalFileReader = global.FileReader;

      const { TextEncoder } = require("util");

      const resultArrayBuffer = new TextEncoder().encode("").buffer;

      global.FileReader = class {
        onload = () => undefined;
        result = resultArrayBuffer;

        readAsArrayBuffer(blob: Blob) {
          this.onload();
        }
      } as never;

      const attachments: IComposeAttachment[] = [
        { data: "", filename: "filename.msc", id: 0, mimeType: "some/mime-type", size: 1 }
      ];

      const setAttachments = jest.fn().mockImplementation(() => []);

      const { container } = render(
        <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
      );

      const attachmentString = "Test attachment";
      const fileBlob = new Blob([attachmentString], { type: "text/plain" });
      const mockFile: File = new File([fileBlob], "mockFilename", { type: "" });

      const fileList = [mockFile];
      Object.setPrototypeOf(fileList, FileList.prototype);

      const attachmentInput = container.querySelector('[id="attachmentInput"]')!;
      fireEvent.change(attachmentInput, { target: { files: fileList } });

      expect(setAttachments).toHaveBeenCalledWith([
        {
          data: "",
          filename: "filename.msc",
          id: 0,
          mimeType: "some/mime-type",
          size: 1
        },
        {
          data: undefined,
          filename: "mockFilename",
          id: 1,
          mimeType: "",
          size: 15
        }
      ]);

      global.FileReader = originalFileReader;
    });

    it("an unsuccessful response because the attachment was invalid", () => {
      const readAsArrayBufferSpy = jest.spyOn(FileReader.prototype, "readAsArrayBuffer");

      readAsArrayBufferSpy.mockImplementationOnce(() => undefined);

      const attachments: IComposeAttachment[] = [
        { data: "", filename: "filename.msc", id: 1, mimeType: "some/mime-type", size: 1 }
      ];

      const setAttachments = jest.fn().mockImplementation(() => []);

      const { container } = render(
        <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
      );
      const attachmentInput = container.querySelector('[id="attachmentInput"]')!;

      Object.defineProperty(attachmentInput, "files", {
        value: undefined
      });

      fireEvent.change(attachmentInput, { target: { files: undefined } });

      expect(setAttachments).not.toHaveBeenCalled();
    });
  });

  describe("testing viewAttachment()", () => {
    it("a successful response", () => {
      const originalURLcreateObjectURL = global.URL.createObjectURL;

      global.URL.createObjectURL = jest.fn();

      const originalWiindowOpen = window.open;

      window.open = jest.fn();

      const readAsArrayBufferSpy = jest.spyOn(FileReader.prototype, "readAsArrayBuffer");

      readAsArrayBufferSpy.mockImplementationOnce(() => undefined);

      const attachments: IComposeAttachment[] = [
        { data: "", filename: "filename.msc", id: 1, mimeType: "some/mime-type", size: 1 }
      ];

      const setAttachments = () => [];

      const { container } = render(
        <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
      );

      const eyeIcon = container.querySelector('[data-icon="eye"]')!;
      fireEvent.click(eyeIcon);

      expect(window.open).toHaveBeenCalled();

      window.open = originalWiindowOpen;

      global.URL.createObjectURL = originalURLcreateObjectURL;
    });
  });

  describe("testing removeAttachment()", () => {
    it("a successful response", () => {
      const readAsArrayBufferSpy = jest.spyOn(FileReader.prototype, "readAsArrayBuffer");

      readAsArrayBufferSpy.mockImplementationOnce(() => undefined);

      const attachments: IComposeAttachment[] = [
        { data: "", filename: "filename.jpg", id: 0, mimeType: "image/jpeg", size: 1 },
        { data: "", filename: "filename.msc", id: 1, mimeType: "some/mime-type", size: 1 }
      ];

      const setAttachments = jest.fn().mockImplementation(() => []);

      const { container } = render(
        <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
      );

      const timeIcon = container.querySelector('[data-icon="xmark"]')!;
      fireEvent.click(timeIcon);

      expect(setAttachments).toHaveBeenCalledWith([
        { data: "", filename: "filename.msc", id: 1, mimeType: "some/mime-type", size: 1 }
      ]);
    });
  });
});
