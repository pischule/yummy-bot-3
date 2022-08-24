import { useState } from "react";
import { nanoid } from "nanoid";

import {
  Button,
  Heading,
  Input,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";

function ConfirmScreen(props) {
  const [idempotencyKey] = useState(nanoid());
  const [name, setName] = useState(localStorage.getItem("name") || null);
  const [pressed, setPressed] = useState(false);

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    localStorage.setItem("name", newName);
  };

  const isNameValid = (name) => {
    const cyrillicPattern = /^[\u0400-\u04FF ]{2,}/;
    return cyrillicPattern.test(name);
  };

  const submitOrder = async () => {
    try {
      const requestData = {
        name: name,
        items: props.items.map((item) => {
          const { id, ...itemWithoutId } = item;
          return itemWithoutId;
        }),
      };

      let initData = window.Telegram.WebApp.initData;
      initData = initData ? "?" + initData : window.location.search;
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
      setPressed(false);
    }
  };

  const handleClick = () => {
    if (name == null || name === "") {
      props.setError({
        title: "Ошибка",
        message: "введите имя",
      });
      return;
    }
    if (!isNameValid(name)) {
      props.setError({
        title: "Ошибка",
        message: "имя может содержать только кириллицу",
      });
      return;
    }

    if (!pressed) {
      setPressed(true);
      submitOrder();
    }
  };

  return (
    <>
      <Heading>Ваш заказ:</Heading>
      <Input
        mt='20px'
        id="nameInput"
        value={name}
        onChange={handleNameChange}
        placeholder="Введите ваше имя"
      ></Input>
      <UnorderedList my={6}>
        {props.items.map((item) => (
          <ListItem key={item.id}>
            {item.name}
            {item.quantity === 1 ? "" : " x" + item.quantity}
          </ListItem>
        ))}
      </UnorderedList>

      <Button width="100%" size="lg" onClick={handleClick} colorScheme='teal'>
        Отправить
      </Button>
    </>
  );
}

export default ConfirmScreen;
