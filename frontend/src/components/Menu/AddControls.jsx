import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  ButtonGroup,
  Center,
  IconButton,
  Circle,
  Box,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

function AddItemControls({ quantity, updateQuantity }) {
  return (
    <Center>
      <Circle
        visibility={quantity === 0 ? "hidden" : "visible"}
        w="22px"
        h="22px"
        mx="8px"
        bg="teal"
        color="white"
      >
        <Box as="span" fontWeight="bold" fontSize="sm">
          {quantity}
        </Box>
      </Circle>
      <ButtonGroup w="90px" size="sm">
        {quantity === 0 ? (
          <Button onClick={() => updateQuantity(quantity + 1)}>Добавить</Button>
        ) : (
          <>
            <IconButton
              width="50%"
              aria-label="удалить"
              icon={<MinusIcon />}
              onClick={() => updateQuantity(quantity - 1)}
            />
            <IconButton
              width="50%"
              aria-label="добавить"
              icon={<AddIcon />}
              onClick={() => updateQuantity(quantity + 1)}
            />
          </>
        )}
      </ButtonGroup>
    </Center>
  );
}

AddItemControls.propTypes = {
  quantity: PropTypes.number.isRequired,
  updateQuantity: PropTypes.func.isRequired,
};

export default AddItemControls;
