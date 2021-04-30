import React, { useState } from "react";

import { faAsterisk, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Card, Col, Form, Row } from "react-bootstrap";

interface ISettingsFormAdvancedProps {}

export const SettingsFormAdvanced: React.FC<ISettingsFormAdvancedProps> = () => {
  const [collapasableStatus, toggleCollapasableStatus] = useState(false);

  return (
    <Accordion>
      <Card className="mt-3">
        <Accordion.Toggle
          as={Card.Header}
          eventKey="0"
          className="pointer"
          onClick={() => toggleCollapasableStatus(!collapasableStatus)}
        >
          <FontAwesomeIcon
            className="mr-2"
            icon={collapasableStatus ? faMinus : faPlus}
          />
          Advanced Settings
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Row>
              <Col xs={12} sm={6}>
                <Card.Text>
                  <h6>Folder Settings</h6>
                </Card.Text>
                <Form.Group controlId="formFolderArchive">
                  <Form.Label>
                    Archive Folder{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control type="text" placeholder="" />
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formFolderTrash">
                  <Form.Label>
                    Trash Folder{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control type="text" placeholder="" />
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formFolderDrafts">
                  <Form.Label>
                    Drafts Folder{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control type="text" placeholder="" />
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formFolderSentItems">
                  <Form.Label>
                    Sent Items Folder{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control type="text" placeholder="" />
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formFolderSpam">
                  <Form.Label>
                    Spam Folder{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control type="text" placeholder="" />
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Card.Text>
                  <h6>Other Settings</h6>
                </Card.Text>
                <Card.Body>
                  <Form.Group controlId="formEmailAutoLogin">
                    <Form.Check
                      type="switch"
                      id="autoLogin"
                      label="Ask for password before sign-in"
                      /*defaultChecked={settings.autoLogin}
                    onChange={() => {
                      settings.autoLogin = settings.autoLogin ? false : true;
                    }}*/
                    />
                    <Form.Text className="text-muted">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit
                      ...
                    </Form.Text>
                  </Form.Group>
                  <Form.Group controlId="formFolderPlaceholder">
                    <Form.Label>
                      Placeholder Text{" "}
                      <FontAwesomeIcon
                        icon={faAsterisk}
                        size="xs"
                        className="text-danger mb-1"
                      />
                    </Form.Label>
                    <Form.Control type="text" placeholder="" />
                    <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                  </Form.Group>
                </Card.Body>
              </Col>
            </Row>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
