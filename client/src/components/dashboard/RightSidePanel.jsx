import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Button, Box, HStack, Heading, Input, InputGroup, InputLeftElement, List, ListItem, Stack, VStack, Center, Text, AvatarBadge } from "@chakra-ui/react"
import { FiSearch } from "react-icons/fi"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useAllData } from "../../hooks/useAllData"
import { devPrint } from "../../utils/Helper"
import { getProfilePicture, getSmallProfilePicture, searchUsers } from '../../api/user';
import useDebounce from '../../hooks/useDebounce'
import AvatarWithPreview from '../utils/AvatarWithPreview'
import CustomModal from "../utils/CustomModal"
import FullTextSearchUsers from '../utils/FullTextSearchUsers';

function RightSidePanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { onlineFriends } = useAllData()

  return (
    <Box minH="100%" p={5}>
      <Stack spacing={4}>

        <CustomModal
          size="xl"
          title="Search People"
          trigger={(onOpen) => {
            return (
              <InputGroup>
                <InputLeftElement pointerEvents='none'>
                  <FiSearch color='gray.300' />
                </InputLeftElement>
                <Input type='tel' placeholder='Search People' onClick={onOpen} />
              </InputGroup>
            )
          }}
        >
          <FullTextSearchUsers />
        </CustomModal>

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
