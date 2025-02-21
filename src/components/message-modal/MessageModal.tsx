import React from "react";
import { Button, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { IMessageModalState } from "interfaces";

interface IMessageModalProps {
  messageModalState: IMessageModalState;
  onHide: () => void;
}

export const MessageModal: React.FC<IMessageModalProps> = ({ messageModalState, onHide }) => {
  return (
    <Modal
      show={messageModalState.show}
      centered={true}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <ModalHeader closeButton>
        <ModalTitle id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={faExclamationTriangle} /> {messageModalState.title}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>{messageModalState.content}</ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            messageModalState.action();
            onHide();
          }}
        >
          Ok
        </Button>
        <Button onClick={() => onHide()}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};
