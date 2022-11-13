import AddItemControls from "./AddControls";
import { Flex, Spacer, Center } from "@chakra-ui/react";

function Item({ name, quantity, updateQuantity }) {
  return (
    <Flex width="100%">
      <Center as="span">{name}</Center>
      <Spacer />
      <AddItemControls updateQuantity={updateQuantity} quantity={quantity} />
    </Flex>
  );
}

export default Item;
