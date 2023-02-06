import React, {FC} from "react";
import {Center, Flex, Spacer} from "@chakra-ui/react";
import AddItemControls from "./AddControls.js";

interface Props {
    updateQuantity: (q: number) => void,
    name: string,
    quantity: number
}

const Item: FC<Props> = ({name, quantity, updateQuantity}) => {
    return (
        <Flex width="100%">
            <Center as="span">{name}</Center>
            <Spacer/>
            <AddItemControls updateQuantity={updateQuantity} quantity={quantity}/>
        </Flex>
    );
}

export default Item;
