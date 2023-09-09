import { Avatar, Button, Card, CardBody, CardHeader, Heading, Link, Text, Box, VStack, SimpleGrid, IconButton } from '@chakra-ui/react'
import { MdVerified } from 'react-icons/md'
export default function Rivals() {
    const list = [
        { name: "Aniket Singh", bio: "the quick brown fox jumped over the lazy dog." },
        { name: "Aniket Singh", bio: "the quick brown fox jumped over the lazy dog." },
        { name: "Aniket Singh", bio: "the quick brown fox jumped over the lazy dog." },
        { name: "Aniket Singh", bio: "the quick brown fox jumped over the lazy dog." },
        { name: "Aniket Singh", bio: "the quick brown fox jumped over the lazy dog." },
        { name: "Aniket Singh", bio: "the quick brown fox jumped over the lazy dog." },
    ]
    return (
        <>
            <Heading size={"lg"}>Rivals</Heading>
            <SimpleGrid minChildWidth={"250px"} spacing={"10px"} p={5}>
                {list.map((item, index) => (
                    <Box my={2}>
                        <Card w={"250px"} key={`${index}${item.name}`}>
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
