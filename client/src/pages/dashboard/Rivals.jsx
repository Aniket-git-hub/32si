import { Avatar, Button, Card, CardBody, CardHeader, Heading, Link, Text, Box, VStack, SimpleGrid, IconButton, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MdRefresh, MdVerified } from 'react-icons/md'
import { getAllUsers } from '../../api/user'
import useAllData from '../../hooks/useAllData'

export default function Rivals() {
    const { rivals, setRivals } = useAllData()
    const loadUsers = async () => {
            try {
                const response = await getAllUsers({ page: 1, limit: 10 })
                console.log(response.data.users)
                setRivals(response.data.users)
            } catch (error) {
                console.log(error)
            }
    }
    useEffect(() => {
        if (rivals.length === 0) {
            loadUsers()
        }
    }, [rivals, setRivals])
    return (
        <>
            <Flex justifyContent={"space-between"}>
            <Heading size={"lg"}>Rivals</Heading>
            <IconButton variant={"ghost"} _hover={{}} title='refresh' icon={<MdRefresh />} onClick={loadUsers} />
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
                                    <Button variant={"ghost"}>View Profile</Button>
                                </VStack>
                            </CardBody>
                        </Card>
                    </Box>
                ))}
            </SimpleGrid>
        </>
    )
}
