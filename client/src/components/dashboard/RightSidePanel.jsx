import React, { useState } from 'react';
import { Avatar, Box, HStack, Heading, Input, InputGroup, InputLeftElement, List, ListItem, Stack, VStack, Center, Text, AvatarBadge } from "@chakra-ui/react"
import { FiSearch } from "react-icons/fi"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useAllData } from "../../hooks/useAllData"
import { devPrint } from "../../utils/Helper"
import { searchUsers } from '../../api/user';

function RightSidePanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { onlineFriends } = useAllData()

  // Added state for searchQuery and searchResults
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0);

  const handleSearch = async () => {
    try {
      console.log(searchQuery)
      const response = await searchUsers({ query: searchQuery })
      const data = await response.data.users
      setSearchResults(data.users);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue.length < 3) {
      return;
    }

    clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => {
      setSearchQuery(inputValue);
      handleSearch();
    }, 500));
  };

  return (
    <Box minH="100%" p={5}>
      <Stack spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <FiSearch color='gray.300' />
          </InputLeftElement>
          <Input type='tel' placeholder='Search People' onChange={handleInputChange} />
        </InputGroup>

        <Heading size={"md"}> Allies </Heading>
        <List>
          {user.friends && user.friends.map(friend => (
            <ListItem key={friend._id} _hover={{ bg: "gray.100", cursor: "pointer" }} px={3} py={2} borderRadius={5}
              onClick={() => navigate(`/profile/@${friend.username}`, { state: { friend } })}
            >
              <HStack>
                <Avatar src={friend?.profilePicture} size={"sm"} name={friend?.name}>
                  {onlineFriends?.includes(friend._id) && (
                    <AvatarBadge boxSize='1.25em' bg='green.500' title={`${friend.username} is online`} ></AvatarBadge>
                  )}
                </Avatar>
                <Center>
                  <Text>  {friend?.username}</Text>
                </Center>
              </HStack>
            </ListItem>
          ))}
        </List>

      </Stack>
    </Box>
  )
}

export default RightSidePanel;
