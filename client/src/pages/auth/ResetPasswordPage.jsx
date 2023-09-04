import { useLocation, useNavigate } from "react-router-dom";
import { useFormValidation } from "../../hooks/useFormValidation";
import { resetPassword } from "../../api/auth";
import { Button, FormControl, FormLabel, Input, FormErrorMessage, Heading, Container, Card, CardBody, InputGroup, InputRightElement, Icon, Center} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function ResetPasswordPage() {
    const initialState = { password: '', cpassword: '' }
    const { setVerifyOTP } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const savePassword = async () => {
        try {
            const email = location.state.email
            const response = await resetPassword({ password: values.password, email })
            const { message } = response.data
            setVerifyOTP(false)
            navigate("/login", { replace: true })
            return { title: `Password Reset`, message: message }
        } catch (error) {
            throw error
        }
    }

    const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, savePassword)

    const [showPassword, setShowPassword] = useState(false)
    const [showCPassword, setShowCPassword] = useState(false)

    return (

        <Container as="section" my="50px" maxW="400px">
            <Card borderBottom="4px" borderBottomColor="purple.500">
                <CardBody>
                    <Center>
                        <Heading mb="30px">Create New Password</Heading>
                    </Center>
                    <form onSubmit={handleSubmit}>

                        <FormControl id="password" isInvalid={errors.password} isRequired mb=".8rem">
                            <FormLabel>New Password</FormLabel>
                            <InputGroup>
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <Icon as={ViewOffIcon} /> : <Icon as={ViewIcon} />}
                                    </Button>
                                </InputRightElement>
                                <Input type={showPassword ? "text" : "password"} name="password" value={values.password} onChange={handleChange} />
                            </InputGroup>
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="cpassword" isInvalid={errors.cpassword} isRequired mb=".8rem">
                            <FormLabel>Confirm New Password</FormLabel>
                            <InputGroup>
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" variant="ghost" size="sm" onClick={() => setShowCPassword(!showCPassword)}>
                                        {showCPassword ? <Icon as={ViewOffIcon} /> : <Icon as={ViewIcon} />}
                                    </Button>
                                </InputRightElement>
                                <Input type={showCPassword ? "text" : "password"} name="cpassword" value={values.cpassword} onChange={handleChange} />
                            </InputGroup>
                            <FormErrorMessage>{errors.cpassword}</FormErrorMessage>
                        </FormControl>

                        <Center mt="1.8rem" mb="1.5">
                            <Button type="submit" colorScheme='purple' isLoading={isSubmitting} loadingText="Resetting..." disabled={isSubmitting}>
                                Reset Password
                            </Button>
                        </Center>
                    </form>
                </CardBody>

            </Card>
        </Container>
    )
}
