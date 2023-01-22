import React, {FC} from "react";
import {Button, Flex, Heading, IconButton, Spacer, StackDivider, useColorMode, VStack,} from "@chakra-ui/react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";

import Item from "./Item.js";
import {ItemType} from "../../services/types";

interface MenuScreenProps {
    title: string,
    items: ItemType[],
    updateQuantity: (id: string, q: number) => void,
    handleButtonClick: () => void
}

const MenuScreen: FC<MenuScreenProps> = ({title, items, updateQuantity, handleButtonClick}) => {
    const {colorMode, toggleColorMode} = useColorMode();

    const atLeastOneSelected = items.filter((i) => i.quantity > 0).length > 0;

    return (
        <>
            <Flex>
                <Heading>{title}</Heading>
                <Spacer/>
                <IconButton
                    variant="ghost"
                    aria-label="переключить тему"
                    icon={colorMode === "light" ? <MoonIcon/> : <SunIcon/>}
                    onClick={toggleColorMode}
                />
            </Flex>
            <VStack my={4} divider={<StackDivider/>}>
                {items.map((item) => (
                    <Item
                        key={item.id}
                        name={item.name}
                        quantity={item.quantity}
                        updateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                    />
                ))}
            </VStack>
            {items.length > 0 && (
                <Button
                    isDisabled={!atLeastOneSelected}
                    size="lg"
                    colorScheme="teal"
                    width="100%"
                    onClick={handleButtonClick}
                >
                    Далее
                </Button>
            )}
        </>
    );
}

export default MenuScreen;
