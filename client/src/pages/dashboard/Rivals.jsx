import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    Center,
    Flex,
    Heading,
    SimpleGrid,
    Text,
    VStack,
    Skeleton,
    HStack
} from "@chakra-ui/react";
import { MdVerified, MdRefresh } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getProfilePicture } from "../../api/user";
import { useAllData } from "../../hooks/useAllData";

export default function Rivals() {
    const { rivals, setRivals, page, setPage, hasMore, setHasMore } = useAllData();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const observer = useRef();

    const lastItemRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore, setPage]
    );

    useEffect(() => {
        const controller = new AbortController();

        const loadData = async () => {
            try {
                setLoading(true);
                const response = await getAllUsers({ page, limit: 10 }, controller.signal);
                setHasMore(response.data.hasMore);
                setRivals((prev) => [...prev, ...response.data.users]);
            } catch (error) {
                if (error.code !== "ERR_CANCELED") {
                    console.log(error);
                }
            } finally {
                setLoading(false);
            }
        }

        if (hasMore) {
            loadData();
        }

        return () => {
            controller.abort();
        }
    }, [page, setHasMore, setRivals, hasMore]);

    return (
        <>
            <Flex justifyContent={"space-between"}>
                <Heading size={"lg"}>Rivals</Heading>
                <Button
                    variant={"ghost"}
                    _hover={{}}
                    title="refresh"
                    icon={<MdRefresh />}
                    onClick={() => setPage((prev) => prev + 1)}
                />
            </Flex>
            <SimpleGrid minChildWidth={"250px"} spacing={"10px"} p={5}>
                {rivals.map((user, index) => (
                    <Box key={user._id} my={2} ref={index === rivals.length - 1 ? lastItemRef : null}>
                        <Card w={"250px"}>
                            <CardBody>
                                <VStack>
                                    <Avatar
                                        size={"xl"}
                                        src={user.profilePhoto && getProfilePicture(user.profilePhoto)}
                                        name={user.username}
                                    />
                                    <Heading size={"sm"}>
                                        <Button
                                            variant={"ghost"}
                                            _hover={{}}
                                            rightIcon={<MdVerified />}
                                            _active={{}}
                                        >
                                            {user.username}
                                        </Button>
                                    </Heading>
                                    <Text>{user.name}</Text>
                                    <Text>{user.bio}</Text>
                                    <Button
                                        variant={"ghost"}
                                        onClick={() => navigate(`/profile/@${user.username}`)}
                                    >
                                        View Profile
                                    </Button>
                                </VStack>
                            </CardBody>
                        </Card>
                    </Box>
                ))}
                {loading && (
                    <Center>
                        <HStack spacing={"10px"} p={5}>
                            {[...Array(3)].map((_, index) => (
                                <Box
                                    key={index}
                                    my={2}
                                    boxShadow={"lg"}
                                    p={4}
                                    bg={"white"}
                                    borderRadius={5}
                                >
                                    <Skeleton width={"200px"} height={"250px"} />
                                </Box>
                            ))}
                        </HStack>
                    </Center>
                )}
            </SimpleGrid>
        </>
    );
}
