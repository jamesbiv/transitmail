import { createContext } from "react";
import {
  ImapHelper,
  ImapSocket,
  LocalStorage,
  SmtpSocket,
  StateManager,
} from "classes";

export interface IDependencies {
  imapHelper: ImapHelper;
  imapSocket: ImapSocket;
  smtpSocket: SmtpSocket;
  localStorage: LocalStorage;
  stateManager: StateManager;
}

const dependencies: IDependencies = {
  localStorage: new LocalStorage(),
  imapHelper: new ImapHelper(),
  imapSocket: new ImapSocket(),
  smtpSocket: new SmtpSocket(),
  stateManager: new StateManager(),
};

export const directAccessToDependencies = () => dependencies;

export const DependenciesContext = createContext(dependencies);
