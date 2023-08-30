import { Box, Button, FormControl, FormLabel, Input, Link, VStack, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { loginUser } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
import { useSanitizeValues } from '../hooks/useSanitizedValues';
import { useState } from 'react';

export default function LoginPage() {
  const initialState = { email: '', password: '' }

  const { save } = useAuth()
  const login = async () => {
    try {
      const sanitizedValues = useSanitizeValues(values)
      const { user, accessToken, message } = await loginUser(sanitizedValues)
      save(user, accessToken)
      setResponseMessage(message)
    } catch (error) {
      console.log(error)
      setResponseMessage({ message:error.response.data.message, status:"error"})
    }
  };

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, login)

  const [responseMessage, setResponseMessage] = useState({ message: "", status: "" })


  return (
    <Box>
      <VStack>
        <Box>
          <h2>32 Beads Login</h2>
          <form onSubmit={handleSubmit}>
            {responseMessage.message && (
              <Alert status={responseMessage.status} mt={4} variant='left-accent'>
                <AlertIcon />
                <AlertTitle>{responseMessage.message}</AlertTitle>
              </Alert>
            )}
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={values.email} onChange={handleChange} />
            </FormControl>
            {errors.email && <p>{errors.email}</p>}
            
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" value={values.password} onChange={handleChange} />
            </FormControl>
            {errors.password && <p>{errors.password}</p>}
           
            <Link href="/forgot-password">Forgot password</Link>
            <br></br>
            <Button type="submit" disabled={isSubmitting}>
              Login
            </Button>
          </form>
          <Link href="/register">Register</Link>
        </Box>
      </VStack>
    </Box>
  )
}
