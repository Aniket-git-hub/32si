import { AvatarBadge, Box, Center, HStack, Heading, Input, InputGroup, InputLeftElement, List, ListItem, Stack, Text } from "@chakra-ui/react";
import React from 'react';
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getProfilePicture, getSmallProfilePicture } from '../../api/user';
import { useAllData } from "../../hooks/useAllData";
import { useAuth } from "../../hooks/useAuth";
import AvatarWithPreview from '../utils/AvatarWithPreview';
import CustomModal from "../utils/CustomModal";
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
                  smallURL={getSmallProfilePicture(friend?.profilePhoto)}
                  largeURL={getProfilePicture(friend?.profilePhoto)}
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
