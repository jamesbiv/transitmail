import React, { Dispatch, FunctionComponent } from "react";
import { Button, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { IMessageModalState } from "interfaces";

/**
 * @interface IMessageModalProps
 */
interface IMessageModalProps {
  messageModalState: IMessageModalState;
  setMessageModalState: Dispatch<IMessageModalState>;
}

/**
 * MessageModal
 * @param {IMessageModalProps} properties
 * @returns FunctionComponent
 */
export const MessageModal: FunctionComponent<IMessageModalProps> = ({
  messageModalState,
  setMessageModalState
}) => {
  const hideMessageModal = (): void => setMessageModalState({ ...messageModalState, show: false });

  return (
    <Modal
      show={messageModalState.show}
      onHide={hideMessageModal}
      centered={true}
      aria-labelledby="message-modal"
    >
      <ModalHeader closeButton>
        <ModalTitle id="message-modal">
          <FontAwesomeIcon icon={faExclamationTriangle} /> {messageModalState.title}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>{messageModalState.content}</ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            messageModalState.action && messageModalState.action();
            hideMessageModal();
          }}
        >
          Ok
        </Button>
        <Button onClick={() => hideMessageModal()}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};
