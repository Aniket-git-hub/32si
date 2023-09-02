import { Box, Heading, Text, Button, Icon, Flex, Spacer, Avatar, HStack } from "@chakra-ui/react"
import { ArrowForwardIcon, StarIcon } from "@chakra-ui/icons"
import { useAuth } from "../hooks/useAuth"

function TopNavBar() {
    const { user, remove, setVerifyOTP } = useAuth()
    const { username, name, email } = user
    const handleLogout = () => {
        remove()
    }

    return (
        <Flex as="nav" bg="gray.100" p=".5rem" justifyContent="space-between" alignItems="center">
            <Heading size="lg">32 Beads</Heading>
            <Spacer></Spacer>
            <HStack>
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