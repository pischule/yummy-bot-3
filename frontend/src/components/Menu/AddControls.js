import { Button, ButtonGroup, Center, IconButton } from "@chakra-ui/react";
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
      <ButtonGroup w="90px" size="sm">
        {quantity === 0 ? (
          <Button onClick={increment}>Добавить</Button>
        ) : (
          <>
            <IconButton
              width="50%"
              aria-label="add-item"
              icon={<MinusIcon />}
              onClick={decrement}
            />
            <IconButton
              width="50%"
              aria-label="remove-item"
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
