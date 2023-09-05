import { Button, FormControl, FormLabel, Input, Link, FormErrorMessage, Heading, Container, Card, CardBody, InputGroup, InputRightElement, Icon, Flex, VStack, Center } from '@chakra-ui/react'
import { loginUser } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function LoginPage() {
  const initialState = { email: '', password: '' }

  const { save } = useAuth()

  const login = async (values) => {
    try {
      const response = await loginUser(values)
      const {user, accessToken} = response.data 
      save(user, accessToken)
      return { message: `Welcome back ${ user.name && user.name }`, title:`Login Successful`}
    } catch (error) {
      throw error
    }
  }

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, login)

  const [showPassword, setShowPassword] = useState(false)

  return (
    <Container as="section" my="50px" maxW="400px">
      <Card borderBottom="4px" borderBottomColor="purple.500">
        <CardBody>
          <Center>
            <Heading mb="30px">32 Beads Login</Heading>
          </Center>
          <form onSubmit={handleSubmit}>
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
            </FormControl>
            <Flex justifyContent="end">
              <Link href="/forgot-password">Forgot password</Link>
            </Flex>
            <Center>
              <VStack>
                <Button type="submit" colorScheme='purple' isLoading={isSubmitting} loadingText="logging..." disabled={isSubmitting}>
                  Login
                </Button>
                <p>Don't have an account? <Link href="/register">Create</Link> </p>
              </VStack>
            </Center>
          </form>
        </CardBody>

      </Card>
    </Container>
  )
}
