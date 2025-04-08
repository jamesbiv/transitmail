import { ESmtpResponseCodeType } from "interfaces";
import { smtpResponseCodes } from "lib";

describe("Test the smtpResponseCodes array", () => {
  it("a successful response or PositiveCompletion response", () => {
    expect(smtpResponseCodes[0]).toEqual({
      code: 211,
      type: ESmtpResponseCodeType.PositiveCompletion,
      description: "System status"
    });
  });

  it("a unsuccesful response or NegativePermanent response", () => {
    expect(smtpResponseCodes[smtpResponseCodes.length - 1]).toEqual({
      code: 555,
      type: ESmtpResponseCodeType.NegativePermanent,
      description: "MAIL FROM/RCPT TO parameters not recognized or not implemented"
    });
  });
});
