import { Link, Box, Text, Button, Flex, Avatar, HStack, IconButton, Menu, MenuButton, VStack, MenuList, useColorMode, MenuItem, MenuDivider } from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { FiAtSign, FiBell, FiChevronDown } from 'react-icons/fi';
import { useAuth } from "../../hooks/useAuth"
import { NavLink } from 'react-router-dom'

function TopNavBar() {
    const { user, remove } = useAuth()
    const { username, name, email } = user
    const handleLogout = () => {
        remove()
    }

    return (
        <Flex as="nav" p=".5rem" pr="1rem" justifyContent="end" alignItems="center">
            <HStack spacing={{ base: 0, md: 6 }}>
                <IconButton variant="ghost" size="sm" icon={<FiBell size="20" />} ></IconButton>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton transition={'all .3s'} _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar size={'sm'} src="https://source.unsplash.com/random/200x200/?gril" />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems='flex-start'
                                    spacing='1px'
                                    ml="2">
                                    <Text fontSize="sm"> {username}</Text>
                                    <Text fontSize="xs"> {name} </Text>
                                </VStack>
                                <Box display={{ base: "none", md: "flex" }}>
                                    <FiChevronDown /> 
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg=""
                            borderColor="gray.200"
                        >
                            <Link as={NavLink} to="/profile/" _hover={{}} >
                                <MenuItem>
                                    Profile
                                </MenuItem>
                            </Link>
                            <Link as={NavLink} to="/settings" _hover={{}} >
                            <MenuItem>
                                Settings
                            </MenuItem>
                            </Link>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout}>
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    )
}

export default TopNavBar