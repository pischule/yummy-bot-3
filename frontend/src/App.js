import { useState, useEffect } from "react";

import MenuScreen from "./components/Menu/MenuScreen";
import ConfirmScreen from "./components/Confirm/ConfirmScreen";
import DoneScreen from "./components/DoneScreen/DoneScreen";
import ErrorModal from "./components/UI/ErrorModal";
import { nanoid } from "nanoid";
import { Container } from "@chakra-ui/react";

function App() {
  const [screen, setScreen] = useState("menu");
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("Загружаю...");
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      let initData = window.Telegram.WebApp.initData;
      initData = initData ? "?" + initData : window.location.search;
      const result = await fetch(
        `${process.env.REACT_APP_API_URL}/menu${initData}`
      );
      if (!result.ok) {
        if (result.status === 404) {
          setTitle("Меню не доступно 🕳");
        } else if (result.status === 403) {
          setTitle("Ошибка авторизации");
        } else {
          setTitle(`Что-то пошло не так 😱`);
        }
        return;
      }

      const json = await result.json();
      const itemsWithQuantity = json.items.map((item) => ({
        id: nanoid(),
        name: item,
        quantity: 0,
      }));
      setItems(itemsWithQuantity);
      setTitle(json.title);
    } catch (err) {
      setTitle("Сервер недоступен 😭");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const updateQuantity = (id, count) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const item = updatedItems.find((item) => item.id === id);
      item.quantity = count;
      return updatedItems;
    });
  };

  const pickRandom = () => {
    setItems((prevItems) => {
      let notSelected = prevItems.filter((itm) => itm.quantity === 0);
      if (notSelected.length === 0) {
        notSelected = prevItems;
      }
      let randomIndex = Math.floor(Math.random() * notSelected.length);
      let randomId = notSelected[randomIndex].id;
      return prevItems.map((itm) =>
        itm.id === randomId
          ? { ...itm, quantity: itm.quantity + 1 }
          : { ...itm }
      );
    });
  };

  const switchToConfirem = () => {
    const selectedItems = items.filter((item) => item.quantity > 0);
    if (selectedItems.length > 0) {
      setScreen("confirm");
    } else {
      setError({
        title: "Заказ пуст",
        message: "выберите хотя бы один пункт",
      });
    }
  };

  const switchToDone = () => {
    setScreen("done");
  };

  const selectedItems = items.filter((item) => item.quantity > 0);

  return (
    <Container my="20px">
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}
      {screen === "menu" && (
        <MenuScreen
          updateQuantity={updateQuantity}
          handleButtonClick={switchToConfirem}
          handleRandomClick={pickRandom}
          items={items}
          title={title}
        />
      )}
      {screen === "confirm" && (
        <ConfirmScreen
          switchToDone={switchToDone}
          items={selectedItems}
          setError={setError}
        />
      )}
      {screen === "done" && <DoneScreen />}
    </Container>
  );
}

export default App;
