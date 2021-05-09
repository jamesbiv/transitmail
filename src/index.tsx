import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Container, Navbar, Row, Col, Button, Tab } from "react-bootstrap";
import {
  ImapHelper,
  ImapSocket,
  LocalStorage,
  SmtpSocket,
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

interface IDependencies {
  imapHelper: ImapHelper;
  imapSocket: ImapSocket;
  smtpSocket: SmtpSocket;
  localStorage: LocalStorage;
  stateManager: StateManager;
}

interface ITouchState {
  start?: number;
  end?: number;
  threshold: number;
}

const dependencies: IDependencies = {
  localStorage: new LocalStorage(),
  imapHelper: new ImapHelper(),
  imapSocket: new ImapSocket(),
  smtpSocket: new SmtpSocket(),
  stateManager: new StateManager(),
};

const Index: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>(
    window.location.hash.substring(1) || "inbox"
  );

  const [sliderAction, setSliderAction] = useState<boolean>(false);
  const [sliderInitalDisplay, setSliderInitalDisplay] = useState<boolean>(
    false
  );

  const [messageModalData, setMessageModalData] = useState<IMessageModalData>({
    title: "",
    content: "",
    action: () => {},
  });

  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);

  const touchState: ITouchState = {
    start: undefined,
    end: undefined,
    threshold: 150,
  };

  dependencies.stateManager.indexState = {
    sliderAction,
    setActiveKey,
    setSliderAction,
    setMessageModalData,
    setShowMessageModal,
  };

  dependencies.imapSocket.settings = {
    host: dependencies.localStorage.getSetting("imapHost"),
    port: dependencies.localStorage.getSetting("imapPort"),
    username: dependencies.localStorage.getSetting("imapUsername"),
    password: dependencies.localStorage.getSetting("imapPassword"),
  };

  dependencies.imapSocket.session.debug =
    process.env.NODE_ENV === "development";

  dependencies.smtpSocket.settings = {
    host: dependencies.localStorage.getSetting("smtpHost"),
    port: dependencies.localStorage.getSetting("smtpPort"),
    username: dependencies.localStorage.getSetting("smtpUsername"),
    password: dependencies.localStorage.getSetting("smtpPassword"),
  };

  dependencies.smtpSocket.session.debug =
    process.env.NODE_ENV === "development";

  useEffect(() => {
    (document.getElementById("container-main") as HTMLElement).focus();

    setActiveKey(window.location.hash.substring(1) || "inbox");

    window.onpopstate = () => {
      setActiveKey(window.location.hash.substring(1) || "inbox");
    };
  }, []);

  const onTouchStartTrigger = (event: React.TouchEvent) => {
    touchState.start = event.targetTouches[0].screenX;
  };

  const onTouchMoveTrigger = (event: React.TouchEvent) => {
    touchState.end = event.targetTouches[0].screenX;
  };

  const onTouchEndTrigger = () => {
    if (!touchState.start || !touchState.end) {
      return;
    }

    if (touchState.start - touchState.end > touchState.threshold) {
      setSliderAction(false);
      setSliderInitalDisplay(true);
    }

    if (touchState.start - touchState.end < touchState.threshold * -1) {
      setSliderAction(true);
      setSliderInitalDisplay(true);
    }
  };

  const components: IComponent[] = [
    { id: 1, element: Inbox, eventKey: "inbox" },
    { id: 2, element: Compose, eventKey: "compose" },
    { id: 3, element: Folders, eventKey: "folders" },
    { id: 4, element: Settings, eventKey: "settings" },
    { id: 5, element: View, eventKey: "view" },
    { id: 6, element: Folder, eventKey: "folder" },
    { id: 7, element: Logout, eventKey: "logout" },
  ];

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
          onClick={() => {
            setSliderAction(sliderAction);
            setSliderInitalDisplay(true);
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </Navbar>
      <div
        id="container-main"
        tabIndex={0}
        onTouchStart={onTouchStartTrigger}
        onTouchEnd={onTouchEndTrigger}
        onTouchMove={onTouchMoveTrigger}
      >
        <Container fluid>
          <Tab.Container activeKey={activeKey}>
            <Row>
              <Col
                className={`bg-light pt-4 sideMenu ${
                  sliderAction ? "slide-in" : "slide-out"
                } ${!sliderInitalDisplay ? "d-none d-md-block" : "d-block"}`}
                sm={0}
                md={4}
                lg={3}
              >
                <Menu dependencies={dependencies} />
              </Col>
              <Col className="pl-0 pr-0 pr-sm-3 pl-sm-3" sm={12} md={8} lg={9}>
                <Tab.Content>
                  <ErrorBoundary dependencies={dependencies}>
                    {components.map((component: IComponent) => (
                      <Tab.Pane
                        key={component.id}
                        mountOnEnter={true}
                        unmountOnExit={true}
                        eventKey={component.eventKey}
                      >
                        {React.createElement(component.element, {
                          dependencies: dependencies,
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
        messageModalData={messageModalData}
        messageModalShow={showMessageModal}
        onHide={() => setShowMessageModal(false)}
      />
    </React.StrictMode>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
