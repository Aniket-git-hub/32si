import { Box, Heading, Text, Image, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Error404Page() {
    const navigate = useNavigate()

    return (
        <Box
            bg="gray.50"
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Box maxW="lg" textAlign="center">
                {/* <Image src="[1](https://www.flaticon.com/free-icons/404)" alt="Error 404" mb={8} /> */}
                <Heading as="h1" fontSize="6xl" color="red.600">
                    Error 404
                </Heading>
                <Text fontSize="2xl" color="gray.600">
                    Oops! The page you are looking for does not exist.
                </Text>
                <Button
                    mt={4}
                    colorScheme="purple"
                    onClick={() => navigate("/")}
                >
                    Go back to home page
                </Button>
            </Box>
        </Box>
    );
}
