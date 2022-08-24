import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button
} from "@chakra-ui/react";

const ErrorModal = (props) => {

  return (
    <Modal isOpen={props.error !== null} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.error.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{props.error.message}</ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose} colorScheme='teal'>Ок</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;
