import { Box, Button, FormControl, FormLabel, Input, Link, VStack } from '@chakra-ui/react';
import { registerUser } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
import { useSanitizeValues } from '../hooks/useSanitizedValues';

export default function RegisterPage() {
  const initialState = { name: '', username: '', email: '', password: '' }

  const { save } = useAuth();
  const register = async event => {
    try {
      const sanitizedValues = useSanitizeValues(values)
      const { user, accessToken, message } = await registerUser(sanitizedValues)
      alert(message)
      save(user, accessToken)
    } catch (error) {
      console.log(error)
    }
  };

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, register)

  return (
    <Box>
      <VStack>
        <Box>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <FormControl id="name">
              <FormLabel>Name:</FormLabel>
              <Input type="text" name="name" value={values.name} onChange={handleChange} />
            </FormControl>
            {errors.name && <p>{errors.name}</p>}
            <br />
            <FormControl id="username">
              <FormLabel>Username:</FormLabel>
              <Input type="text" name="username" value={values.username} onChange={handleChange} />
            </FormControl>
            {errors.username && <p>{errors.username}</p>}
            <br />
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={values.email} onChange={handleChange} />
            </FormControl>
            {errors.email && <p>{errors.email}</p>}
            <br />
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" value={values.password} onChange={handleChange} />
            </FormControl>
            {errors.password && <p>{errors.password}</p>}
            <br />
            <Button type="submit" disabled={isSubmitting}>
              Register
            </Button>
          </form>
          <Link href="/login">Login</Link>
        </Box>
      </VStack>
    </Box>
  )
}
