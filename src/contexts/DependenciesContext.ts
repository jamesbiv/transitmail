import { Context, createContext } from "react";
import { ImapHelper, ImapSocket, SecureStorage, SmtpSocket, StateManager } from "classes";

/**
 * @interface IDependencies
 */
export interface IDependencies {
  imapHelper: ImapHelper;
  imapSocket: ImapSocket;
  smtpSocket: SmtpSocket;
  secureStorage: SecureStorage;
  stateManager: StateManager;
}

/**
 * @constant {IDependencies} dependencies
 */
const dependencies: IDependencies = {
  imapHelper: new ImapHelper(),
  imapSocket: new ImapSocket(),
  smtpSocket: new SmtpSocket(),
  secureStorage: new SecureStorage(),
  stateManager: new StateManager()
};

/**
 * @constant {() => IDependencies} directAccessToDependencies
 */
export const directAccessToDependencies: () => IDependencies = () => dependencies;

/**
 * @constant {Context<IDependencies>} DependenciesContext
 */
export const DependenciesContext: Context<IDependencies> = createContext(dependencies);
