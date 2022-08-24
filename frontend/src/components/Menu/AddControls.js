import { Button, ButtonGroup } from "@chakra-ui/react";
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
    <ButtonGroup w="90px" size="sm">
      {quantity === 0 ? (
        <Button onClick={increment}>Добавить</Button>
      ) : (
        <>
          <Button width="50%" onClick={decrement}>
            <MinusIcon />
          </Button>
          <Button width="50%" onClick={increment}>
            <AddIcon />
          </Button>
        </>
      )}
    </ButtonGroup>
  );
}

export default AddItemControls;
