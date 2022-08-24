import ItemList from "./ItemsList";

import { Button, Heading } from "@chakra-ui/react";

function MenuScreen(props) {
  return (
    <>
      <Heading>{props.title}</Heading>
      <ItemList items={props.items} updateQuantity={props.updateQuantity} />
      {props.items.length > 0 && (
        <Button
          size="lg"
          colorScheme="teal"
          width="100%"
          onClick={props.handleButtonClick}
        >
          Заказать
        </Button>
      )}
    </>
  );
}

export default MenuScreen;
