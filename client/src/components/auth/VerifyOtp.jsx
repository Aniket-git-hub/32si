import { Button, Center, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { verifyOtp } from "../../api/auth"
import { useFormValidation } from "../../hooks/useFormValidation"

export default function VerifyOtp({ email }) {
    const initialState = { otp: '' }
    const navigate = useNavigate()

    const submit = async (values) => {
        try {
            console.log({ otp: String(values.otp), email })
            const response = await verifyOtp({ otp: String(values.otp), email })
            const { message } = response.data
            navigate("/reset-password", { state: { email }, replace: true })
            return { title: 'OTP Verified', message }
        } catch (error) {
            throw error
        }
    }

    const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, submit)

    return (
        <>
            <Center>
                <Heading my="30px">OTP Verification</Heading>
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
        </>
    )
}
