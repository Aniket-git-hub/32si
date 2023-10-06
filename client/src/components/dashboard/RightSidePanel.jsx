import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Box, HStack, Heading, Input, InputGroup, InputLeftElement, List, ListItem, Stack, VStack, Center, Text, AvatarBadge } from "@chakra-ui/react"
import { FiSearch } from "react-icons/fi"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useAllData } from "../../hooks/useAllData"
import { devPrint } from "../../utils/Helper"
import { getProfilePicture, getSmallProfilePicture, searchUsers } from '../../api/user';
import useDebounce from '../../hooks/useDebounce'
import AvatarWithPreview from '../utils/AvatarWithPreview'

function RightSidePanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { onlineFriends } = useAllData()

  const [searchResults, setSearchResults] = useState([]);
  const [inputValue, setInputValue] = useState('')

  let abortController = new AbortController();

  const handleSearch = async (value, user) => {
    if (abortController) abortController.abort();

    abortController = new window.AbortController();
    console.log(value)
    try {
      const query = { query: value, page: 1, limit: 10 };
      if (user && user.location && user.location.coordinates) {
        query.longitude = user.location.coordinates[0];
        query.latitude = user.location.coordinates[1];
      }
      const response = await searchUsers(query, abortController.signal);
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const debounceValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    if (debounceValue.length >= 3) {
      handleSearch(debounceValue)
    }
  }, [debounceValue])

  useEffect(() => {
    return () => {
      if (abortController) abortController.abort();
    };
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
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
                <AvatarWithPreview
                  size={"sm"}
                  name={friend?.name}
                  smallURL={getSmallProfilePicture(friend?.profilePicture)}
                  largeURL={getProfilePicture(friend?.profilePicture)}
                >
                  {onlineFriends?.includes(friend._id) && (
                    <AvatarBadge boxSize='1.25em' bg='green.500' title={`${friend.username} is online`} ></AvatarBadge>
                  )}
                </AvatarWithPreview>
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
