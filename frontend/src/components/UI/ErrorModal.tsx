import React, {FC} from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Portal,
} from "@chakra-ui/react";
import {ErrorType} from "../../services/types";

interface ErrorModalProps {
    error: ErrorType
    onClose: () => void
}

const ErrorModal: FC<ErrorModalProps> = ({error, onClose}) => {
    const {title, message} = error;
    return (
        <Portal>
            <Modal isOpen={error !== null} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>{message}</ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} colorScheme="blue">
                            Ок
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Portal>
    );
}

export default ErrorModal;
