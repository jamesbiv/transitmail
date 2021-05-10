import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Container, Navbar, Row, Col, Button, Tab } from "react-bootstrap";
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
import { DependenciesContext } from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faBars } from "@fortawesome/free-solid-svg-icons";
import {
  IComponent,
  IMessageModalState,
  ISliderState,
  ITouchState,
} from "interfaces";

import * as serviceWorker from "serviceWorker";

import "bootstrap/dist/css/bootstrap.min.css";
import "index.css";

const Index: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>(
    window.location.hash.substring(1) || "inbox"
  );

  const [sliderState, setSliderState] = useState<ISliderState>({
    sliderAction: false,
    sliderInitalDisplay: false,
  });

  const [
    messageModalState,
    setMessageModalState,
  ] = useState<IMessageModalState>({
    title: "",
    content: "",
    action: () => {},
    show: false,
  });

  const touchState: ITouchState = {
    start: undefined,
    end: undefined,
    threshold: 150,
  };

  const { imapSocket, localStorage, smtpSocket, stateManager } = useContext(
    DependenciesContext
  );

  stateManager.indexState = {
    sliderState,
    setSliderState,
    setActiveKey,
    setMessageModalState,
  };

  imapSocket.settings = localStorage.getImapSettings();
  smtpSocket.settings = localStorage.getSmtpSettings();

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
      setSliderState({ sliderAction: false, sliderInitalDisplay: true });
    }

    if (touchState.start - touchState.end < touchState.threshold * -1) {
      setSliderState({ sliderAction: true, sliderInitalDisplay: true });
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
          onClick={() =>
            setSliderState({
              sliderAction: !sliderState.sliderAction,
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
        onTouchStart={onTouchStartTrigger}
        onTouchEnd={onTouchEndTrigger}
        onTouchMove={onTouchMoveTrigger}
      >
        <Container fluid>
          <Tab.Container activeKey={activeKey}>
            <Row>
              <Col
                className={`bg-light pt-4 sideMenu ${
                  sliderState.sliderAction ? "slide-in" : "slide-out"
                } ${
                  !sliderState.sliderInitalDisplay
                    ? "d-none d-md-block"
                    : "d-block"
                }`}
                sm={0}
                md={4}
                lg={3}
              >
                <Menu />
              </Col>
              <Col className="pl-0 pr-0 pr-sm-3 pl-sm-3" sm={12} md={8} lg={9}>
                <Tab.Content>
                  <ErrorBoundary>
                    {components.map((component: IComponent) => (
                      <Tab.Pane
                        key={component.id}
                        mountOnEnter={true}
                        unmountOnExit={true}
                        eventKey={component.eventKey}
                      >
                        {React.createElement(component.element)}
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
        messageModalState={messageModalState}
        onHide={() =>
          setMessageModalState({
            ...messageModalState,
            show: false,
          })
        }
      />
    </React.StrictMode>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
