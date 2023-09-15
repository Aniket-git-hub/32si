import { Link, Box, Text, Button, Flex, Avatar, HStack, IconButton, Menu, MenuButton, VStack, MenuList, useColorMode, MenuItem, MenuDivider, useToast, Badge, ModalOverlay, useDisclosure, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, List, ListIcon, ListItem } from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { FiAtSign, FiBell, FiChevronDown } from 'react-icons/fi';
import { useAuth } from "../../hooks/useAuth"
import { NavLink, useNavigate } from 'react-router-dom'
import { logoutUser } from "../../api/auth"
import { useState, useEffect, useRef } from "react";
import { useAllData } from "../../hooks/useAllData";
import { acceptConnection, getAUserById } from "../../api/user";
function TopNavBar() {
    const { user, setUser, remove } = useAuth()
    const { username, name, email } = user
    const alert = useToast()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logoutUser()
            remove()
            alert({
                title: 'Logout Successful',
                // description: "",
                status: 'info',
                duration: 2000,
                isClosable: true,
                position: 'top'
            })
        } catch (error) {
            console.log(error)
        }
    }
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { notifications, setNotifications } = useAllData()

    const handleVisitProfile = async (username) => {
        onClose()
        navigate(`/profile/@${username}`)
    }

    useEffect(() => {
        if (user.connectionRequests?.length !== 0) {
            console.log(user.connectionRequests)
            user.connectionRequests.forEach(username => {
                let notificationsExist = notifications.some(n => n.key === username)
                if (!notificationsExist) {
                    setNotifications(prev => [
                        ...prev,
                        {
                            key: username,
                            message: `${username} wants to connect with you`,
                        }
                    ])
                }
            })
        }
    }, [])

    return (
        <>
            <Flex as="nav" p=".5rem" pr="1rem" justifyContent="end" alignItems="center">
                <HStack spacing={{ base: 0, md: 6 }}>
                    <Button variant="ghost" size="sm" leftIcon={<FiBell size="20" />} onClick={() => onOpen()} >
                        <Badge variant={"subtle"} colorScheme="green">New</Badge>
                    </Button>
                    <Flex alignItems={'center'}>
                        <Menu >
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
                                bg="white"
                                borderColor="gray.200"
                            >
                                <Link as={NavLink} to={`/profile/@${username}`} _hover={{}} >
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

            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)'
                />
                <ModalContent>
                    <ModalHeader>Notifications</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <List spacing={3}>
                            {notifications && notifications.map((item, index) => (
                                <ListItem key={`${item.message}${index}`} _hover={{ bg: "purple.50" }} borderRadius={5} p={3}>
                                    <HStack>
                                        <Text>
                                            {item.message}
                                        </Text>
                                        <Button
                                            onClick={(e) => handleVisitProfile(item.key)}
                                            variant={"outline"}
                                            colorScheme="purple">Visit Profile</Button>
                                    </HStack>
                                </ListItem>
                            ))}
                        </List>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default TopNavBar