import React from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

function ErrorModal({ error, onClose }) {
  const { title, message } = error;
  return (
    <Modal isOpen={error !== null} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="teal">
            Ок
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

ErrorModal.propTypes = {
  error: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorModal;
