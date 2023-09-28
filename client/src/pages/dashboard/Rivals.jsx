import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    Center,
    Flex,
    HStack,
    Heading,
    SimpleGrid,
    Skeleton,
    Text,
    VStack
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from "react";
import { MdVerified, MdRefresh } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getProfilePicture } from "../../api/user";
import { useAllData } from "../../hooks/useAllData";
import { IconBase } from 'react-icons/lib';
export default function Rivals() {
    const { rivals, setRivals } = useAllData()
    const { page, setPage, hasMore, setHasMore, pageLoaded, setPageLoaded } = useAllData()
    const [loading, setLoading] = useState(false)
    const observer = useRef()
    const navigate = useNavigate();
    const lastItemRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading])

    useEffect(() => {
        const controller = new AbortController()
        const loadData = async () => {
            try {
                setLoading(true)
                const response = await getAllUsers({ page, limit: 10 }, controller.signal)
                setHasMore(response.data.hasMore)
                setPageLoaded(prev => [...prev, response.data.page])
                setRivals(prev => [...prev, ...response.data.users])
            } catch (error) {
                if (error.code !== 'ERR_CANCELED') {
                    console.log(error)
                }
            } finally {
                setLoading(false)
            }
        }
        if (hasMore && !pageLoaded.includes(page)) {
            loadData()
        }
        return () => {
            controller.abort()
        }
    }, [page])

    return (
        <>
            <Flex justifyContent={'space-between'}>
                <Heading size={'lg'}>Rivals</Heading>
                <IconBase variant={'ghost'} _hover={{}} title="refresh" icon={<MdRefresh />} onClick={() => loadUsers()} />
            </Flex>
            <SimpleGrid minChildWidth={'250px'} spacing={'10px'} p={5}>
                {
                    rivals.map((user, index) => {
                        if (rivals.length === index + 1) {
                            return (
                                <Box my={2} key={user._id} ref={lastItemRef} >
                                    <Card w={'250px'}>
                                        <CardBody>
                                            <VStack>
                                                <Avatar size={'xl'} src={getProfilePicture(user.profilePhoto)} name={user.username} />
                                                <Heading size={'sm'}>
                                                    <Button variant={'ghost'} _hover={{}} rightIcon={<MdVerified />} _active={{}}>
                                                        {user.username}
                                                    </Button>
                                                </Heading>
                                                <Text>{user.name}</Text>
                                                <Text>{user.bio}</Text>
                                                <Button variant={'ghost'} onClick={() => navigate(`/profile/@${user.username}`)}>
                                                    View Profile
                                                </Button>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                </Box>
                            )
                        } else {
                            return (
                                <Box key={user._id} my={2} >
                                    <Card w={'250px'}>
                                        <CardBody>
                                            <VStack>
                                                <Avatar size={'xl'} src={user.profilePhoto} name={user.username} />
                                                <Heading size={'sm'}>
                                                    <Button variant={'ghost'} _hover={{}} rightIcon={<MdVerified />} _active={{}}>
                                                        {user.username}
                                                    </Button>
                                                </Heading>
                                                <Text>{user.name}</Text>
                                                <Text>{user.bio}</Text>
                                                <Button variant={'ghost'} onClick={() => navigate(`/profile/@${user.username}`)}>
                                                    View Profile
                                                </Button>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                </Box>
                            )
                        }
                    })
                }
                {
                    loading && (
                        <Center>
                            <HStack spacing={'10px'} p={5}>
                                {[...Array(3)].map((_, index) => (
                                    <Box my={2} boxShadow={'lg'} p={4} bg={'white'} borderRadius={5} key={index}>
                                        <Skeleton width={'200px'} height={'250px'}></Skeleton>
                                    </Box>
                                ))}
                            </HStack>
                        </Center>
                    )
                }
            </SimpleGrid>
        </>
    )
}
