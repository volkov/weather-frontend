import React from "react";
import {Box, Heading, Flex, Text, Button, Link} from "@chakra-ui/core";
import {Link as ReactLink} from "react-router-dom";
import {ColorModeSwitcher} from "./ColorModeSwitcher";

const MenuItems = ({ children }) => (
    <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
        {children}
    </Text>
);

// Note: This code could be better, so I'd recommend you to understand how I solved and you could write yours better :)
const Header = props => {
    const [show, setShow] = React.useState(false);
    const handleToggle = () => setShow(!show);

    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1rem"
            bg="teal.500"
            color="white"
            {...props}
        >
            <Flex align="center" mr={5}>
                <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
                    Weather
                </Heading>
            </Flex>

            <Box
                display={{ sm: show ? "block" : "none", md: "flex" }}
                width={{ sm: "full", md: "auto" }}
                alignItems="center"
                flexGrow={1}
            >
                <MenuItems><Link to="/" as={ReactLink}>Locations</Link></MenuItems>
            </Box>

            <Box
                display={{ sm: show ? "block" : "none", md: "block" }}
                mt={{ base: 4, md: 0 }}
            >
                <ColorModeSwitcher justifySelf="flex-end" />
            </Box>
        </Flex>
    );
};

export default Header;
