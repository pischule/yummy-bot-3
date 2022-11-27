import React from "react";
import PropTypes from "prop-types";
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

import Item from "./Item";

function MenuScreen({ title, items, updateQuantity, handleButtonClick }) {
  const { colorMode, toggleColorMode } = useColorMode();

  const atLeastOneSelected = items.filter((i) => i.quantity > 0).length > 0;

  return (
    <>
      <Flex>
        <Heading>{title}</Heading>
        <Spacer />
        <IconButton
          variant="ghost"
          aria-label="переключить тему"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </Flex>
      <VStack my={4} divider={<StackDivider />}>
        {items.map((item) => (
          <Item
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            updateQuantity={(quantity) => updateQuantity(item.id, quantity)}
          />
        ))}
      </VStack>
      {items.length > 0 && (
        <Button
          disabled={!atLeastOneSelected}
          size="lg"
          colorScheme="teal"
          width="100%"
          onClick={handleButtonClick}
        >
          Заказать
        </Button>
      )}
    </>
  );
}

MenuScreen.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  updateQuantity: PropTypes.func.isRequired,
  handleButtonClick: PropTypes.func.isRequired,
};

export default MenuScreen;
