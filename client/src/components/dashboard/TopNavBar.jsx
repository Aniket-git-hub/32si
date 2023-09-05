import { Box, Heading, Text, Button, Icon, Flex, Spacer, Avatar, HStack, IconButton } from "@chakra-ui/react"
import { ArrowForwardIcon, BellIcon, StarIcon } from "@chakra-ui/icons"
import { FiBell } from 'react-icons/fi';
import { useAuth } from "../../hooks/useAuth"

function TopNavBar() {
    const { user, remove, setVerifyOTP } = useAuth()
    const { username, name, email } = user
    const handleLogout = () => {
        remove()
    }

    return (
        <Flex as="nav" p=".5rem" pr="1rem" justifyContent="end" alignItems="center">
            <HStack>
                <IconButton variant="ghost" size="sm" icon={<FiBell size="19"/>} ></IconButton>
                <Avatar size="sm" name={name} src='' />
                <Text> sample@gamil.com</Text>
                <Button rightIcon={<ArrowForwardIcon />} size="sm" variant="outline" colorScheme="purple" onClick={handleLogout}>
                    logout
                </Button>
            </HStack>
        </Flex>
    )
}

export default TopNavBar