import { Button, ButtonGroup } from "@chakra-ui/react";

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
            -
          </Button>
          <Button width="50%" onClick={increment}>
            +
          </Button>
        </>
      )}
    </ButtonGroup>
  );
}

export default AddItemControls;
