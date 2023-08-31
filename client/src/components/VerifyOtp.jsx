import { verifyOtp } from "../api/auth"
import { useFormValidation } from "../hooks/useFormValidation"
import { useNavigate } from 'react-router-dom'
import { Box, Button, FormControl, FormLabel, Input, FormHelperText, FormErrorMessage, Heading, VStack, Center, useToast } from '@chakra-ui/react'

export default function VerifyOtp({ email }) {
    const initialState = { otp: '' }
    const navigate = useNavigate()

    const submit = async () => {
        try {
            const { message } = await verifyOtp({ otp: String(values.otp), email })
            alert({
                title: "OTP Verified",
                description: message,
                status: "success",
                isClosable: true,
                duration: 3000,
                variant: "subtle",
                position: "top"
            })
            navigate("/reset-password", { state: { email }, replace: true })
        } catch ({ response: { data: { message }}}) {
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

    const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, submit)

    const alert = useToast()

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
