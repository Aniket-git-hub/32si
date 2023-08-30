import { Box, Button, FormControl, FormLabel, Input, Link, VStack } from '@chakra-ui/react';
import { loginUser } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
import { useSanitizeValues } from '../hooks/useSanitizedValues';

export default function LoginPage() {
  const initialState = { email: '', password: '' }

  const { save } = useAuth()
  const login = async () => {
    try {
      const sanitizedValues = useSanitizeValues(values)
      const { user, accessToken } = await loginUser(sanitizedValues)
      save(user, accessToken)
    } catch (error) {
      console.log(error)
    }
  };

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, login)

  return (
    <Box>
      <VStack>
        <Box>
          <h2>32 Beads Login</h2>
          <form onSubmit={handleSubmit}>
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
