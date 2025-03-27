import React, { FunctionComponent, useContext } from "react";
import { Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInbox,
  faFeather,
  faFolderOpen,
  faCog,
  faSignOutAlt,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { DependenciesContext } from "contexts";

/**
 * @interface IMenuItem
 */
interface IMenuItem {
  id: number;
  name: string;
  eventKey: string;
  icon: IconDefinition;
}

/**
 * Menu
 * @returns FunctionComponent
 */
const Menu: FunctionComponent = () => {
  const { stateManager } = useContext(DependenciesContext);

  const menu: IMenuItem[] = [
    { id: 1, name: "Inbox", eventKey: "inbox", icon: faInbox },
    { id: 2, name: "Compose", eventKey: "compose", icon: faFeather },
    { id: 3, name: "Folders", eventKey: "folders", icon: faFolderOpen },
    { id: 4, name: "Settings", eventKey: "settings", icon: faCog },
    { id: 5, name: "Logout", eventKey: "logout", icon: faSignOutAlt }
  ];

  return (
    <Container>
      <Row>
        <Col>
          <h3>Menu</h3>

          <ListGroup>
            {menu.map((menuItem: IMenuItem) => (
              <ListGroupItem
                action
                key={menuItem.id}
                onClick={() => stateManager.updateActiveKey(menuItem.eventKey)}
              >
                <FontAwesomeIcon icon={menuItem.icon} /> {menuItem.name}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default React.memo(Menu);
