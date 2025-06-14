import React, {
  createElement,
  FunctionComponent,
  StrictMode,
  TouchEvent,
  useContext,
  useEffect,
  useState
} from "react";
import { createRoot, Root } from "react-dom/client";
import {
  Container,
  Navbar,
  Row,
  Col,
  Button,
  TabContent,
  TabPane,
  NavbarBrand,
  TabContainer
} from "react-bootstrap";
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
  Logout
} from "components";
import { DependenciesContext, IDependencies } from "contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faBars } from "@fortawesome/free-solid-svg-icons";
import { IComponent, IMessageModalState, ISliderState, ITouchState } from "interfaces";
import { errorHandler } from "lib";

import "bootstrap/dist/css/bootstrap.min.css";
import "index.css";

/**
 * Index
 * @returns {ReactNode}
 */
export const Index: FunctionComponent = () => {
  const [activeKey, setActiveKey] = useState<string>(window.location.hash.substring(1) || "inbox");

  const [sliderState, setSliderState] = useState<ISliderState>({
    sliderAction: false,
    sliderInitalDisplay: false
  });

  const [messageModalState, setMessageModalState] = useState<IMessageModalState>({
    title: "",
    content: "",
    show: false
  });

  const touchState: ITouchState = {
    start: undefined,
    end: undefined,
    threshold: 150
  };

  const { imapSocket, secureStorage, smtpSocket, stateManager } =
    useContext<IDependencies>(DependenciesContext);

  stateManager.indexState = {
    sliderState,
    setSliderState,
    setActiveKey,
    setMessageModalState
  };

  imapSocket.settings = secureStorage.getImapSettings();
  smtpSocket.settings = secureStorage.getSmtpSettings();

  useEffect(() => {
    window.addEventListener("rejectionhandled", errorHandler);
    window.addEventListener("unhandledrejection", errorHandler);
    window.addEventListener("error", errorHandler);

    document.getElementById("container-main")!.focus();

    setActiveKey(window.location.hash.substring(1) || "inbox");

    window.onpopstate = () => {
      setActiveKey(window.location.hash.substring(1) || "inbox");
    };
  }, []);

  const onTouchStartTrigger = (event: TouchEvent) => {
    touchState.start = event.targetTouches[0].screenX;
  };

  const onTouchMoveTrigger = (event: TouchEvent) => {
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
    { id: 7, element: Logout, eventKey: "logout" }
  ];

  return (
    <StrictMode>
      <Navbar bg="dark" variant="dark" className="fixed-top pt-2 pb-2 ps-3 pe-3">
        <NavbarBrand href="/">
          <FontAwesomeIcon icon={faAt} /> transit
        </NavbarBrand>
        <Button
          className="d-sm-block d-md-none ms-auto"
          variant="light"
          type="button"
          onClick={() =>
            setSliderState({
              sliderAction: !sliderState.sliderAction,
              sliderInitalDisplay: true
            })
          }
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </Navbar>
      <div
        id="container-main"
        onTouchStart={onTouchStartTrigger}
        onTouchEnd={onTouchEndTrigger}
        onTouchMove={onTouchMoveTrigger}
      >
        <Container fluid="true" className="h-100">
          <TabContainer activeKey={activeKey}>
            <Row className="g-0 h-100">
              <Col
                className={`bg-light pt-4 sideMenu ${
                  sliderState.sliderAction ? "slide-in" : "slide-out"
                } ${!sliderState.sliderInitalDisplay ? "d-none d-md-block" : "d-block"}`}
                sm={0}
                md={4}
                lg={3}
              >
                <Menu />
              </Col>
              <Col className="ps-0 pe-0 pe-sm-3 ps-sm-3" sm={12} md={8} lg={9}>
                <TabContent>
                  <ErrorBoundary>
                    {components.map((component: IComponent) => (
                      <TabPane
                        key={component.id}
                        mountOnEnter={true}
                        unmountOnExit={true}
                        eventKey={component.eventKey}
                      >
                        {createElement(component.element)}
                      </TabPane>
                    ))}
                  </ErrorBoundary>
                </TabContent>
              </Col>
            </Row>
          </TabContainer>
        </Container>
      </div>
      <MessageModal
        messageModalState={messageModalState}
        setMessageModalState={setMessageModalState}
      />
    </StrictMode>
  );
};

const container: Element = document.getElementById("root")!;
const root: Root = createRoot(container);

root.render(<Index />);
