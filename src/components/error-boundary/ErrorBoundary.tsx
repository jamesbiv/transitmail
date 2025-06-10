import React, { ErrorInfo, Fragment, PureComponent, ReactNode } from "react";
import { Spinner } from "react-bootstrap";

import { StateManager } from "classes";
import { DependenciesContext, IDependencies } from "contexts";

/**
 * @interface IErrorBoundaryProps
 * @property {ReactNode} children
 */
interface IErrorBoundaryProps {
  children: ReactNode;
}

/**
 * @interface IErrorBoundaryState
 * @property {boolean} hasError
 */
interface IErrorBoundaryState {
  hasError: boolean;
}

/**
 * @class ErrorBoundary
 * @extends PureComponent
 * @param {IErrorBoundaryProps} props
 * @param {IErrorBoundaryState} state
 */
export class ErrorBoundary extends PureComponent<IErrorBoundaryProps, IErrorBoundaryState> {
  /**
   * @static {DependenciesContext} contextType
   */
  static readonly contextType = DependenciesContext;

  /**
   * @declare {ContextType<typeof DependenciesContext>} context
   */
  context!: IDependencies;

  /**
   * @protected {StateManager} stateManager
   */
  protected stateManager!: StateManager;

  /**
   * @protected {string} previousHash
   */
  protected previousHash?: string;

  /**
   * @constructor
   * @param {IErrorBoundaryProps} props
   */
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * getDerivedStateFromError
   * @param {Error} error
   * @returns IErrorBoundaryState
   */
  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * componentDidCatch
   * @param {Error} error
   * @param {errorInfo} errorInfo
   * @returns {void}
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.stateManager = this.context.stateManager;

    this.previousHash = window.location.hash;

    if (error.message.includes("Websockets")) {
      const messageModalState = {
        title: "Invalid connection settings",
        content: (
          <Fragment>
            <p>Your connection settings are invalid or not responding.</p>
            <p>
              Please visit <strong>Settings</strong> to change these settings before proceeding.
            </p>
          </Fragment>
        ),
        action: () => this.stateManager.updateActiveKey("settings")
      };

      this.stateManager.showMessageModal(messageModalState);
    }
  }

  /**
   * componentDidUpdate
   * @returns {void}
   */
  componentDidUpdate(): void {
    if (this.previousHash !== window.location.hash) {
      this.setState({ hasError: false });
    }
  }

  /**
   * render
   * @returns ReactNode
   */
  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center" }}>
          <Spinner animation="grow" variant="dark" className="mt-5 ms-auto me-auto" />
        </div>
      );
    }

    return this.props.children;
  }
}
