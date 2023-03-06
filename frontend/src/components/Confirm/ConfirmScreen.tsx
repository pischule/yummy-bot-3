import React, {FC, useState} from "react";
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    ListItem,
    UnorderedList,
} from "@chakra-ui/react";

import validateName from "../../services/nameService";
import {sendOrder} from "../../services/menuService";
import {ErrorType, ItemType} from "../../services/types";

interface Props {
    items: ItemType[],
    setError: (e: ErrorType) => void,
    switchToDone: () => void
}


const ConfirmScreen: FC<Props> = ({items, setError, switchToDone}) => {
    const [idempotencyKey] = useState(crypto.randomUUID());
    const [name, setName] = useState(localStorage.getItem("name") || "");
    const [loading, setLoading] = useState(false);

    const handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        setName(newName);
        localStorage.setItem("name", newName);
    };

    const submitOrder = async () => {
        try {
            setLoading(true);
            const order = {
                name,
                items: items.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                })),
            };
            const response = await sendOrder(order, idempotencyKey);
            if (response.ok || response.status === 304) {
                switchToDone();
            } else {
                const {error} = (await response.json()) as { error: ErrorType };
                setError({
                    title: "Ошибка",
                    message: error.message
                });
            }
        } catch (error) {
            setError({title: "Ошибка", message: "Что-то пошло не так"})
        } finally {
            setLoading(false);
        }
    };

    const nameError = validateName(name);

    return (
        <>
            <Heading>Ваш заказ:</Heading>
            <FormControl isInvalid={!!nameError} mt="30px">
                <FormLabel>Имя</FormLabel>
                <Input
                    placeholder="Введите ваше имя"
                    onChange={handleNameInputChange}
                    value={name}
                />
                {nameError && <FormErrorMessage>{nameError}</FormErrorMessage>}
            </FormControl>

            <UnorderedList my={6}>
                {items.map((item) => (
                    <ListItem key={item.id}>
                        {item.name}
                        {item.quantity === 1 ? "" : ` x${item.quantity}`}
                    </ListItem>
                ))}
            </UnorderedList>
            <Button
                isDisabled={!!(loading || nameError)}
                isLoading={loading}
                loadingText="Отправляю"
                width="100%"
                size="lg"
                onClick={submitOrder}
                colorScheme="blue"
            >
                Заказать
            </Button>
        </>
    );
}

export default ConfirmScreen;
