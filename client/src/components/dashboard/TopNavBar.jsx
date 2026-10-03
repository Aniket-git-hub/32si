import { Box, Flex, Heading, HStack, IconButton, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, VStack, useColorModeValue, useToast } from "@chakra-ui/react";
import { FiChevronDown, FiMenu, FiUsers } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { logoutUser } from "../../api/auth";
import { getProfilePicture, getSmallProfilePicture } from "../../api/user";
import { useAllData } from "../../hooks/useAllData";
import { useAuth } from "../../hooks/useAuth";
import AvatarWithPreview from "../utils/AvatarWithPreview";
import NotificationButton from "../utils/NotificationButton";
import ThemeToggleButton from "../utils/ThemeToggleButton";
function TopNavBar({ onOpenMenu, onOpenAllies }) {
    const { user, remove } = useAuth()
    const { resetData } = useAllData()
    const { username, name } = user
    const alert = useToast()

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
    const menuBgColor = useColorModeValue("white", "gray.700")

    return (
        <>
            <Flex as="nav" p=".5rem" pr="1rem" justifyContent="space-between" alignItems="center">
                <HStack display={{ base: "flex", lg: "none" }} spacing={1}>
                    <IconButton variant="ghost" aria-label="Open menu" icon={<FiMenu size={22} />} onClick={onOpenMenu} />
                    <Link as={NavLink} to="/" _hover={{}}>
                        <Heading size="md">32 Beads</Heading>
                    </Link>
                </HStack>
                <Box display={{ base: "none", lg: "block" }} />
                <HStack spacing={{ base: 0, md: 4 }}>
                    <IconButton
                        display={{ base: "none", lg: "flex", xl: "none" }}
                        variant="ghost"
                        aria-label="Show allies"
                        icon={<FiUsers size={20} />}
                        onClick={onOpenAllies}
                    />
                    <ThemeToggleButton />
                    <NotificationButton />

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
                                bg={menuBgColor}
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
        </>
    )
}

export default TopNavBar