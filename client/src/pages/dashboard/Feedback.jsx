import {
  Box,
  Button,
  Text,
  Container,
  Flex,
  FormLabel,
  HStack,
  FormControl,
  Heading,
  Input,
  IconButton,
  InputGroup,
  InputLeftElement,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
  FormErrorMessage,
  Link,
} from "@chakra-ui/react";
import {
  MdEmail,
  MdFacebook,
  MdLocationOn,
  MdOutlineEmail,
  MdPhone,
} from "react-icons/md";
import { BsGithub, BsPerson, BsInstagram, BsLinkedin } from "react-icons/bs";
import { useFormValidation } from "../../hooks/useFormValidation";
import { sendFeedback } from "../../api/user";

export default function Feedback() {
  const initialState = { name: "", email: "", message: "" };

  const submitFeedback = async (values) => {
    try {
      const response = await sendFeedback(values)
      return { title: "Success", message: response.data.message };
    } catch (error) {
      throw error;
    }
  };

  const { values, errors, handleChange, handleSubmit, isSubmitting } =
    useFormValidation(initialState, submitFeedback);

  return (
    <>
      <Container
        bg="#9DC4FB"
        maxW="100%"
        centerContent
        overflow="hidden"
        borderRadius={10}
      >
        <Flex>
          <Box
            bg="blue.900"
            color="white"
            borderRadius="lg"
            m={{ sm: 4, md: 16, lg: 10 }}
            p={{ sm: 5, md: 5, lg: 16 }}
          >
            <Box p={4}>
              <Wrap spacing={10}>
                <WrapItem>
                  <Box>
                    <Heading> Feedback </Heading>
                    <Text mt={{ sm: 3, md: 3, lg: 5 }} color="gray.500">
                      Fill up the form below to contact
                    </Text>
                    <Box py={{ base: 5, sm: 5, md: 8, lg: 10 }}>
                      <VStack pl={0} spacing={3} alignItems="flex-start">
                        <Button
                          size="md"
                          height="48px"
                          width="200px"
                          variant="ghost"
                          color="#DCE2FF"
                          _hover={{ border: "2px solid  #805AD5" }}
                          leftIcon={<MdPhone color="#805AD5" size="20px" />}
                        >
                          +91-7559410568
                        </Button>
                        <Button
                          size="md"
                          height="48px"
                          width="200px"
                          variant="ghost"
                          colorScheme="purple"
                          color="#DCE2FF"
                          _hover={{ border: "2px solid  #805AD5" }}
                          leftIcon={<MdEmail color="#805AD5" size="20px" />}
                        >
                          hello@letsbug.in
                        </Button>
                        <Button
                          size="md"
                          height="48px"
                          width="200px"
                          variant="ghost"
                          color="#DCE2FF"
                          _hover={{ border: "2px solid  #805AD5" }}
                          leftIcon={
                            <MdLocationOn color="#805AD5" size="20px" />
                          }
                        >
                          Pune, India
                        </Button>
                      </VStack>
                    </Box>
                    <HStack
                      mt={{ lg: 10, md: 10 }}
                      spacing={5}
                      px={5}
                      alignItems="flex-start"
                    >
                      <Link href="https://www.linkedin.com/in/aniket-singh-80371b201" isExternal>
                        <IconButton
                          aria-label="linkedin"
                          variant="ghost"
                          size="lg"
                          isRound={true}
                          _hover={{ bg: "#805AD5" }}
                          icon={<BsLinkedin size="28px" />}
                        />
                      </Link>
                      <Link href="https://github.com/Aniket-git-hub" isExternal>
                        <IconButton
                          aria-label="github"
                          variant="ghost"
                          size="lg"
                          isRound={true}
                          _hover={{ bg: "#805AD5" }}
                          icon={<BsGithub size="28px" />}
                        />
                      </Link>
                      <Link href="https://www.instagram.com/aniketsingh6967/" isExternal>
                        <IconButton
                          aria-label="instagram"
                          variant="ghost"
                          size="lg"
                          isRound={true}
                          _hover={{ bg: "#805AD5" }}
                          icon={<BsInstagram size="28px" />}
                        />
                      </Link>
                    </HStack>
                  </Box>
                </WrapItem>
                <WrapItem>
                  <Box bg="white" borderRadius="lg">
                    <Box m={8} color="#0B0E3F">
                      <form onSubmit={handleSubmit}>
                        <VStack spacing={5}>
                          <FormControl
                            id="name"
                            isRequired
                            isInvalid={errors.name}
                          >
                            <FormLabel>Your Name</FormLabel>
                            <InputGroup borderColor="#E0E1E7">
                              <InputLeftElement>
                                <BsPerson color="gray.800" />
                              </InputLeftElement>
                              <Input
                                type="text"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                size="md"
                              />
                            </InputGroup>
                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                          </FormControl>
                          <FormControl
                            id="email"
                            isInvalid={errors.email}
                            isRequired
                          >
                            <FormLabel>E-Mail</FormLabel>
                            <InputGroup borderColor="#E0E1E7">
                              <InputLeftElement>
                                <MdOutlineEmail color="gray.800" />
                              </InputLeftElement>
                              <Input
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                size="md"
                              />
                            </InputGroup>
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                          </FormControl>
                          <FormControl
                            id="message"
                            isInvalid={errors.message}
                            isRequired
                          >
                            <FormLabel>Message</FormLabel>
                            <Textarea
                              borderColor="gray.800"
                              _hover={{ borderRadius: "gray.300" }}
                              placeholder="message"
                              name="message"
                              value={values.message}
                              onChange={handleChange}
                            />
                            <FormErrorMessage>{errors.message}</FormErrorMessage>
                          </FormControl>
                          <FormControl id="button">
                            <Button
                              type="submit"
                              variant="solid"
                              colorScheme="purple"
                              _hover={{}}
                              loadingText="sending..."
                              isLoading={isSubmitting}
                            >
                              Send Message
                            </Button>
                          </FormControl>
                        </VStack>
                      </form>
                    </Box>
                  </Box>
                </WrapItem>
              </Wrap>
            </Box>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
