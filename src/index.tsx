import React from "react";
import ReactDOM from "react-dom";
import { Container, Navbar, Row, Col, Button, Tab } from "react-bootstrap";
import {
  ImapSocket,
  LocalStorage,
  SmtpSocket,
  EmailParser,
  StateManager,
} from "class";
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
  messageModalData: IMessageModalData;
  showMessageModal: boolean;
}

class Index extends React.Component<{}, IIndexState> {
  /**
   * @var {object} dependencies
   */
  protected dependencies: {
    imapSocket: ImapSocket;
    smtpSocket: SmtpSocket;
    localStorage: LocalStorage;
    emailParser: EmailParser;
    stateManager: StateManager;
  };

  constructor(props: {}) {
    super(props);

    this.dependencies = {
      localStorage: new LocalStorage(),
      imapSocket: new ImapSocket(),
      smtpSocket: new SmtpSocket(),
      emailParser: new EmailParser(),
      stateManager: new StateManager(this),
    };

    this.state = {
      activeKey: window.location.hash.substring(1) || "inbox",
      sliderAction: false,
      messageModalData: { title: "", content: "", action: () => {} },
      showMessageModal: false,
    };
  }

  componentDidMount() {
    (document.getElementById("container-main") as HTMLElement).focus();

    this.setState({
      activeKey: window.location.hash.substring(1) || "inbox",
    });
  }

  componentDidUpdate() {
    /* Handling back & forward browser buttons */
    window.onpopstate = () => {
      this.setState({
        activeKey: window.location.hash.substring(1) || "inbox",
      });
    };
  }

  render() {
    // Connection settings
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

    /* Component declarations */
    const components: IComponent[] = [
      { id: 1, name: Inbox, eventKey: "inbox" },
      { id: 2, name: Compose, eventKey: "compose" },
      { id: 3, name: Folders, eventKey: "folders" },
      { id: 4, name: Settings, eventKey: "settings" },
      { id: 5, name: View, eventKey: "view" },
      { id: 6, name: Folder, eventKey: "folder" },
    ];

    /* Body template */
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
              this.setState({ sliderAction: !this.state.sliderAction })
            }
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>
        </Navbar>
        <div id="container-main" tabIndex={0}>
          <Container fluid>
            <Tab.Container activeKey={this.state.activeKey}>
              <Row>
                <Col
                  className={`bg-light pt-4 sideMenu ${
                    this.state.sliderAction ? "slide-in" : "slide-out"
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
                      {components.map((component: IComponent) => (
                        <Tab.Pane
                          key={component.id}
                          mountOnEnter={true}
                          unmountOnExit={true}
                          eventKey={component.eventKey}
                        >
                          {React.createElement(component.name, {
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
