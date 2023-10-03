import { Avatar, Badge, Box, Button, Flex, HStack, IconButton, Link, List, ListItem, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, VStack, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { FiBell, FiChevronDown } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from "../../api/auth";
import { useAllData } from "../../hooks/useAllData";
import { useAuth } from "../../hooks/useAuth";
import { getProfilePicture, getSmallProfilePicture } from "../../api/user";
import AvatarWithPreview from "../utils/AvatarWithPreview";
function TopNavBar() {
    const { user, setUser, remove } = useAuth()
    const { resetData } = useAllData()
    const { username, name, email, profilePhoto } = user
    const alert = useToast()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logoutUser()
        } catch (error) {
            console.log(error)
        } finally {
            remove()
            resetData()
            alert({
                title: 'Logout Successful',
                // description: "",
                status: 'info',
                duration: 2000,
                isClosable: true,
                position: 'top'
            })
        }
    }
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { notifications, setNotifications } = useAllData()

    const handleVisitProfile = async (username) => {
        onClose()
        navigate(`/profile/@${username}`)
    }
    const handleClickOnNotificationItem = (action) => {
        if (action.redirect) {
            console.log(action.redirect)
            onClose()
            navigate(`/profile/@${action.redirect}`)
        }
    }

    useEffect(() => {
        if (user.connectionRequests?.length !== 0) {
            user.connectionRequests.forEach(username => {
                let notificationsExist = notifications.some(n => n.key === username)
                if (!notificationsExist) {
                    setNotifications(prev => [
                        ...prev,
                        {
                            key: username,
                            message: `${username} wants to connect with you`,
                            action: { redirect: username }
                        }
                    ])
                }
            })
        }
        return () => {
            setNotifications([])
        }
    }, [user.connectionRequests])

    return (
        <>
            <Flex as="nav" p=".5rem" pr="1rem" justifyContent="end" alignItems="center">
                <HStack spacing={{ base: 0, md: 6 }}>
                    <IconButton variant="ghost" size="sm" position={"relative"} leftIcon={<FiBell size="20" />} onClick={() => onOpen()} >
                        {
                            notifications.length > 0 &&
                            <Badge colorScheme="red" variant="solid" aspectRatio={"1/1"} borderRadius={"1000px"} style={{
                                position: "absolute",
                                top: "10px",
                                right: "5px",
                                fontSize: "10px",
                                fontStyle: "regular",
                                fontWeight: "lighter",
                            }}>
                                {notifications.length}
                            </Badge>
                        }
                    </IconButton>
                    <Flex alignItems={'center'}>
                        <Menu >
                            <MenuButton transition={'all .3s'} _focus={{ boxShadow: 'none' }}>
                                <HStack>
                                    <AvatarWithPreview
                                        size={"sm"}
                                        smallURL={getSmallProfilePicture(user.profilePhoto)}
                                        largeURL={getProfilePicture(user.profilePhoto)}
                                        name={user.username}
                                    />
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
                                <ListItem
                                    onClick={(e) => handleClickOnNotificationItem(item?.action)}
                                    key={`${item.message}${index}`}
                                    _hover={{ bg: "purple.50" }}
                                    borderRadius={5} p={3}
                                >
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
                        <Button variant={"outline"} colorScheme="purple" isDisabled={!notifications.length} onClick={() => setNotifications([])}>Clear</Button>
                        <Spacer />
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default TopNavBar