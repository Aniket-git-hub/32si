import { AtSignIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Flex, HStack, Heading, Skeleton, SkeletonText, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { BsPeople } from "react-icons/bs";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { MdPlace } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { acceptConnection, connectUser, disconnectUser, getAUserByUsername, getProfilePicture, getSmallProfilePicture } from "../../api/user";
import ImageWithPreview from "../../components/utils/ImageWithPreview";
import { useAuth } from "../../hooks/useAuth";
import { getGameStats } from "../../api/game";
import useChallenge from "../../hooks/useChallenge";
import useSocket from "../../hooks/useSocket";

export default function Profile() {
    const { socket } = useSocket()
    const { user, setUser } = useAuth()
    let { username } = useParams()
    const navigate = useNavigate()
    const [profileUser, setProfileUser] = useState(null)
    const [isFriend, setIsFriend] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isDisconnecting, setIsDisconnecting] = useState(false)
    const [isAccepting, setAccepting] = useState(false)
    const [requestSent, setRequestSent] = useState(false)
    const [myProfile, setMyProfile] = useState(false)

    const controllerRef = useRef(null)
    const { challenge, pendingId } = useChallenge()
    const [record, setRecord] = useState(null)
    const [loadError, setLoadError] = useState(null) // null | 'not-found' | 'failed'

    useEffect(() => {
        if (!profileUser?._id) return
        const controller = new AbortController()
        getGameStats({ userId: profileUser._id, limit: 1 }, controller.signal)
            .then((res) => setRecord(res.data.stats))
            .catch(() => setRecord(null))
        return () => controller.abort()
    }, [profileUser?._id])

    const loadProfileUserData = async (signal) => {
        try {
            setLoadError(null)
            const response = await getAUserByUsername(username.replace(/@/g, ""), signal)
            setProfileUser(response.data.user)
            setIsFriend(response.data.user.friends?.map(friend => friend._id).includes(user._id))
            setRequestSent(response.data.user.connectionRequests.includes(user.username))
            setMyProfile(user._id === response.data.user._id)
        } catch (error) {
            if (error.code === "ERR_CANCELED") return
            setProfileUser(null)
            setLoadError(error.response?.status === 404 ? "not-found" : "failed")
        }
    }

    useEffect(() => {
        if (controllerRef.current) {
            controllerRef.current.abort()
        }

        controllerRef.current = new AbortController()
        if (profileUser?.username !== username || !profileUser) {
            loadProfileUserData(controllerRef.current.signal)
        }

        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort()
            }
        }
    }, [username])

    // Reload when a friend request to or from this player changes (listeners removed on leave).
    useEffect(() => {
        if (!socket) return
        const reload = () => loadProfileUserData(controllerRef.current?.signal)
        socket.on("connectionRequest", reload)
        socket.on("connectionRequestAccepted", reload)
        return () => {
            socket.off("connectionRequest", reload)
            socket.off("connectionRequestAccepted", reload)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, username])

    const handleConnectUser = async ({ username }) => {
        try {
            setIsConnecting(true)
            const response = await connectUser(username);
            setProfileUser(response.data.requestedUser)
            setRequestSent(true)
            socket.emit("connectionRequest", {
                userFrom: user,
                userTo: profileUser,
                message: `${user.username} wants to connect with you.`
            })
        } catch (error) {
            setRequestSent(false)
        } finally {
            setIsConnecting(false)
        }
    }

    const handleDisconnectUser = async (userId) => {
        try {
            setIsDisconnecting(true)
            const response = await disconnectUser(userId)
            setUser(response.data.user)
            setProfileUser(response.data.requestedUser)
            setIsFriend(response.data.requestedUser.friends.includes(user._id))
        } catch (error) {
            console.log(error)
        } finally {
            setIsDisconnecting(false)
        }
    }

    const handleAcceptConnection = async (userId) => {
        try {
            setAccepting(true)
            const response = await acceptConnection(userId)
            setUser(response.data.user)
            setProfileUser(response.data.requestedUser)
            setIsFriend(response.data.requestedUser.friends.map(friend => friend._id).includes(user._id))
            socket.emit("connectionRequestAccepted", {
                userFrom: response.data.user,
                userTo: response.data.requestedUser,
                message: `${user.username} is your allie from now.`
            })
        } catch (error) {
            console.log(error)
        } finally {
            setAccepting(false)
        }
    }


    const handleNewChallenge = () => challenge(profileUser._id)


    if (loadError) {
        return (
            <Center py={16}>
                <VStack spacing={4} textAlign="center" px={4}>
                    <Heading size="md">
                        {loadError === "not-found" ? `There's no player called @${username.replace(/@/g, "")}` : "Couldn't load this profile"}
                    </Heading>
                    <Text color="gray.500">
                        {loadError === "not-found"
                            ? "Check the spelling, or find people to play on the Rivals page."
                            : "Check your connection and try again."}
                    </Text>
                    <HStack>
                        {loadError === "failed" && (
                            <Button colorScheme="purple" onClick={() => loadProfileUserData(controllerRef.current?.signal)}>
                                Try again
                            </Button>
                        )}
                        <Button variant="outline" colorScheme="purple" onClick={() => navigate("/rivals")}>
                            Browse rivals
                        </Button>
                    </HStack>
                </VStack>
            </Center>
        )
    }

    if (!profileUser) {
        return (
            <Center>
                <Flex padding={2} mt={5} boxShadow='lg' bg='white' borderRadius={5}>
                    <Box padding='6' width={"300px"} bg='white' borderRadius={5}>
                        <Skeleton h={"300px"} width={"250px"}> </Skeleton>
                    </Box>
                    <Box padding='6' width={"300px"} height={"300px"} bg='white' borderRadius={5}>
                        <SkeletonText noOfLines={5} spacing={10}></SkeletonText>
                    </Box>
                </Flex>
            </Center>
        )
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
                boxShadow={'2xl'}
                padding={4}
            >
                <Flex flex={1} bg="blue.200" rounded={"lg"} overflow={"hidden"}>
                    <ImageWithPreview
                        objectFit="cover" boxSize="100%" rounded={"lg"} overflow={"hidden"}
                        alt={profileUser.username}
                        smallURL={getSmallProfilePicture(profileUser.profilePhoto ? profileUser.profilePhoto : 'defaultImage_1_comp.webp')}
                        largeURL={getProfilePicture(profileUser.profilePhoto ? profileUser.profilePhoto : (profileUser.gender && profileUser.gender === 'male' ? 'defaultImage_3_comp.webp' : profileUser.gender === 'female' ? 'defaultImage_2_comp.webp' : 'defaultImage_1_comp.webp') || 'defaultImage_1_comp.webp')}
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
                        <AtSignIcon />    {profileUser && profileUser.username}
                    </Text>
                    <Text textAlign={'center'} color={'gray.600'} px={3}>
                        {profileUser.bio ? profileUser.bio : 'no bio'}
                    </Text>
                    <HStack >
                        <MdPlace />
                        <Text textAlign={'center'} color={'gray.600'} >
                            {profileUser.location ? profileUser.location.name : 'Earth'}
                        </Text>
                    </HStack>
                    <Stack align={'center'} justify={'center'} direction={'row'} mt={1}>
                        <HStack
                            px={2}
                            py={1}
                            bg={'gray.200'}
                            fontWeight={'400'}
                            borderRadius={5}
                        >
                            <HiOutlineRectangleGroup />
                            <Text title="Online games: wins · draws · losses">
                                {record
                                    ? `${record.played} games · ${record.wins}W ${record.draws}D ${record.losses}L`
                                    : profileUser?.gamesPlayed.length}
                            </Text>
                        </HStack>
                        <HStack
                            px={2}
                            py={1}
                            bg={'gray.200'}
                            fontWeight={'400'}
                            borderRadius={5}
                        >
                            <BsPeople />
                            <Text>
                                {profileUser && profileUser?.friends.length}
                            </Text>
                        </HStack>
                    </Stack>
                    <Stack
                        width={'100%'}
                        mt={'1rem'}
                        direction={'row'}
                        padding={2}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        hidden={myProfile}
                    >
                        <Button
                            onClick={handleNewChallenge}
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            _focus={{
                                bg: 'gray.300'
                            }}
                            isDisabled={myProfile}
                            isLoading={pendingId === profileUser._id}
                        >
                            Challenge
                        </Button>
                        {
                            user.connectionRequests.includes(profileUser.username) ? (
                                <Button
                                    flex={1}
                                    fontSize={'sm'}
                                    rounded={'full'}
                                    colorScheme="purple"
                                    color={'white'}
                                    onClick={() => handleAcceptConnection(profileUser._id)}
                                    isLoading={isAccepting}
                                    loadingText=""
                                    isDisabled={isAccepting}
                                > Accept</Button>
                            ) : (
                                <Button
                                    flex={1}
                                    fontSize={'sm'}
                                    rounded={'full'}
                                    colorScheme="purple"
                                    color={'white'}
                                    onClick={() => !isFriend ? handleConnectUser({ username: profileUser.username, userId: profileUser._id }) : handleDisconnectUser(profileUser._id)}
                                    loadingText=""
                                    isLoading={isConnecting || isDisconnecting}
                                    isDisabled={requestSent || isConnecting || isDisconnecting}
                                >
                                    {!isFriend ? (requestSent ? 'Request Sent' : 'Connect') : 'Disconnect'}
                                </Button>
                            )
                        }

                    </Stack>
                </Stack>
            </Stack>
        </Center>
    )
}
