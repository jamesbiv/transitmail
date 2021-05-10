import React, { ErrorInfo } from "react";
import { StateManager } from "classes";
import Spinner from "react-bootstrap/Spinner";
import { DependenciesContext, IDependencies } from "context";

interface IErrorBoundaryProps {}

interface IErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.PureComponent<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  /**
   * @var {} contextType
   */
  static contextType = DependenciesContext;

  /**
   * @var {StateManager} stateManager
   */
  protected stateManager: StateManager = {} as StateManager;

  constructor(props: IErrorBoundaryProps) {
    super(props);
    //this.stateManager = this.context.stateManager;
    console.log(this.context);
 
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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
            className="mt-5 ml-auto mr-auto"
          />
        </div>
      );
    }

    return this.props.children;
  }
}
