import AddItemControls from "./AddControls";
import { Box, Flex, Spacer, Center, Circle } from "@chakra-ui/react";

function Item(props) {
  const updateQuantity = (quantity) => {
    props.updateQuantity(props.id, quantity);
  };

  return (
    <Flex width="100%">
      <Center mr='4px' as="span">{props.name}</Center>
      <Spacer />
      {props.quantity > 0 ? (
        <Center>
          <Circle w="22px" h="22px" mx="8px" bg="teal" color="white">
            <Box as="span" fontWeight="bold" fontSize="sm">
              {props.quantity}
            </Box>
          </Circle>
        </Center>
      ) : null}
      <AddItemControls
        updateQuantity={updateQuantity}
        quantity={props.quantity}
      />
    </Flex>
  );
}

export default Item;
