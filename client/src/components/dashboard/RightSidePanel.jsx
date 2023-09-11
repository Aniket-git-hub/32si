import { PhoneIcon } from "@chakra-ui/icons"
import { Avatar, Box, HStack, Heading, Input, InputGroup, InputLeftElement, List, ListItem, Stack, VStack, Center, Text, AvatarBadge } from "@chakra-ui/react"
import { FiSearch } from "react-icons/fi"
import { useAuth } from "../../hooks/useAuth"

function RightSidePanel() {
  const { user } = useAuth()

  return (
    <Box minH="100%" p={5}>
      <Stack spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <FiSearch color='gray.300' />
          </InputLeftElement>
          <Input type='tel' placeholder='Search People' />
        </InputGroup>
        <Heading size={"md"}> Friends </Heading>
        <List>
          {user.friends && user.friends.map(friend => (
            <ListItem _hover={{ bg: "gray.100", cursor:"pointer"}} px={3} py={2} borderRadius={5} >  
              <HStack>
                <Avatar src={friend?.profilePicture} size={"sm"} name={friend?.name}>
                  {/* <AvatarBadge boxSize='1.25em' bg='green.500' ></AvatarBadge> */}
                </Avatar>
                <Center>
                  <Text>@{ friend?.username }</Text>
                </Center>
              </HStack>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Box>
  )
}

export default RightSidePanel