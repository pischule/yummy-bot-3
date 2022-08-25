import AddItemControls from "./AddControls";
import { Flex, Spacer, Center } from "@chakra-ui/react";

function Item(props) {
  const updateQuantity = (quantity) => {
    props.updateQuantity(props.id, quantity);
  };

  return (
    <Flex width="100%">
      <Center as="span">{props.name}</Center>
      <Spacer />
      <AddItemControls
        updateQuantity={updateQuantity}
        quantity={props.quantity}
      />
    </Flex>
  );
}

export default Item;
