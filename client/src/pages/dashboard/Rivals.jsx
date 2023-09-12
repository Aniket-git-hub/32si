import { Avatar, Button, Card, CardBody, CardHeader, Heading, Link, Text, Box, VStack, SimpleGrid, IconButton, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MdRefresh, MdVerified } from 'react-icons/md'
import { getAllUsers } from '../../api/user'
import { useAllData } from '../../hooks/useAllData'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Rivals() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { rivals, setRivals } = useAllData()

    const loadUsers = async (signal) => {
        try {
            const response = await getAllUsers({ page: 1, limit: 10 }, signal)
            setRivals(response.data.users)
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        // Create a new AbortController instance for this request
        const controller = new AbortController();

        if (rivals.length === 0) {
            loadUsers(controller.signal)
        }

        // Cleanup function to cancel the request when the component is unmounted
        return () => {
            controller.abort();
        };
    }, [])

    return (
        <>
            <Flex justifyContent={"space-between"}>
                <Heading size={"lg"}>Rivals</Heading>
                <IconButton variant={"ghost"} _hover={{}} title='refresh' icon={<MdRefresh />} onClick={() => loadUsers()} />
            </Flex>
            <SimpleGrid minChildWidth={"250px"} spacing={"10px"} p={5}>
                {rivals && rivals.map((item, index) => (
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
        </>
    )
}
