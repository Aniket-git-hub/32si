import { Box, Center, Container, Flex, FormControl, IconButton, Input, Text, useColorModeValue } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { VscSend } from "react-icons/vsc"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import useSocket from "../../hooks/useSocket"
function ChatPage() {
    const { username } = useParams()
    const { user } = useAuth()
    const [friend, setFriend] = useState(null)
    const [message, setMessage] = useState([])
    const { socket } = useSocket()
    const [text, setText] = useState('')
    const textColor = useColorModeValue("blue.400", "blue.700")
    const navigate = useNavigate()
    useEffect(() => {
        let f = user.friends.filter(friend => friend.username === username)[0]
        if (!f) navigate(-1)
        setFriend(f)
        if (socket) {
            socket.on("message", (data) => {
                console.log("messagte")
                setMessage(prev => [...prev, { ...data }])
            })
        }
        return () => {
            if (socket) {
                socket.off("message")
            }
        }
    }, [socket])
    const handleMessageSent = () => {
        setMessage(prev => [...prev, { sender: user._id, userTo: friend._Id, message: text }])
        socket.emit("message", { sender: user._id, userToId: friend._id, message: text })
        setText("")
    }
    return (
        <>
            <Container>
                <Box minH={"70vh"} maxH={"70vh"} overflowY={"scroll"} sx={
                    {
                        '::-webkit-scrollbar': {
                            display: 'none'
                        }
                    }
                } >
                    {
                        message && message.length > 0 ?
                            message.map((text, index) => (
                                <Flex w={"full"} key={index} justifyContent={text.sender === user._id ? "end" : "start"} px={2}>
                                    <Text p={2} bg={textColor} color={"white"} my={1} rounded={"lg"} minW={"10"}>{text.message}</Text>
                                </Flex>
                            ))
                            : <Center>
                                <Text>No messages</Text>
                            </Center>
                    }
                </Box>
                <FormControl display={"flex"}>
                    <Input placeholder="Hi..." value={text} onChange={(e) => setText(e.target.value)} />
                    <IconButton ml={2} icon={<VscSend />} onClick={handleMessageSent}></IconButton>
                </FormControl>
            </Container>
        </>
    )
}

export default ChatPage