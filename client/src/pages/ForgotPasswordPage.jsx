import { useState, useEffect } from "react"
import { useFormValidation } from "../hooks/useFormValidation"
import VerifyOtp from "../components/VerifyOtp"
import { useAuth } from "../hooks/useAuth"
import { forgotPassword } from "../api/auth"
import { Box, Heading, FormControl, FormLabel, Input, FormErrorMessage, Button } from "@chakra-ui/react"

export default function ForgotPasswordPage() {
    const initialState = { email: '' }
    const { verifyOTP, setVerifyOTP } = useAuth()
    const [countdown, setCountdown] = useState(120)

    const submit = async () => {
        try {
            const response = await forgotPassword(values)
            setVerifyOTP(true)
            setCountdown(120)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, submit)

    useEffect(() => {
        if (verifyOTP && countdown > 0) {
            const timerId = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timerId)
        } else if (countdown === 0) {
            setVerifyOTP(false)
        }
    }, [verifyOTP, countdown])

    return (
        <Box p={4}>
            <Heading as="h3" mb={4}>Password Reset</Heading>
            <Box className={verifyOTP ? 'disabled' : ''}>
                <form onSubmit={handleSubmit}>
                    <FormControl id="email" isInvalid={errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" name="email" value={values.email} onChange={handleChange} />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                    <Button type="submit" colorScheme="blue" mt={4} isLoading={isSubmitting}>{verifyOTP ? `Resend OTP (${countdown})` : 'Send OTP'}</Button>
                </form>
            </Box>
            {verifyOTP && <VerifyOtp email={values.email} />}
        </Box>
    )
}
