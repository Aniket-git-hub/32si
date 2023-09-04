import { HiOutlineUserGroup, HiOutlineRectangleGroup } from "react-icons/hi2";
import { IoStatsChartOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { MdOutlineFeedback } from "react-icons/md";
import { SiAboutdotme } from "react-icons/si";
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  VStack,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { Link, Navigate } from "react-router-dom";

function LeftSidePanel() {
  const sideBarListItems = [
    { name: "New Game", icon: <HiOutlineRectangleGroup size="20" />, path: "/" },
    { name: "Rivals", icon: <HiOutlineUserGroup size="20" />, path: "/rivals" },
    { name: "Stats", icon: <IoStatsChartOutline size="20" />, path: "/stats" },
    { name: "Settings", icon: <FiSettings size="20" />, path: "/settings" },
  ];

  return (
    <Box minH="100vh" p={3}>
      <VStack>
        <Heading p={5}>32 Beads</Heading>
        <List w="100%">
          {sideBarListItems.map((item, index) => {
            return (
              <ListItem
                my={2}
                key={index}
                _hover={{ bg: "gray.100" }}
                borderRadius={5}
              >
                <Link to={item.path}>
                  <HStack px={5}>
                    {item.icon}
                    <Text py={2} borderRadius={5}>
                      {item.name}
                    </Text>
                  </HStack>
                </Link>
              </ListItem>
            );
          })}
          <Divider orientation="horizontal" />
          <ListItem my={2}>
            <Link to="/about-us">
              <HStack px={5}>
                <SiAboutdotme size="20" />
                <Text py={2} borderRadius={5}>
                  About Us
                </Text>
              </HStack>
            </Link>
          </ListItem>
          <ListItem my={2}>
            <Link to="/feedback">
              <HStack px={5}>
                <MdOutlineFeedback size="20" />
                <Text py={2} borderRadius={5}>
                  Feedback
                </Text>
              </HStack>
            </Link>
          </ListItem>
        </List>
      </VStack>
    </Box>
  );
}

export default LeftSidePanel;
