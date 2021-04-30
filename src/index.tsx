import React from "react";
import ReactDOM from "react-dom";
import { Container, Navbar, Row, Col, Button, Tab } from "react-bootstrap";
import {
  ImapHelper,
  ImapSocket,
  LocalStorage,
  SmtpSocket,
  EmailParser,
  StateManager,
} from "classes";
import {
  Folder,
  Folders,
  Compose,
  Menu,
  Inbox,
  Settings,
  View,
  ErrorBoundary,
  MessageModal,
  Logout,
} from "components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faBars } from "@fortawesome/free-solid-svg-icons";
import { IComponent, IMessageModalData } from "interfaces";
import * as serviceWorker from "serviceWorker";

import "bootstrap/dist/css/bootstrap.min.css";
import "index.css";

interface IIndexState {
  activeKey: string;
  sliderAction: boolean;
  sliderInitalDisplay: boolean;
  messageModalData: IMessageModalData;
  showMessageModal: boolean;
}

interface ITouchState {
  start?: number;
  end?: number;
  threshold: number;
}

class Index extends React.Component<{}, IIndexState> {
  /**
   * @var {object} dependencies
   */
  protected dependencies: {
    imapHelper: ImapHelper;
    imapSocket: ImapSocket;
    smtpSocket: SmtpSocket;
    localStorage: LocalStorage;
    emailParser: EmailParser;
    stateManager: StateManager;
  };

  /**
   * @var {ITouchState} touchState
   */
  protected touchState: ITouchState;

  constructor(props: {}) {
    super(props);

    const emailParser: EmailParser = new EmailParser();

    this.dependencies = {
      localStorage: new LocalStorage(),
      emailParser: emailParser,
      imapHelper: new ImapHelper({ emailParser }),
      imapSocket: new ImapSocket(),
      smtpSocket: new SmtpSocket(),
      stateManager: new StateManager(this),
    };

    this.dependencies.imapSocket.settings = {
      host: this.dependencies.localStorage.getSetting("imapHost"),
      port: this.dependencies.localStorage.getSetting("imapPort"),
      username: this.dependencies.localStorage.getSetting("imapUsername"),
      password: this.dependencies.localStorage.getSetting("imapPassword"),
    };

    this.dependencies.imapSocket.session.debug = true;

    this.dependencies.smtpSocket.settings = {
      host: this.dependencies.localStorage.getSetting("smtpHost"),
      port: this.dependencies.localStorage.getSetting("smtpPort"),
      username: this.dependencies.localStorage.getSetting("smtpUsername"),
      password: this.dependencies.localStorage.getSetting("smtpPassword"),
    };

    this.dependencies.smtpSocket.session.debug = true;

    this.state = {
      activeKey: window.location.hash.substring(1) || "inbox",
      sliderAction: false,
      sliderInitalDisplay: false,
      messageModalData: { title: "", content: "", action: () => {} },
      showMessageModal: false,
    };

    this.touchState = {
      start: undefined,
      end: undefined,
      threshold: 150,
    };
  }

  componentDidMount() {
    (document.getElementById("container-main") as HTMLElement).focus();

    this.setState({
      activeKey: window.location.hash.substring(1) || "inbox",
    });
  }

  componentDidUpdate() {
    window.onpopstate = () => {
      this.setState({
        activeKey: window.location.hash.substring(1) || "inbox",
      });
    };
  }

  onTouchStartTrigger = (event: React.TouchEvent) => {
    this.touchState.start = event.targetTouches[0].screenX;
  };

  onTouchMoveTrigger = (event: React.TouchEvent) => {
    this.touchState.end = event.targetTouches[0].screenX;
  };

  onTouchEndTrigger = () => {
    if (!this.touchState.start || !this.touchState.end) {
      return;
    }

    if (
      this.touchState.start - this.touchState.end >
      this.touchState.threshold
    ) {
      this.setState({
        sliderAction: false,
        sliderInitalDisplay: true,
      });
    }

    if (
      this.touchState.start - this.touchState.end <
      this.touchState.threshold * -1
    ) {
      this.setState({
        sliderAction: true,
        sliderInitalDisplay: true,
      });
    }
  };

  components: IComponent[] = [
    { id: 1, element: Inbox, eventKey: "inbox" },
    { id: 2, element: Compose, eventKey: "compose" },
    { id: 3, element: Folders, eventKey: "folders" },
    { id: 4, element: Settings, eventKey: "settings" },
    { id: 5, element: View, eventKey: "view" },
    { id: 6, element: Folder, eventKey: "folder" },
    { id: 7, element: Logout, eventKey: "logout" },
  ];

  render() {
    return (
      <React.StrictMode>
        <Navbar bg="dark" variant="dark" className="fixed-top pt-2 pb-2">
          <Navbar.Brand href="">
            <FontAwesomeIcon icon={faAt} /> transit
          </Navbar.Brand>
          <Button
            className="d-sm-block d-md-none ml-auto"
            variant="light"
            type="button"
            onClick={() =>
              this.setState({
                sliderAction: !this.state.sliderAction,
                sliderInitalDisplay: true,
              })
            }
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>
        </Navbar>
        <div
          id="container-main"
          tabIndex={0}
          onTouchStart={this.onTouchStartTrigger}
          onTouchEnd={this.onTouchEndTrigger}
          onTouchMove={this.onTouchMoveTrigger}
        >
          <Container fluid>
            <Tab.Container activeKey={this.state.activeKey}>
              <Row>
                <Col
                  className={`bg-light pt-4 sideMenu ${
                    this.state.sliderAction ? "slide-in" : "slide-out"
                  } ${
                    !this.state.sliderInitalDisplay
                      ? "d-none d-md-block"
                      : "d-block"
                  }`}
                  sm={0}
                  md={4}
                  lg={3}
                >
                  <Menu dependencies={this.dependencies} />
                </Col>
                <Col
                  className="pl-0 pr-0 pr-sm-3 pl-sm-3"
                  sm={12}
                  md={8}
                  lg={9}
                >
                  <Tab.Content>
                    <ErrorBoundary dependencies={this.dependencies}>
                      {this.components.map((component: IComponent) => (
                        <Tab.Pane
                          key={component.id}
                          mountOnEnter={true}
                          unmountOnExit={true}
                          eventKey={component.eventKey}
                        >
                          {React.createElement(component.element, {
                            dependencies: this.dependencies,
                          })}
                        </Tab.Pane>
                      ))}
                    </ErrorBoundary>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Container>
        </div>
        <MessageModal
          messageModalData={this.state.messageModalData}
          messageModalShow={this.state.showMessageModal}
          onHide={() => this.setState({ showMessageModal: false })}
        />
      </React.StrictMode>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
