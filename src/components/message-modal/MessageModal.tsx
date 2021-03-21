import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { IMessageModalData } from "interfaces";

interface IMessageModalProps {
  messageModalShow: boolean;
  messageModalData?: IMessageModalData;
  onHide: () => void;
}

export const MessageModal: React.FC<IMessageModalProps> = ({
  messageModalShow,
  messageModalData,
  onHide,
}) => {
  return (
    <Modal
      show={messageModalShow}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
          {messageModalData?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{messageModalData?.content}</Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            onHide();
            messageModalData?.action();
          }}
        >
          Ok
        </Button>
        <Button
          onClick={() => {
            onHide();
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
