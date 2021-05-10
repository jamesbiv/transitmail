export interface IMessageModalState {
  title: string;
  content: JSX.Element | string;
  action: () => void;
  show?: boolean;
}
