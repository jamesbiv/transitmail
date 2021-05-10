import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { IMessageModalState } from "interfaces";

interface IMessageModalProps {
  messageModalState: IMessageModalState;
  onHide: () => void;
}

export const MessageModal: React.FC<IMessageModalProps> = ({
  messageModalState,
  onHide,
}) => {
  return (
    <Modal
      show={messageModalState.show}
      centered={true}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
          {messageModalState.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{messageModalState.content}</Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            messageModalState.action();
            onHide();
          }}
        >
          Ok
        </Button>
        <Button onClick={() => onHide()}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
