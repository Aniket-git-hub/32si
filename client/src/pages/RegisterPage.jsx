import { Button, FormControl, FormLabel, Input, Link, FormErrorMessage, Heading, Container, Card, CardBody, InputGroup, InputRightElement, Icon, Flex, VStack, Center, useToast } from '@chakra-ui/react'
import { registerUser } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
import { useSanitizeValues } from '../hooks/useSanitizedValues';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from 'react';


export default function RegisterPage() {
  const initialState = { name: '', username: '', email: '', password: '' }

  const { save } = useAuth();
  const register = async event => {
    try {
      const sanitizedValues = useSanitizeValues(values)
      const {user, accessToken} = await registerUser(sanitizedValues)
      alert({
        title: "Account Created",
        description: `Welcome, ${user.name && user.name} to 32 Beads Community`,
        status: "success",
        isClosable: true,
        duration: 5000,
        variant: "subtle",
        position: "top"
      })
      save(user, accessToken)
    } catch (error) {
      console.log(error)
      const { data: { message } } = error?.response
      alert({
        title: "Authentication Error",
        description: message,
        status: "error",
        isClosable: true,
        duration: 5000,
        variant: "subtle",
        position: "top"
      })
    }
  }

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, register)

  const [showPassword, setShowPassword] = useState(false)

  const alert = useToast()

  return (
    <Container as="section" my="50px" maxW="400px">
      <Card borderBottom="4px" borderBottomColor="purple.500">
        <CardBody>
          <Center>
            <Heading mb="20px">Create 32 Beads Account</Heading>
          </Center>
          <form onSubmit={handleSubmit}>
            <FormControl isInvalid={errors.name} isRequired mb=".8rem">
              <FormLabel>Name</FormLabel>
              <Input type='text' name="name" value={values.name} onChange={handleChange} />
              <FormErrorMessage>{ errors.name}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={errors.username} isRequired mb=".8rem">
              <FormLabel>Username</FormLabel>
              <Input type='text' name="username" value={values.username} onChange={handleChange} />
              <FormErrorMessage>{ errors.username}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={errors.email} isRequired mb=".8rem">
              <FormLabel>Email</FormLabel>
              <Input type='email' name="email" value={values.email} onChange={handleChange} />
              <FormErrorMessage>{ errors.email }</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isInvalid={errors.password} isRequired mb=".8rem">
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Icon as={ViewOffIcon} /> : <Icon as={ViewIcon} />}
                  </Button>
                </InputRightElement>
                <Input type={showPassword ? "text" : "password"} name="password" value={values.password} onChange={handleChange} />
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
        
            <Center mt="2rem">
              <VStack>
                <Button type="submit" colorScheme='purple' isLoading={isSubmitting} loadingText="registering.." disabled={isSubmitting}>
                  Register
                </Button>
                <p>Have an account? <Link href="/login">Login</Link> </p>
              </VStack>
            </Center>
          </form>
        </CardBody>

      </Card>
    </Container>
  )
}
