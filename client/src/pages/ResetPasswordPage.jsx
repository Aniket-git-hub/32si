import { useLocation, useNavigate } from "react-router-dom";
import { useFormValidation } from "../hooks/useFormValidation";
import { resetPassword } from "../api/auth";
import { Box, InputGroup, Heading, FormControl, FormLabel, Input, FormErrorMessage, Button, InputRightElement, Icon } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function ResetPasswordPage() {
    const initialState = { password: '', cpassword: '' }

    const location = useLocation()
    const navigate = useNavigate()
    const savePassword = async () => {
        try {
            const email = location.state.email
            const response = await resetPassword({ password: values.password, email })
            console.log(response)
            navigate("/login", { replace: true })
        } catch (error) {
            console.log(error)
        }
    }

    const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, savePassword)

    const [showPassword, setShowPassword] = useState(false)
    const [showCPassword, setShowCPassword] = useState(false)

    return (
        <Box p={4}>
            <Heading as="h2" mb={4}>Set New Password</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl id="password" isInvalid={errors.password}>
                    <FormLabel>New Password</FormLabel>
                    <InputGroup>
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <Icon as={ViewOffIcon} /> : <Icon as={ViewIcon} />}
                            </Button>
                        </InputRightElement>
                        <Input type={showPassword ? "text" : "password"} name="password" value={values.password} onChange={handleChange} />
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <FormControl id="cpassword" isInvalid={errors.cpassword} mt={4}>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={() => setShowCPassword(!showCPassword)}>
                                {showCPassword ? <Icon as={ViewOffIcon} /> : <Icon as={ViewIcon} />}
                            </Button>
                        </InputRightElement>
                        <Input type={showCPassword ? "text" : "password"} name="cpassword" value={values.cpassword} onChange={handleChange} />
                    </InputGroup>
                    <FormErrorMessage>{errors.cpassword}</FormErrorMessage>
                </FormControl>
                <Button type="submit" colorScheme="blue" mt={4} isLoading={isSubmitting}>Save Password</Button>
            </form>
        </Box>
    )
}
