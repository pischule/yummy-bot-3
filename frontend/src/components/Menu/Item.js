import AddItemControls from "./AddControls";
import { Badge, Box, Flex, Spacer, Center } from "@chakra-ui/react";

function Item(props) {
  const updateQuantity = (quantity) => {
    props.updateQuantity(props.id, quantity);
  };

  return (
    <Flex width="100%">
      <Box>{props.name}</Box>
      <Spacer />

      {props.quantity > 0 ? (
        <Center>
          <Badge
            mx="8px"
            boxSize="22px"
            alignItems="center"
            borderRadius="full"
            textAlign="center"
          >
            {props.quantity}
          </Badge>
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
