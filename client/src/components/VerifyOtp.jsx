import { verifyOtp } from "../api/auth"
import { useFormValidation } from "../hooks/useFormValidation"
import { useNavigate } from 'react-router-dom'
import { Box, Heading, FormControl, FormLabel, Input, FormErrorMessage, Button } from "@chakra-ui/react"

export default function VerifyOtp({ email }) {
    const initialState = { otp: '' }
    const navigate = useNavigate()

    const submit = async () => {
        try {
            const response = await verifyOtp({ otp: String(values.otp), email })
            console.log(response)
            navigate("/reset-password", { state: { email }, replace: true })
        } catch (error) {
            console.log(error)
        }
    }

    const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, submit)

    return (
        <Box p={4}>
            <Heading as="h3" mb={4}>Verify OTP</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl id="otp" isInvalid={errors.otp}>
                    <FormLabel>OTP</FormLabel>
                    <Input type="number" name="otp" value={values.otp} onChange={handleChange} />
                    <FormErrorMessage>{errors.otp}</FormErrorMessage>
                </FormControl>
                <Button type="submit" colorScheme="blue" mt={4} isLoading={isSubmitting}>Verify OTP</Button>
            </form>
        </Box>
    )
}
