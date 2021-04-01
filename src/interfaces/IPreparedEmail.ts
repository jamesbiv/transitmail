export interface IPreparedEmail {
    boundaryid?: string;
    to?: string;
    cc?: string;
    bcc?: string;
    from?: string;
    subject?: string;
    contentText?: string;
    contentHTML?: string;
    attachmentsEncoded?: string;
    payload?: string;
  }