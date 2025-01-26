import {
  Badge,
  Box,
  Divider,
  HStack,
  Heading,
  Link,
  List,
  ListItem,
  Text,
  VStack,
  useColorModeValue
} from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { HiOutlineRectangleGroup, HiOutlineUserGroup } from "react-icons/hi2";
import { IoStatsChartOutline } from "react-icons/io5";
import { MdOutlineFeedback } from "react-icons/md";
import { SiAboutdotme } from "react-icons/si";
import { NavLink } from "react-router-dom";

function LeftSidePanel() {
  const sideBarListItems = [
    { name: "New Game", icon: <HiOutlineRectangleGroup size="20" />, path: "/" },
    { name: "Rivals", icon: <HiOutlineUserGroup size="20" />, path: "/rivals" },
    { name: "Stats", icon: <IoStatsChartOutline size="20" />, path: "/stats" },
    { name: "Settings", icon: <FiSettings size="20" />, path: "/settings" },
  ];

  const hoverColor = useColorModeValue("gray.100", "gray.700")

  return (
    <Box minH="100vh" p={3}>
      <VStack>
        <Heading p={5}>32 Beads
          <Badge colorScheme='purple'>Alpha</Badge>
        </Heading>
        <List w="100%">
          {sideBarListItems.map((item, index) => {
            return (
              <ListItem
                my={2}
                key={index}
                _hover={{ bg: hoverColor }}
                borderRadius={5}
              >
                <Link as={NavLink} to={item.path} _activeLink={{ fontWeight: "bold", fontSize: "lg" }} _hover={{}}>
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
          <ListItem my={2} _hover={{ bg: hoverColor }} borderRadius={5}>
            <Link as={NavLink} to="/about-us" _activeLink={{ fontWeight: "bold", fontSize: "lg" }} _hover={{}}>
              <HStack px={5}>
                <SiAboutdotme size="20" />
                <Text py={2} borderRadius={5}>
                  About Us
                </Text>
              </HStack>
            </Link>
          </ListItem>
          <ListItem my={2} _hover={{ bg: hoverColor }} borderRadius={5}>
            <Link as={NavLink} to="/feedback" _activeLink={{ fontWeight: "bold", fontSize: "lg" }} _hover={{}}>
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
