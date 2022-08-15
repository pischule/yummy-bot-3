import { useState } from "react";
import { nanoid } from "nanoid";

import styles from "./ConfirmScreen.module.css";

import LargeButton from "../UI/LargeButton";
import Card from "../UI/Card";

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

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/order${window.location.search}`,
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
    <div>
      <h1 className={styles.h2}>Ваш заказ:</h1>
      <Card>
        <input
          id="nameInput"
          value={name}
          onChange={handleNameChange}
          className={styles.input}
          placeholder="Введите ваше имя"
        />
        <ul>
          {props.items.map((item) => (
            <li key={item.id}>
              {item.name}
              {item.quantity === 1 ? "" : " x" + item.quantity}
            </li>
          ))}
        </ul>
      </Card>

      <LargeButton onClick={handleClick}>Отправить</LargeButton>
    </div>
  );
}

export default ConfirmScreen;
