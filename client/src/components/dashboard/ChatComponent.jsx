import { Box, Container, Flex, FormControl, IconButton, Input, Text, useColorModeValue } from "@chakra-ui/react"
import { useState } from "react"
import { VscSend } from "react-icons/vsc"
function ChatComponent() {
    const [message, setMessage] = useState([
        { message: "Hi", sender: 'me', time: '10:45' },
        { message: "How are you?", sender: 'her', time: '10:45' },
        { message: "fine and you?", sender: 'me', time: '10:45' },
        { message: "fine was missing you!!!", sender: 'her', time: '10:45' },
        { message: "aww", sender: 'me', time: '10:45' },
    ])
    const [text, setText] = useState('')
    const textColor = useColorModeValue("blue.400", "blue.700")
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
                        message ?
                            message.map(text => (
                                <Flex w={"full"} justifyContent={text.sender === "me" ? "end" : "start"} px={2}>
                                    <Text p={2} bg={textColor} color={"white"} my={1} rounded={"lg"} minW={"10"}>{text.message}</Text>
                                </Flex>
                            ))
                            :
                            <Text>No messages</Text>
                    }
                </Box>
                <FormControl display={"flex"}>
                    <Input placeholder="Hi..." onChange={(e) => setText(e.target.value)} />
                    <IconButton ml={2} icon={<VscSend />} onClick={() => setMessage(prev => [...prev, { message: text, sender: "me" }])}></IconButton>
                </FormControl>
            </Container>
        </>
    )
}

export default ChatComponent