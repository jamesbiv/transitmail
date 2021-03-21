export interface IMessageModalData {
  title: string;
  content: JSX.Element | string;
  action: () => void;
}
