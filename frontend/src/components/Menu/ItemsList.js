import { StackDivider, VStack } from "@chakra-ui/react";
import Item from "./Item";

function ItemList(props) {

  return (
    <VStack my={4} divider={<StackDivider/>}>
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
  );
}

export default ItemList;
