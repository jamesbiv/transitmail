import { MimeTools } from "lib";

describe("Testing MimeTools", () => {
  describe("Test parseMimeWords() function", () => {
    it("with a valid quoted printable string content", () => {
      const content: string = "=?UTF-8?Q?test_quoted_printable?=";

      const parseMimeWordsResponse = MimeTools.parseMimeWords(content);

      expect(parseMimeWordsResponse).toEqual("test quoted printable");
    });

    it("with a valid quoted printable with hex value as string content", () => {});
    const content: string = "=?UTF-8?Q?=3F_string_with_hex_value?=";

    const parseMimeWordsResponse = MimeTools.parseMimeWords(content);

    expect(parseMimeWordsResponse).toEqual("? string with hex value");

    it("with valid base64 string content", () => {
      const content: string = "=?UTF-8?B?dGVzdCBiYXNlNjQ=?=";

      const parseMimeWordsResponse = MimeTools.parseMimeWords(content);

      expect(parseMimeWordsResponse).toEqual("test base64");
    });

    it("with joinable content", () => {
      const content: string = "=?UTF-8?B?dGVzdCA=?==?UTF-8?B?YmFzZTY0?=";

      const parseMimeWordsResponse = MimeTools.parseMimeWords(content);

      expect(parseMimeWordsResponse).toEqual("test base64");
    });

    it("with invalid content", () => {
      const content: string = "=?UTF-8?B??=";

      const parseMimeWordsResponse = MimeTools.parseMimeWords(content);

      expect(parseMimeWordsResponse).toEqual("=?UTF-8?B??=");
    });
  });

  describe("Test base64toBlob", () => {
    it("with valid string content", () => {
      const content: string = "dGVzdCBibG9i";
      const contentType: string = "";

      const base64toBlobResponse = MimeTools.base64toBlob(content, contentType);

      expect(base64toBlobResponse).toEqual(new Blob());
    });
  });

  describe("Test binaryStringToBlob", () => {
    it("with valid string content", () => {
      const content: string = "test blob";
      const contentType: string = "";

      const base64toBlobResponse = MimeTools.binaryStringToBlob(content, contentType);

      expect(base64toBlobResponse).toEqual(new Blob());
    });
  });
});
