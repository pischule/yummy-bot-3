import Item from "./Item";

import {
  Button,
  IconButton,
  Heading,
  VStack,
  StackDivider,
  Flex,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";

function MenuScreen(props) {
  const { colorMode, toggleColorMode } = useColorMode();

  const atLeastOneSelected =
    props.items.filter((i) => i.quantity > 0).length > 0;

  return (
    <>
      <Flex>
        <Heading>{props.title}</Heading>
        <Spacer />
        <IconButton
          variant="ghost"
          aria-label="переключить тему"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </Flex>
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
