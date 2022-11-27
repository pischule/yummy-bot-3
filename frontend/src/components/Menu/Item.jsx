import React from "react";
import PropTypes from "prop-types";
import { Flex, Spacer, Center } from "@chakra-ui/react";
import AddItemControls from "./AddControls";

function Item({ name, quantity, updateQuantity }) {
  return (
    <Flex width="100%">
      <Center as="span">{name}</Center>
      <Spacer />
      <AddItemControls updateQuantity={updateQuantity} quantity={quantity} />
    </Flex>
  );
}

Item.propTypes = {
  name: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  updateQuantity: PropTypes.func.isRequired,
};

export default Item;
