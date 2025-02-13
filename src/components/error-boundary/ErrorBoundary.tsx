import React, { ErrorInfo, ReactNode } from "react";
import { StateManager } from "classes";
import { DependenciesContext } from "contexts";
import Spinner from "react-bootstrap/Spinner";

interface IErrorBoundaryProps {
  children: ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.PureComponent<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  /**
   * @var {DependenciesContext} contextType
   */
  static contextType = DependenciesContext;

  /**
   * @var {StateManager} stateManager
   */
  protected stateManager!: StateManager;

  constructor(props: IErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(this.context)

    // this.stateManager = this.context.stateManager;

    if (error.message.includes("WebSocket")) {
      const MessageModalState = {
        title: "Invalid connection settings",
        content: (
          <>
            <p>Your connection settings for are invalid or not responding.</p>
            <p>
              Please visit <strong>Settings</strong> to change these settings
              before proceeding.
            </p>
          </>
        ),
        action: () => this.stateManager.updateActiveKey("settings"),
      };

      this.stateManager.showMessageModal(MessageModalState);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center" }}>
          <Spinner
            animation="grow"
            variant="dark"
            className="mt-5 ms-auto me-auto"
          />
        </div>
      );
    }

    return this.props.children;
  }
}
