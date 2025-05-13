import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeAttachments } from "components/compose";
import { IComposeAttachment } from "interfaces";

describe("ComposeAttachments Component", () => {
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
    it("a successful response", () => {
      const readAsBinaryStringSpy = jest.spyOn(FileReader.prototype, "readAsBinaryString");

      readAsBinaryStringSpy.mockImplementationOnce(() => undefined);

      const attachments: IComposeAttachment[] = [
        { data: "", filename: "filename.msc", id: 1, mimeType: "some/mime-type", size: 1 }
      ];

      const setAttachments = () => [];

      const { container } = render(
        <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
      );

      const mockFile: File = {
        name: "mockFilename",
        lastModified: 1,
        webkitRelativePath: "",
        size: 0,
        type: "",

        arrayBuffer: function (): Promise<ArrayBuffer> {
          throw new Error("Function not implemented.");
        },
        bytes: function (): Promise<Uint8Array> {
          throw new Error("Function not implemented.");
        },
        slice: function (start?: number, end?: number, contentType?: string): Blob {
          throw new Error("Function not implemented.");
        },
        stream: function (): ReadableStream<Uint8Array> {
          throw new Error("Function not implemented.");
        },
        text: function (): Promise<string> {
          throw new Error("Function not implemented.");
        }
      };

      const fileList = {
        item(index: number): File {
          return mockFile;
        },

        length: 1
      } as FileList;

      const attachmentInput = container.querySelector('[id="attachmentInput"]')!;
      fireEvent.change(attachmentInput, { target: { files: fileList } });
    });
  });

  describe("testing viewAttachment()", () => {
    it("a successful response", () => {
      const originalURLcreateObjectURL = global.URL.createObjectURL;

      global.URL.createObjectURL = jest.fn();

      const readAsBinaryStringSpy = jest.spyOn(FileReader.prototype, "readAsBinaryString");

      readAsBinaryStringSpy.mockImplementationOnce(() => undefined);

      const attachments: IComposeAttachment[] = [
        { data: "", filename: "filename.msc", id: 1, mimeType: "some/mime-type", size: 1 }
      ];

      const setAttachments = () => [];

      const { container } = render(
        <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
      );

      const eyeIcon = container.querySelector('[data-icon="eye"]')!;
      fireEvent.click(eyeIcon);

      global.URL.createObjectURL = originalURLcreateObjectURL;
    });
  });

  describe("testing removeAttachment()", () => {
    it("a successful response", () => {
      const readAsBinaryStringSpy = jest.spyOn(FileReader.prototype, "readAsBinaryString");

      readAsBinaryStringSpy.mockImplementationOnce(() => undefined);

      const attachments: IComposeAttachment[] = [
        { data: "", filename: "filename.msc", id: 1, mimeType: "some/mime-type", size: 1 }
      ];

      const setAttachments = () => [];

      const { container } = render(
        <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
      );

      const timeIcon = container.querySelector('[data-icon="xmark"]')!;
      fireEvent.click(timeIcon);
    });
  });
});
