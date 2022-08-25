import {
  Button,
  ButtonGroup,
  Center,
  IconButton,
  Circle,
  Box,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

function AddItemControls(props) {
  const quantity = props.quantity;

  const increment = () => {
    props.updateQuantity(quantity + 1);
  };

  const decrement = () => {
    props.updateQuantity(quantity - 1);
  };

  return (
    <Center>
      <Circle
        visibility={props.quantity === 0 ? "hidden" : "visible"}
        w="22px"
        h="22px"
        mx="8px"
        bg="teal"
        color="white"
      >
        <Box as="span" fontWeight="bold" fontSize="sm">
          {props.quantity}
        </Box>
      </Circle>
      <ButtonGroup w="90px" size="sm">
        {quantity === 0 ? (
          <Button onClick={increment}>Добавить</Button>
        ) : (
          <>
            <IconButton
              width="50%"
              aria-label="удалить"
              icon={<MinusIcon />}
              onClick={decrement}
            />
            <IconButton
              width="50%"
              aria-label="добавить"
              icon={<AddIcon />}
              onClick={increment}
            />
          </>
        )}
      </ButtonGroup>
    </Center>
  );
}

export default AddItemControls;
