import { MimeTools } from "lib";

describe("Testing the MimeTools class", () => {
  describe("Test parseMimeWords", () => {
    test("With valid string content", () => {
      const mockParseMimeWordsContent: string = "";

      const mockParseMimeWordsResponse: string = "";

      const parseMimeWordsResponse = MimeTools.parseMimeWords(
        mockParseMimeWordsContent
      );

      expect(parseMimeWordsResponse).toEqual(mockParseMimeWordsResponse);
    });
  });

  describe("Test base64toBlob", () => {
    test("With valid string content", () => {
      const mockBase64toBlobsContent: string = "";

      const mockBase64toBlobResponse: string = "";

      const base64toBlobResponse = MimeTools.base64toBlob(
        mockBase64toBlobsContent,
        ""
      );

      expect(base64toBlobResponse).toEqual(mockBase64toBlobResponse);
    });
  });

  describe("Test binaryStringToBlob", () => {
    test("With valid string content", () => {
      const mockBinaryStringToBlobContent: string = "";

      const mockBinaryStringToBlobResponse: string = "";

      const base64toBlobResponse = MimeTools.binaryStringToBlob(
        mockBinaryStringToBlobContent,
        ""
      );

      expect(base64toBlobResponse).toEqual(mockBinaryStringToBlobResponse);
    });
  });
});
