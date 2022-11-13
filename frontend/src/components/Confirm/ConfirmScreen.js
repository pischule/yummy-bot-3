import { useState } from "react";
import { nanoid } from "nanoid";

import { validateName } from "../../services/nameService";
import { sendOrder } from "../../services/menuService";

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

function ConfirmScreen(props) {
  const [idempotencyKey] = useState(nanoid());
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [loading, setLoading] = useState(false);

  const handleNameInputChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    localStorage.setItem("name", newName);
  };

  const submitOrder = async () => {
    try {
      setLoading(true);
      const order = {
        name,
        items: props.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
      };
      const response = await sendOrder(order, idempotencyKey);

      if (response.ok || response.status === 304) {
        props.switchToDone();
      } else {
        throw new Error(response.status + "");
      }
    } catch (err) {
      props.setError({
        title: "Ошибка",
        message: err.toString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const nameError = validateName(name);

  return (
    <>
      <Heading>Ваш заказ:</Heading>
      <FormControl isInvalid={nameError} mt="30px">
        <FormLabel>Имя</FormLabel>
        <Input
          placeholder="Введите ваше имя"
          onChange={handleNameInputChange}
          value={name}
        ></Input>
        {nameError && <FormErrorMessage>{nameError}</FormErrorMessage>}
      </FormControl>

      <UnorderedList my={6}>
        {props.items.map((item) => (
          <ListItem key={item.id}>
            {item.name}
            {item.quantity === 1 ? "" : " x" + item.quantity}
          </ListItem>
        ))}
      </UnorderedList>
      <Button
        disabled={loading || nameError}
        isLoading={loading}
        loadingText="Отправляю"
        width="100%"
        size="lg"
        onClick={submitOrder}
        colorScheme="teal"
      >
        Отправить
      </Button>
    </>
  );
}

export default ConfirmScreen;
