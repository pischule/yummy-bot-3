import React, {FC} from "react";
import {Box, Button, ButtonGroup, Center, Circle, IconButton,} from "@chakra-ui/react";
import {AddIcon, MinusIcon} from "@chakra-ui/icons";


interface Props {
    quantity: number,
    updateQuantity: (q: number) => void
}

const AddItemControls: FC<Props> = ({quantity, updateQuantity}) => {
    return (
        <Center>
            <Circle
                visibility={quantity === 0 ? "hidden" : "visible"}
                size="22px"
                mx="8px"
                bg="blue.500"
                color="white"
            >
                <Box as="span" fontWeight="bold" fontSize="sm">
                    {quantity}
                </Box>
            </Circle>
            <ButtonGroup w="90px" size="sm">
                {quantity === 0 ? (
                    <Button onClick={() => updateQuantity(quantity + 1)}>Добавить</Button>
                ) : (
                    <>
                        <IconButton
                            width="50%"
                            aria-label="удалить"
                            icon={<MinusIcon/>}
                            onClick={() => updateQuantity(quantity - 1)}
                        />
                        <IconButton
                            width="50%"
                            aria-label="добавить"
                            icon={<AddIcon/>}
                            onClick={() => updateQuantity(quantity + 1)}
                        />
                    </>
                )}
            </ButtonGroup>
        </Center>
    );
}

export default AddItemControls;
