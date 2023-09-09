import { Center, Flex, Heading, Stack, Text, Badge, Button, Image, useColorMode } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { useParams } from "react-router-dom";

export default function Profile() {
    const { user } = useAuth()
    let { username } = useParams()
    return ( 
        <Center py={6}>
            <Stack
                borderWidth="1px"
                borderRadius="lg"
                borderColor={'gray.200'}
                w={{ sm: "100%", md: "540px" }}
                height={{ sm: "fit-content", md: '320px' }}
                direction={{ base: 'column', md: "row" }}
                bg={'gray.50'}
                boxShadow={'2xl'}
                padding={4}
            >
                <Flex flex={1} bg="blue.200">
                    <Image objectFit="cover" boxSize="100%"
                        src="https://source.unsplash.com/random/500x500/?girl"
                        alt="#"
                    />

                </Flex>
                <Stack
                    flex={1}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={1}
                    pt={2}
                >

                    <Heading fontSize={'2xl'} fontFamily={'body'}>
                        {user.name}
                    </Heading>
                    <Text fontWeight={600} color={'gray.500'} size="md" mb={4}>
                        @{user.username}
                    </Text>
                    <Text textAlign={'center'}
                        color={'gray.600'} px={3}>
                        { user.bio }
                        <Text color={'blue.400'} >#tag</Text>
                        me in your posts
                    </Text>
                    <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
                        <Badge
                            px={2}
                            py={1}
                            bg={'gray.200'}
                            fontWeight={'400'}
                        >
                            #art

                        </Badge>
                        <Badge
                            px={2}
                            py={1}
                            bg={'gray.200'}
                            fontWeight={'400'}
                        >
                            #photography
                        </Badge>
                        <Badge
                            px={2}
                            py={1}
                            bg={'gray.200'}
                            fontWeight={'400'}
                        >
                            #music
                        </Badge>
                    </Stack>
                    <Stack
                        width={'100%'}
                        mt={'2rem'}
                        direction={'row'}
                        padding={2}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <Button
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            _focus={{
                                bg: 'gray.300'
                            }}
                        >
                            Challenge
                        </Button>
                        <Button
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            bg={'blue.400'}
                            color={'white'}
                            boxShadow={
                                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                            }
                            _hover={{
                                bg: 'blue.500'
                            }}
                            _focus={{
                                bg: 'gray.500'
                            }}
                        >
                            Connect
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Center>
    )
}
