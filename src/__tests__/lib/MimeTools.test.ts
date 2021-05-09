import { MimeTools } from "lib";

describe("Testing the MimeTools class", () => {
  describe("Test parseMimeWords", () => {
    test("With valid quoted printable string content", () => {
      const mockParseMimeWordsContent: string = "=?UTF-8?Q?test_quoted_printable?=";

      const mockParseMimeWordsResponse: string = "test quoted printable";

      const parseMimeWordsResponse = MimeTools.parseMimeWords(
        mockParseMimeWordsContent
      );

      expect(parseMimeWordsResponse).toEqual(mockParseMimeWordsResponse);
    });

    test("With valid bas64 string content", () => {
      const mockParseMimeWordsContent: string = "=?UTF-8?B?dGVzdCBiYXNlNjQ=?="

      const mockParseMimeWordsResponse: string = "test base64";

      const parseMimeWordsResponse = MimeTools.parseMimeWords(
        mockParseMimeWordsContent
      );

      expect(parseMimeWordsResponse).toEqual(mockParseMimeWordsResponse);
    });


    test("With joinable content", () => {
      const mockParseMimeWordsContent: string = "=?UTF-8?B?dGVzdCA=?==?UTF-8?B?YmFzZTY0?=";

      const mockParseMimeWordsResponse: string = "test base64";

      const parseMimeWordsResponse = MimeTools.parseMimeWords(
        mockParseMimeWordsContent
      );

      expect(parseMimeWordsResponse).toEqual(mockParseMimeWordsResponse);
    });
  });

  describe("Test base64toBlob", () => {
    test("With valid string content", () => {
      const mockBase64toBlobsContent: string = "dGVzdCBibG9i";

      const mockBase64toBlobResponse: Blob = new Blob();

      const base64toBlobResponse = MimeTools.base64toBlob(
        mockBase64toBlobsContent,
        ""
      );

      expect(base64toBlobResponse).toEqual(mockBase64toBlobResponse);
    });
  });

  describe("Test binaryStringToBlob", () => {
    test("With valid string content", () => {
      const mockBinaryStringToBlobContent: string = "test blob";

      const mockBinaryStringToBlobResponse: Blob = new Blob();

      const base64toBlobResponse = MimeTools.binaryStringToBlob(
        mockBinaryStringToBlobContent,
        ""
      );

      expect(base64toBlobResponse).toEqual(mockBinaryStringToBlobResponse);
    });
  });
});
