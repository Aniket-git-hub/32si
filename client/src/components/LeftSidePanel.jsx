import { HiOutlineUserGroup, HiOutlineRectangleGroup, } from "react-icons/hi2";
import { IoStatsChartOutline } from 'react-icons/io5'
import { FiSettings } from "react-icons/fi";
import { MdOutlineFeedback } from "react-icons/md";
import { SiAboutdotme } from "react-icons/si";
import {
  Box,
  Center,
  Flex,
  Heading,
  useColorModeValue,
  Text,
  List,
  ListItem,
  VStack,
  Button,
  StackDivider,
  Divider,
  HStack,
} from "@chakra-ui/react";

function LeftSidePanel() {
  const sideBarListItems = [
    { name: "New Game", icon: <HiOutlineRectangleGroup size="20"/> },
    { name: "Rivals", icon: <HiOutlineUserGroup size="20" /> },
    { name: "Stats", icon: <IoStatsChartOutline size="20" /> },
    { name: "Settings", icon: <FiSettings size="20" /> },
  ];

  return (
    <Box minH="100vh" p={3} >
      <VStack>
        <Heading p={5}>32 Beads</Heading>
        <List w="100%">
          {sideBarListItems.map((item, index) => {
            return (
              <ListItem my={2} key={index} _hover={{ bg: "gray.100" }} borderRadius={5}>
                <HStack px={5}>
                  {item.icon}
                  <Text
                    py={2}
                    borderRadius={5}
                  >
                    {item.name}
                  </Text>
                </HStack>
              </ListItem>
            );
          })}
          <Divider orientation='horizontal' />
          <ListItem my={2}>
            <HStack px={5}>
              <SiAboutdotme size="20" />
              <Text
                py={2}
                borderRadius={5}
              >
                About Us
              </Text>
            </HStack>
          </ListItem>
          <ListItem my={2}>
            <HStack px={5}>
              <MdOutlineFeedback size="20" />
              <Text
                py={2}
                borderRadius={5}
              >
                Feedback
              </Text>
            </HStack>
          </ListItem>
        </List>
      </VStack>
    </Box>
  );
}

export default LeftSidePanel;
