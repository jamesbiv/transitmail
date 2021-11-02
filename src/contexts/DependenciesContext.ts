import { createContext } from "react";
import {
  ImapHelper,
  ImapSocket,
  SecureStorage,
  SmtpSocket,
  StateManager,
} from "classes";

export interface IDependencies {
  imapHelper: ImapHelper;
  imapSocket: ImapSocket;
  smtpSocket: SmtpSocket;
  secureStorage: SecureStorage;
  stateManager: StateManager;
}

const dependencies: IDependencies = {
  imapHelper: new ImapHelper(),
  imapSocket: new ImapSocket(),
  smtpSocket: new SmtpSocket(),
  secureStorage: new SecureStorage(),
  stateManager: new StateManager(),
};

export const directAccessToDependencies = () => dependencies;

export const DependenciesContext = createContext(dependencies);
