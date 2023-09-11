import { Center, Flex, Heading, Stack, Text, Badge, Button, Image } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { useAllData } from "../../hooks/useAllData";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { connectUser, disconnectUser, getAUser } from "../../api/user";

export default function Profile() {
    const { user, setUser } = useAuth()
    let { username } = useParams()
    const [profileUser, setProfileUser] = useState(null)
    const [isFriend, setIsFriend] = useState(false) 
    const [isConnecting, setIsConnecting] = useState(false) 
    const [isDisconnecting, setIsDisconnecting] = useState(false) 
    const [requestSent, setRequestSent] = useState(false) 

    const loadProfileUserData = async () => {
        try {
            const response = await getAUser(username.replace(/@/g, ""))
            setProfileUser(response.data.user)
            setIsFriend(response.data.user.friends?.includes(user._id))
            setRequestSent(response.data.user.connectionRequests.includes(user._id))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!profileUser) {
            loadProfileUserData()
        }
    }, [])
    

    const handleConnectUser = async (userId) => {
        try {
            setIsConnecting(true)
            const response = await connectUser(userId); 
            setProfileUser(response.data.requestedUser)
            setIsConnecting(false)
            setRequestSent(true)
        } catch (error) {
            setIsConnecting(false)
            setRequestSent(false)
        }
    }
    
    const handleDisconnectUser = async (userId) => {
        try {
            setIsDisconnecting(true)
            const response = await disconnectUser(userId)
            setProfileUser(response.data.requestedUser)
            setUser(response.data.user)
            setIsDisconnecting(false)
        } catch (error) {
            setIsDisconnecting(false)
        }
    }

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
                        {profileUser && profileUser.name}
                    </Heading>
                    <Text fontWeight={600} color={'gray.500'} size="md" mb={4}>
                        @{profileUser && profileUser.username}
                    </Text>
                    <Text textAlign={'center'} color={'gray.600'} px={3}>
                        {profileUser && profileUser.bio}
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
                            colorScheme="purple"
                            color={'white'}
                            onClick={() => !isFriend ? handleConnectUser(profileUser._id) : handleDisconnectUser(profileUser._id)}
                            loadingText={isConnecting ? 'Requesting...' : 'disconnecting...'}
                            isLoading={isConnecting || isDisconnecting}
                            isDisabled={ requestSent || isConnecting || isDisconnecting}
                        >
                            {!isFriend ? ( requestSent ? 'Request Sent': 'Connect') : 'Disconnect'}
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Center>
    )
}
