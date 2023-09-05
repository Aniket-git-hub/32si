import { Text, Box, Container, HStack, Heading, VStack, Stack, Flex, Image, Button, FormControl, InputGroup, FormLabel, Input, CloseButton, FormErrorMessage, } from '@chakra-ui/react'
import { useFormValidation } from "../../../hooks/useFormValidation"
export default function ProfileSettings() {
    const initialState = { name: '', username: '', email: '', bio: '' }
    const editProfile = false
    const updateProfile = (values) => {
        console.log(values)
    }
    const { values, errors, handleSubmit, handleChange, isSubmitting } = useFormValidation(initialState, updateProfile)
    return (
        <Box margin={2} h="fit-content" padding={5} borderRadius={5} height={"450px"}>
            <Heading size="md">Update Profile</Heading>
            <Flex
                w="100%"
                height={{ sm: "fit-content", md: '320px' }}
                direction={{ base: 'column', md: "row" }}
                padding={2}
            >
                <Box flex={2} p={10}>
                    <Image objectFit="cover" boxSize="100%"
                        src="https://source.unsplash.com/random/500x500/?girl"
                        alt="#"
                    />
                    <Button>Remove</Button>
                </Box>

                <Stack flex={3} px={10}>
                    <form onSubmit={handleSubmit}>

                        <FormControl id='name' isInvalid={errors.name} isReadOnly={!editProfile} isDisabled={!editProfile} >
                            <FormLabel>Name</FormLabel>
                            <InputGroup>
                                <Input name='name' value={values.name} onChange={handleChange} />
                            </InputGroup>
                            <FormErrorMessage> {errors.name}</FormErrorMessage>
                        </FormControl>
                        <FormControl id='username' isInvalid={errors.username} isReadOnly={!editProfile} isDisabled={!editProfile} >
                            <FormLabel>Username</FormLabel>
                            <InputGroup>
                                <Input name='username' value={values.username} onChange={handleChange} />
                            </InputGroup>
                            <FormErrorMessage> {errors.username}</FormErrorMessage>
                        </FormControl>
                        <FormControl id='bio' isInvalid={errors.bio} isReadOnly={!editProfile} isDisabled={!editProfile} >
                            <FormLabel>Bio</FormLabel>
                            <InputGroup>
                                <Input name='bio' value={values.bio} onChange={handleChange} />
                            </InputGroup>
                            <FormErrorMessage> {errors.bio}</FormErrorMessage>
                        </FormControl>
                        <FormControl id='email' isInvalid={errors.email} isReadOnly={!editProfile} isDisabled={!editProfile} >
                            <FormLabel>Email</FormLabel>
                            <InputGroup>
                                <Input name='email' value={values.email} onChange={handleChange} />
                            </InputGroup>
                            <FormErrorMessage> {errors.username}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={5}>
                            <Button type='submit' variant="outline" colorScheme='purple' name='submit'>Save</Button>
                        </FormControl>
                    </form>
                </Stack>
            </Flex>
        </Box>
    )
}
