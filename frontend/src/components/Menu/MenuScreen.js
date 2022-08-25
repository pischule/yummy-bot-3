import Item from "./Item";

import { Button, Heading, VStack, StackDivider } from "@chakra-ui/react";

function MenuScreen(props) {
  const atLeastOneSelected =
    props.items.filter((i) => i.quantity > 0).length > 0;

  return (
    <>
      <Heading>{props.title}</Heading>
      <VStack my={4} divider={<StackDivider />}>
        {props.items.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            quantity={item.quantity}
            updateQuantity={props.updateQuantity}
          />
        ))}
      </VStack>
      {props.items.length > 0 && (
        <Button
          disabled={!atLeastOneSelected}
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
