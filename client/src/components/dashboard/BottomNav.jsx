import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { FiSettings, FiUsers } from "react-icons/fi";
import { HiOutlineRectangleGroup, HiOutlineUserGroup } from "react-icons/hi2";
import { IoStatsChartOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const ITEMS = [
    { label: "Play", icon: HiOutlineRectangleGroup, to: "/", end: true },
    { label: "Rivals", icon: HiOutlineUserGroup, to: "/rivals" },
    { label: "Stats", icon: IoStatsChartOutline, to: "/stats" },
    { label: "Settings", icon: FiSettings, to: "/settings" },
];

/** Tab bar for phones and small tablets. */
export default function BottomNav({ onOpenAllies }) {
    const bg = useColorModeValue("white", "gray.800");
    const border = useColorModeValue("gray.200", "gray.700");
    const active = useColorModeValue("purple.600", "purple.300");
    const idle = useColorModeValue("gray.500", "gray.400");

    const itemStyle = (isActive) => ({
        flex: 1,
        direction: "column",
        align: "center",
        justify: "center",
        gap: "2px",
        py: 2,
        color: isActive ? active : idle,
        fontWeight: isActive ? "bold" : "normal",
    });

    return (
        <Box
            as="nav"
            aria-label="Main"
            display={{ base: "block", lg: "none" }}
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            zIndex="sticky"
            bg={bg}
            borderTopWidth="1px"
            borderColor={border}
            pb="env(safe-area-inset-bottom)"
        >
            <Flex>
                {ITEMS.map(({ label, icon: Icon, to, end }) => (
                    <NavLink key={to} to={to} end={end} style={{ flex: 1 }}>
                        {({ isActive }) => (
                            <Flex {...itemStyle(isActive)}>
                                <Icon size={22} />
                                <Text fontSize="xs">{label}</Text>
                            </Flex>
                        )}
                    </NavLink>
                ))}
                <Flex as="button" type="button" onClick={onOpenAllies} {...itemStyle(false)}>
                    <FiUsers size={22} />
                    <Text fontSize="xs">Allies</Text>
                </Flex>
            </Flex>
        </Box>
    );
}
