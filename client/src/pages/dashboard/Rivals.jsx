import { Avatar, HStack, Center, Box, Button, Card, CardBody, Flex, Heading, IconButton, SimpleGrid, Skeleton, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MdRefresh, MdVerified } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { getAllUsers } from '../../api/user'
import { useAllData } from '../../hooks/useAllData'
import { useAuth } from '../../hooks/useAuth'

export default function Rivals() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { rivals, setRivals } = useAllData()
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)

    const loadUsers = async (signal, page) => {
        setLoading(true)
        try {
            const response = await getAllUsers({ page, limit: 10 }, signal)
            setRivals(prevRivals => [...prevRivals, ...response.data.users])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        if (rivals.length === 0) {
            loadUsers(controller.signal, page)
        }
        return () => {
            controller.abort();
        };
    }, [page])

    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 50) {
            setPage(prevPage => prevPage + 1)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    if (rivals.length === 0) {
        return (
            <Center>
                <HStack spacing={"10px"} p={5}>
                    {[...Array(3)].map((_, index) => (
                        <Box my={2} boxShadow={"lg"} p={4} bg={"white"} borderRadius={5} key={index}>
                            <Skeleton width={"200px"} height={"250px"}></Skeleton>
                        </Box>
                    ))}
                </HStack>
            </Center>
        )
    }

    return (
        <>
            <Flex justifyContent={"space-between"}>
                <Heading size={"lg"}>Rivals</Heading>
                <IconButton variant={"ghost"} _hover={{}} title='refresh' icon={<MdRefresh />} onClick={() => loadUsers()} />
            </Flex>
            <SimpleGrid minChildWidth={"250px"} spacing={"10px"} p={5}>
                {rivals.map((item, index) => (
                    <Box my={2} key={`${index}${item.name}`}>
                        <Card w={"250px"} >
                            <CardBody>
                                <VStack>
                                    <Avatar size={"xl"} src='https://source.unsplash.com/random/200x200/?profile' />
                                    <Heading size={"sm"}>
                                        <Button variant={"ghost"} _hover={{}} rightIcon={<MdVerified />} _active={{}}> {item.name}</Button>
                                    </Heading>
                                    <Text>{item.bio}</Text>
                                    <Button variant={"ghost"} onClick={() => navigate(`/profile/@${item.username}`)}>View Profile</Button>
                                </VStack>
                            </CardBody>
                        </Card>
                    </Box>
                ))}
            </SimpleGrid>
            {loading && <p>Loading...</p>}
        </>
    )
}
