import { ESmtpResponseCodeType, ISmtpResponseCode } from "interfaces";

/**
 * @constant {ISmtpResponseCodes[]} smtpResponseCodes
 */
// prettier-ignore
export const smtpResponseCodes: ISmtpResponseCode[] = [
  { 
    code: 211,
    type: ESmtpResponseCodeType.PositiveCompletion,
    description: "System status"
  },
  { 
    code: 214,
    type: ESmtpResponseCodeType.PositiveCompletion,
    description: "Help message"
  },
  { 
    code: 220,
    type: ESmtpResponseCodeType.PositiveCompletion,
    description: "Service ready"
  },
  {
    code: 221,
    type: ESmtpResponseCodeType.PositiveCompletion,
    description: "Service closing transmission channel"
  },
  {
    code: 235,
    type: ESmtpResponseCodeType.PositiveCompletion,
    description: "Authentication succeeded"
  },
  {
    code: 250,
    type: ESmtpResponseCodeType.PositiveCompletion,
    description: "Requested mail action okay, completed"
  },
  { 
    code: 251,
    type: ESmtpResponseCodeType.PositiveCompletion,
    description: "User not local"
  },
  { 
    code: 252,
    type: ESmtpResponseCodeType.PositiveCompletion,
    description: "Cannot VRFY user"
  },
  { 
    code: 334,
    type: ESmtpResponseCodeType.PositiveIntermediate,
    description: "Sever challenge"
  },
  { 
    code: 354,
    type: ESmtpResponseCodeType.PositiveIntermediate,
    description: "Start mail input"
  },
  {
    code: 421,
    type: ESmtpResponseCodeType.NegativeTransient,
    description: "Service not available"
  },
  {
    code: 450,
    type: ESmtpResponseCodeType.NegativeTransient,
    description: "Requested mail action not taken"
  },
  {
    code: 451,
    type: ESmtpResponseCodeType.NegativeTransient,
    description: "Requested action aborted"
  },
  {
    code: 452,
    type: ESmtpResponseCodeType.NegativeTransient,
    description: "Requested action not taken"
  },
  {
    code: 455,
    type: ESmtpResponseCodeType.NegativeTransient,
    description: "Server unable to accommodate parameters"
  },
  {
    code: 500,
    type: ESmtpResponseCodeType.NegativePermanent,
    description: "Syntax error, command unrecognized"
  },
  {
    code: 501,
    type: ESmtpResponseCodeType.NegativePermanent,
    description: "Syntax error in parameters or arguments"
  },
  {
    code: 502,
    type: ESmtpResponseCodeType.NegativePermanent,
    description: "Command not implemented"
  },
  {
    code: 503,
    type: ESmtpResponseCodeType.NegativePermanent,
    description: "Bad sequence of commands"
  },
  {
    code: 504,
    type: ESmtpResponseCodeType.NegativePermanent,
    description: "Command parameter not implemented"
  },
  {
    code: 550,
    type: ESmtpResponseCodeType.NegativePermanent,
    description: "Requested action not taken"
  },
  { 
    code: 551,
    type: ESmtpResponseCodeType.NegativePermanent,
    description: "User not local"
  },
  {
    code: 552,
    type: ESmtpResponseCodeType.NegativePermanent,
    description: "Requested mail action aborted: exceeded storage allocation"
  },
  {
    code: 553,
    type: ESmtpResponseCodeType.NegativePermanent,
    description: "Requested action not taken: mailbox name not allowed"
  },
  { 
    code: 554,
    type: ESmtpResponseCodeType.NegativePermanent,
    description: "Transaction failed"
  },
  {
    code: 555,
    type: ESmtpResponseCodeType.NegativePermanent,
    description: "MAIL FROM/RCPT TO parameters not recognized or not implemented"
  }
];
