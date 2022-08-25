import { useState } from "react";
import { nanoid } from "nanoid";

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

const CYRILLIC_NAME_PATTERN = /^[\u0400-\u04FF ]{2,}/;

function ConfirmScreen(props) {
  const [idempotencyKey] = useState(nanoid());
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [loading, setLoading] = useState(false);

  const handleNameInputChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    localStorage.setItem("name", newName);
  };

  const validateName = (name) => {
    let error;
    if (name.length < 2) {
      error = "Укажите имя";
    } else if (!CYRILLIC_NAME_PATTERN.test(name)) {
      error = "Имя может содержать только кириллицу";
    }
    return error;
  };

  const submitOrder = async () => {
    try {
      const requestData = {
        name,
        items: props.items.map((item) => {
          const { id, ...otherFields } = item;
          return otherFields;
        }),
      };

      let initData = window.Telegram.WebApp.initData;
      initData = initData ? "?" + initData : window.location.search;
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/order${initData}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify(requestData),
        }
      );

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

  const handleClick = () => {
    if (!loading) {
      submitOrder();
    }
  };

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
        {nameError ? <FormErrorMessage>{nameError}</FormErrorMessage> : null}
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
        disabled={nameError}
        isLoading={loading}
        loadingText="Отправляю"
        width="100%"
        size="lg"
        onClick={handleClick}
        colorScheme="teal"
      >
        Отправить
      </Button>
    </>
  );
}

export default ConfirmScreen;
