import {
    Avatar,
    HStack,
    Center,
    Box,
    Button,
    Card,
    CardBody,
    Flex,
    Heading,
    IconButton,
    SimpleGrid,
    Skeleton,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MdRefresh, MdVerified } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../api/user';
import { useAllData } from '../../hooks/useAllData';
import { useAuth } from '../../hooks/useAuth';

export default function Rivals() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { rivals, setRivals, totalUsersCount, setTotalUsersCount, page, setPage } = useAllData();
    const [loading, setLoading] = useState(false);
    const observer = useRef()
    const limit = 10
    const lastItemRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prev => prev + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading])

    const loadUsers = async (signal, page) => {
        try {
            setLoading(true);
            const response = await getAllUsers({ page, limit }, signal);
            setTotalUsersCount(response.data.total)
            setRivals(prevRivals => [...prevRivals, ...response.data.users]);
        } catch (error) {
            if (error.name === 'CanceledError') return
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        loadUsers(controller.signal, page);
        return () => {
            controller.abort();
        };
    }, [page]);

    if (rivals.length === 0) {
        return (
            <Center>
                <HStack spacing={'10px'} p={5}>
                    {[...Array(3)].map((_, index) => (
                        <Box my={2} boxShadow={'lg'} p={4} bg={'white'} borderRadius={5} key={index}>
                            <Skeleton width={'200px'} height={'250px'}></Skeleton>
                        </Box>
                    ))}
                </HStack>
            </Center>
        );
    }

    return (
        <>
            <Flex justifyContent={'space-between'}>
                <Heading size={'lg'}>Rivals</Heading>
                <IconButton variant={'ghost'} _hover={{}} title="refresh" icon={<MdRefresh />} onClick={() => loadUsers()} />
            </Flex>
            <SimpleGrid minChildWidth={'250px'} spacing={'10px'} p={5} style={{ height: '90vh', overflowY: 'scroll' }}>
                {rivals.map((item, index) => {
                    if (rivals.length === index + 1) {
                        return (
                            <Box my={2} key={`${index}${item._id}`} ref={lastItemRef}>
                                <Card w={'250px'}>
                                    <CardBody>
                                        <VStack>
                                            <Avatar size={'xl'} src="https://source.unsplash.com/random/200x200/?profile" />
                                            <Heading size={'sm'}>
                                                <Button variant={'ghost'} _hover={{}} rightIcon={<MdVerified />} _active={{}}>
                                                    {' '}
                                                    {item.name}
                                                </Button>
                                            </Heading>
                                            <Text>{item.bio}</Text>
                                            <Button variant={'ghost'} onClick={() => navigate(`/profile/@${item.username}`)}>
                                                View Profile
                                            </Button>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </Box>
                        )
                    } else {
                        return (
                            <Box my={2} key={`${index}${item.name}`}>
                                <Card w={'250px'}>
                                    <CardBody>
                                        <VStack>
                                            <Avatar size={'xl'} src="https://source.unsplash.com/random/200x200/?profile" />
                                            <Heading size={'sm'}>
                                                <Button variant={'ghost'} _hover={{}} rightIcon={<MdVerified />} _active={{}}>
                                                    {' '}
                                                    {item.name}
                                                </Button>
                                            </Heading>
                                            <Text>{item.bio}</Text>
                                            <Button variant={'ghost'} onClick={() => navigate(`/profile/@${item.username}`)}>
                                                View Profile
                                            </Button>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </Box>
                        )
                    }

                })}
            </SimpleGrid>
        </>
    );
}
