import React, { useState } from "react";
import PropTypes from "prop-types";
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
import { sendOrder } from "../../services/menuService";

function ConfirmScreen({ items, setError, switchToDone }) {
  const [idempotencyKey] = useState(crypto.randomUUID());
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
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
      };
      const response = await sendOrder(order, idempotencyKey);
      if (response.ok || response.status === 304) {
        switchToDone();
      } else {
        const { error } = await response.json();
        throw new Error(error);
      }
    } catch (err) {
      setError({
        title: "Ошибка",
        message: err.message,
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

ConfirmScreen.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  setError: PropTypes.func.isRequired,
  switchToDone: PropTypes.func.isRequired,
};

export default ConfirmScreen;
