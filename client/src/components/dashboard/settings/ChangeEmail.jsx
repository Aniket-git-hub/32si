import {
    Alert,
    AlertIcon,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    Text,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { confirmEmailChange, requestEmailChange } from "../../../api/user";
import { useAuth } from "../../../hooks/useAuth";

const errorMessage = (error) => error.response?.data?.message ?? "Something went wrong. Please try again.";

/** Email field with a two-step change flow: password + new address, then the code sent there. */
export default function ChangeEmail() {
    const { user, setUser } = useAuth();
    const toast = useToast();
    const modal = useDisclosure();
    const [step, setStep] = useState("details"); // details | code
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [code, setCode] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    const open = () => {
        setStep("details");
        setNewEmail("");
        setPassword("");
        setCode("");
        setError(null);
        modal.onOpen();
    };

    const sendCode = async () => {
        setBusy(true);
        setError(null);
        try {
            await requestEmailChange({ newEmail, password });
            setStep("code");
        } catch (e) {
            setError(errorMessage(e));
        } finally {
            setBusy(false);
        }
    };

    const confirm = async (value = code) => {
        if (value.length !== 6) return;
        setBusy(true);
        setError(null);
        try {
            const res = await confirmEmailChange({ newEmail, otp: value });
            setUser(res.data.user);
            modal.onClose();
            toast({ title: "Email updated", description: `You'll now sign in with ${res.data.user.email}.`, status: "success", position: "top" });
        } catch (e) {
            setError(errorMessage(e));
            setCode("");
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <HStack align="flex-end" spacing={3}>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input value={user.email} isReadOnly />
                </FormControl>
                <Button colorScheme="purple" variant="outline" onClick={open} flexShrink={0}>
                    Change
                </Button>
            </HStack>

            <Modal isOpen={modal.isOpen} onClose={modal.onClose} isCentered>
                <ModalOverlay />
                <ModalContent mx={3}>
                    <ModalHeader>Change your email</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {step === "details" ? (
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>New email</FormLabel>
                                    <Input type="email" autoFocus value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Current password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && sendCode()}
                                        />
                                        <InputRightElement>
                                            <IconButton
                                                size="sm"
                                                variant="ghost"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                onClick={() => setShowPassword((s) => !s)}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormHelperText>We&apos;ll send a code to the new address to confirm it&apos;s yours.</FormHelperText>
                                </FormControl>
                            </VStack>
                        ) : (
                            <VStack spacing={4}>
                                <Text textAlign="center">
                                    Enter the 6-digit code we sent to <b>{newEmail}</b>. It expires in 2 minutes.
                                </Text>
                                <HStack>
                                    <PinInput otp value={code} onChange={setCode} onComplete={confirm} isDisabled={busy} autoFocus>
                                        {[...Array(6)].map((_, i) => (
                                            <PinInputField key={i} />
                                        ))}
                                    </PinInput>
                                </HStack>
                                <Button variant="link" size="sm" onClick={sendCode} isDisabled={busy}>
                                    Send a new code
                                </Button>
                            </VStack>
                        )}
                        {error && (
                            <Alert status="error" borderRadius="md" mt={4}>
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}
                    </ModalBody>
                    <ModalFooter gap={2}>
                        {step === "code" && (
                            <Button variant="ghost" onClick={() => setStep("details")}>
                                Back
                            </Button>
                        )}
                        {step === "details" ? (
                            <Button colorScheme="purple" onClick={sendCode} isLoading={busy} isDisabled={!newEmail || !password}>
                                Send code
                            </Button>
                        ) : (
                            <Button colorScheme="purple" onClick={() => confirm()} isLoading={busy} isDisabled={code.length !== 6}>
                                Confirm
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
