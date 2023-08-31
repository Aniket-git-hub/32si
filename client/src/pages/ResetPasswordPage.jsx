import { useLocation, useNavigate } from "react-router-dom";
import { useFormValidation } from "../hooks/useFormValidation";
import { resetPassword } from "../api/auth";
import { Box, Button, FormControl, FormLabel, Input, Link, FormErrorMessage, Heading, Container, Card, CardBody, InputGroup, InputRightElement, Icon, Flex, VStack, Center, useToast } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function ResetPasswordPage() {
    const initialState = { password: '', cpassword: '' }

    const location = useLocation()
    const navigate = useNavigate()
    const savePassword = async () => {
        try {
            const email = location.state.email
            const { message } = await resetPassword({ password: values.password, email })
            alert({
                title: "OTP Verified",
                description: message,
                status: "success",
                isClosable: true,
                duration: 3000,
                variant: "subtle",
                position: "top"
            })
            navigate("/login", { replace: true })
        } catch (error) {
            const { data: { message }} = error?.response
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

    const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, savePassword)

    const [showPassword, setShowPassword] = useState(false)
    const [showCPassword, setShowCPassword] = useState(false)

    const alert = useToast()

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
