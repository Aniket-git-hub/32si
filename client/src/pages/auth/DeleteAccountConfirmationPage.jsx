import { useFormValidation } from "../../hooks/useFormValidation"
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, FormControl, FormLabel, Input, FormHelperText, FormErrorMessage, Heading, VStack, Center, useToast, Container } from '@chakra-ui/react'
import { confirmAccountDeletion } from "../../api/user"

export default function DeleteAccountConfirmationPage() {
      const initialState = { otp: '' }
      const navigate = useNavigate()

      const { deletionToken } = useParams()

      const submit = async (values) => {
            try {
                  console.log({ otp: String(values.otp), deletionToken })
                  const response = await confirmAccountDeletion({ otp: String(values.otp), deletionToken })
                  const { message } = response.data
                  navigate("/")
                  return { title: 'OTP Verified', message }
            } catch (error) {
                  throw error
            }
      }

      const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, submit)

      return (
            <Container shadow={"lg"} padding={10} borderRadius={10}>
                  <Center>
                        <Heading my="30px">Delete Account Request OTP Verification</Heading>
                  </Center>
                  <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={errors.otp} isRequired mb=".8rem">
                              <FormLabel>OTP</FormLabel>
                              <Input type="number" name="otp" value={values.otp} onChange={handleChange} />
                              <FormHelperText>Enter the OTP that you received on your email</FormHelperText>
                              <FormErrorMessage>{errors.otp}</FormErrorMessage>
                        </FormControl>
                        <Center mb="1.2rem">
                              <VStack>
                                    <Button type="submit" colorScheme='purple' isLoading={isSubmitting} loadingText="verifying..." disabled={isSubmitting}>
                                          Verify OTP
                                    </Button>
                              </VStack>
                        </Center>
                  </form>
            </Container>
      )
}
