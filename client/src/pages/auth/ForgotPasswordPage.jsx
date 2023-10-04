import { useState, useEffect } from "react"
import { useFormValidation } from "../../hooks/useFormValidation"
import VerifyOtp from "../../components/auth/VerifyOtp"
import { useAuth } from "../../hooks/useAuth"
import { forgotPassword } from "../../api/auth"
import { Button, FormControl, FormLabel, Link, Input, FormHelperText, FormErrorMessage, Heading, Container, Card, CardBody, VStack, Center } from '@chakra-ui/react'

export default function ForgotPasswordPage() {
    const initialState = { email: '' }
    const { verifyOTP, setVerifyOTP } = useAuth()
    const [countdown, setCountdown] = useState(120)
    const [email, setEmail] = useState('')

    const submit = async (values) => {
        try {
            setEmail(values.email)
            console.log(email)
            await forgotPassword(values)
            setVerifyOTP(true)
            setCountdown(120)
            return { title: `Email sent`, message: `OTP sent : ${email}` }
        } catch (error) {
            throw error
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
        <>
            <Container as="section" my="50px" maxW="400px">
                <Card borderBottom="4px" borderBottomColor="purple.500">
                    <CardBody>
                        <Center>
                            <Heading mb="30px">32 Beads Account Password Reset</Heading>
                        </Center>
                        <form onSubmit={handleSubmit} className={verifyOTP ? 'disabled' : ''}>
                            <FormControl isInvalid={errors.email} isRequired mb=".8rem">
                                <FormLabel>Email</FormLabel>
                                <Input type='email' name="email" value={values.email} onChange={handleChange} />
                                <FormHelperText> Enter email that you used to created account.</FormHelperText>
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>
                            <Center mt="1.5rem">
                                <VStack>
                                    <Button type="submit" colorScheme='purple' isLoading={isSubmitting} loadingText="Sending..." disabled={isSubmitting}>
                                        {verifyOTP ? `Resend OTP (${countdown})` : 'Send OTP'}
                                    </Button>
                                    <p> back to  <Link href="/login">login</Link></p>
                                </VStack>
                            </Center>
                        </form>
                        {verifyOTP && <VerifyOtp email={email} />}
                    </CardBody>
                </Card>
            </Container>


        </>
    )
}
