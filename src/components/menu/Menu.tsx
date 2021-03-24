import React from "react";
import { ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInbox,
  faFeather,
  faFolderOpen,
  faCog,
  faSignOutAlt,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { StateManager } from "classes";

interface IMenuProps {
  dependencies: {
    stateManager: StateManager;
  };
}

interface IMenuItem {
  id: number;
  name: string;
  eventKey: string;
  icon: IconDefinition;
}

const Menu: React.FC<IMenuProps> = ({ dependencies }) => {
  const menu: IMenuItem[] = [
    { id: 1, name: "Inbox", eventKey: "inbox", icon: faInbox },
    { id: 2, name: "Compose", eventKey: "compose", icon: faFeather },
    { id: 3, name: "Folders", eventKey: "folders", icon: faFolderOpen },
    { id: 4, name: "Settings", eventKey: "settings", icon: faCog },
    { id: 5, name: "Logout", eventKey: "logout", icon: faSignOutAlt },
  ];

  return (
    <React.Fragment>
      <h3>Menu</h3>

      <ListGroup variant="flush">
        {menu.map((menuItem: IMenuItem) => (
          <ListGroup.Item
            action
            key={menuItem.id}
            onClick={() =>
              dependencies.stateManager.updateActiveKey(menuItem.eventKey)
            }
          >
            <FontAwesomeIcon icon={menuItem.icon} /> {menuItem.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </React.Fragment>
  );
};

export default React.memo(Menu);
