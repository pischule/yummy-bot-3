import AddItemControls from "./AddControls";
import { Box, Flex, Spacer, Center, Circle } from "@chakra-ui/react";

function Item(props) {
  const updateQuantity = (quantity) => {
    props.updateQuantity(props.id, quantity);
  };

  return (
    <Flex width="100%">
      <Center as="span">
        {props.name}
      </Center>
      <Spacer />
      <Center>
        <Circle
          visibility={props.quantity === 0 ? 'hidden' : 'visible'}
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
      </Center>
      <AddItemControls
        updateQuantity={updateQuantity}
        quantity={props.quantity}
      />
    </Flex>
  );
}

export default Item;
