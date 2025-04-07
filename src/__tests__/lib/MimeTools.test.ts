import { MimeTools } from "lib";

describe("Testing MimeTools", () => {
  describe("Test parseMimeWords() function", () => {
    it("with a valid quoted printable string content", () => {
      const content: string = "=?UTF-8?Q?test_quoted_printable?=";

      const parseMimeWordsResponse = MimeTools.parseMimeWords(content);

      expect(parseMimeWordsResponse).toEqual("test quoted printable");
    });

    test("with valid bas64 string content", () => {
      const content: string = "=?UTF-8?B?dGVzdCBiYXNlNjQ=?=";

      const parseMimeWordsResponse = MimeTools.parseMimeWords(content);

      expect(parseMimeWordsResponse).toEqual("test base64");
    });

    test("with joinable content", () => {
      const content: string = "=?UTF-8?B?dGVzdCA=?==?UTF-8?B?YmFzZTY0?=";

      const parseMimeWordsResponse = MimeTools.parseMimeWords(content);

      expect(parseMimeWordsResponse).toEqual("test base64");
    });
  });

  describe("Test base64toBlob", () => {
    test("with valid string content", () => {
      const content: string = "dGVzdCBibG9i";
      const contentType: string = "";

      const base64toBlobResponse = MimeTools.base64toBlob(content, contentType);

      expect(base64toBlobResponse).toEqual(new Blob());
    });
  });

  describe("Test binaryStringToBlob", () => {
    test("with valid string content", () => {
      const content: string = "test blob";
      const contentType: string = "";

      const base64toBlobResponse = MimeTools.binaryStringToBlob(content, contentType);

      expect(base64toBlobResponse).toEqual(new Blob());
    });
  });
});
