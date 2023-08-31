import { useAuth } from "../hooks/useAuth"
import { Box, Heading, Text, Button, Icon, Flex, Spacer, Avatar, HStack } from "@chakra-ui/react"
import { StarIcon } from "@chakra-ui/icons"

export default function HomePage() {
  const { user, remove } = useAuth()
  const { username, name, email } = user
  const handleLogout = () => {
    remove()
  }
  return (
    <Flex as="nav" bg="gray.100" p=".5rem" minW="100vw" justifyContent="space-between" alignItems="center">
      <Heading size="lg">32 Beads</Heading>
      <Spacer></Spacer>
      <HStack>
        <Avatar size="sm" name={name} src='' />
        <Text> sample@gamil.com</Text>
        <Button size="sm" variant="outline" colorScheme="purple" onClick={handleLogout}>
          logout
        </Button>
      </HStack>
    </Flex>
  )
}
