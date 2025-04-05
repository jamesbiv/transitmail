/**
 * @interface ISmtpResponseCode
 */
export interface ISmtpResponseCode {
  code: number;
  type: ESmtpResponseCodeType;
  description: string;
}

/**
 * @enum ESmtpResponseCodeType
 */
export enum ESmtpResponseCodeType {
  PositiveCompletion,
  PositiveIntermediate,
  NegativeTransient,
  NegativePermanent
}
