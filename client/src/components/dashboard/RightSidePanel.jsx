import { AvatarBadge, Box, Center, Flex, Heading, IconButton, Input, InputGroup, InputLeftElement, List, ListItem, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import React from 'react';
import { FiMessageCircle, FiSearch } from "react-icons/fi";
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
  const hoverColor = useColorModeValue("gray.100", "gray.700")

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
            <ListItem
              key={friend._id}
              _hover={{ bg: hoverColor, cursor: "pointer" }}
              px={3}
              py={2}
              borderRadius={5}
            >
              <Flex justifyContent={"space-between"}>
                <Center onClick={() => navigate(`/profile/@${friend.username}`, { state: { friend } })}>
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
                  <Text ml={2}>  {friend?.username}</Text>
                </Center>
                <IconButton _hover={{}} variant={"ghost"} icon={<FiMessageCircle />} onClick={() => navigate(`/chat/${friend.username}`)} />
              </Flex>
            </ListItem>
          ))}
        </List>

      </Stack>
    </Box>
  )
}

export default RightSidePanel;
