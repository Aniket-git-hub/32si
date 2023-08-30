import { useAuth } from "../hooks/useAuth"
import { Box, Heading, Text, Button, Icon } from "@chakra-ui/react"
import { StarIcon } from "@chakra-ui/icons"

export default function HomePage() {
  const { user, isAuthenticated, remove } = useAuth()
  const { username, name, email } = user
  const handleLogout = () => {
    console.log(user, isAuthenticated)
    remove()
    console.log(user, isAuthenticated)

  }
  return (
    <Box p={4}>
      <Text fontSize="xl" color="gray.600">
        {isAuthenticated ? "You are logged in" : "You are not logged in"}
      </Text>
      <Box display="flex" alignItems="center" mt={4}>
        <Icon as={StarIcon} w={8} h={8} mr={4} />
        <Box>
          <Heading as="h2" fontSize="2xl">{username}</Heading>
          <Text fontSize="lg">{name}</Text>
          <Text fontSize="lg">{email}</Text>
        </Box>
      </Box>
      <Button colorScheme="red" mt={4} onClick={() => handleLogout()}>Logout</Button>

    </Box>
  )
}
