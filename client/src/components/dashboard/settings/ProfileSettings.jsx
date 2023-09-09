import { Box, Heading, Stack, Flex, Image, Button, FormControl, InputGroup, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { useFormValidation } from "../../../hooks/useFormValidation";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { FiEdit } from "react-icons/fi";
import { useState } from "react";
import { useEffect } from "react";
import useDebounce from "../../../hooks/useDebounce.jsx";
import getPlaces from "../../../api/getPlaces";
import ComboBox from "../../utils/comboBox";
import { updateUser } from "../../../api/user";
export default function ProfileSettings() {
    const { user, save } = useAuth();
    let initialState = {
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email,
        bio: user?.bio || "",
        location: user?.location || ""
    };
    const [editProfile, setEditProfile] = useState(false);
    const updateProfile = async (values) => {
        try {
            const response = await updateUser({
                userId: user._id,
                name: values.name,
                username: values.username,
                bio: values.bio,
                location: values.location
            })

            if (response) {
                const updatedUser = { ...user, ...response.data.user };
                save(updatedUser);
                initialState = {
                    name: updatedUser.name,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    bio: updatedUser.bio,
                    location: updatedUser.location
                };
            }
            setEditProfile(false);
            return { title: "Success", message: "Profile Updated Successfully" };
        } catch (error) {
            setEditProfile(false);
            throw error;
        }
    };
    const {
        values,
        setValues,
        errors,
        handleSubmit,
        handleChange,
        isSubmitting,
    } = useFormValidation(initialState, updateProfile);

    useEffect(() => {
        setEditProfile(false);
    }, [isSubmitting]);

    const [comboBoxInput, setComboBoxInput] = useState("");
    const [places, setPlaces] = useState([]);
    const debouncedValue = useDebounce(comboBoxInput.trim());
    useEffect(() => {
        if (editProfile && debouncedValue != "") {
            (async () => {
                try {
                    //   const res = await getPlaces(debouncedValue);
                    //   setPlaces(
                    //     res.data.map((item) => ({
                    //       name: item.name,
                    //       coordinates: [item.lat, item.lon],
                    //       type: "Point",
                    //     }))
                    //   );
                    setPlaces([
                        {
                            name: "Pune",
                            coordinates: [78, 72]
                        },
                        {
                            name: "Mumbai",
                            coordinates: [78, 72]
                        },
                        {
                            name: "Bhosari",
                            coordinates: [78, 72]
                        },
                    ])
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    }, [debouncedValue]);

    const locationSelected = (selection) => {
        console.log(selection);
        setValues({
            ...values,
            location: selection,
        });
        console.log(values)
    };

    return (
        <Box
            margin={2}
            h="fit-content"
            padding={5}
            borderRadius={5}
            height={"450px"}
        >
            <Heading size="md">Update Profile</Heading>
            <Flex
                w="100%"
                height={{ sm: "fit-content", md: "320px" }}
                direction={{ base: "column", md: "row" }}
                padding={2}
            >
                <Box flex={2} p={10}>
                    <Image
                        objectFit="cover"
                        boxSize="100%"
                        src="https://source.unsplash.com/random/500x500/?girl"
                        alt="#"
                    />
                    <Button>Remove</Button>
                </Box>

                <Stack flex={3} px={10}>
                    <form onSubmit={handleSubmit}>
                        <FormControl
                            id="name"
                            isInvalid={errors.name}
                            isReadOnly={!editProfile}
                            isDisabled={!editProfile}
                        >
                            <FormLabel>Name</FormLabel>
                            <InputGroup>
                                <Input
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                />
                            </InputGroup>
                            <FormErrorMessage> {errors.name}</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            id="username"
                            isInvalid={errors.username}
                            isReadOnly={!editProfile}
                            isDisabled={!editProfile}
                        >
                            <FormLabel>Username</FormLabel>
                            <InputGroup>
                                <Input
                                    name="username"
                                    value={values.username}
                                    onChange={handleChange}
                                />
                            </InputGroup>
                            <FormErrorMessage> {errors.username}</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            id="bio"
                            isInvalid={errors.bio}
                            isReadOnly={!editProfile}
                            isDisabled={!editProfile}
                            placeholder="Add bio"
                        >
                            <FormLabel>Bio</FormLabel>
                            <InputGroup>
                                <Input name="bio" value={values.bio} onChange={handleChange} />
                            </InputGroup>
                            <FormErrorMessage> {errors.bio}</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            id="email"
                            isInvalid={errors.email}
                            isReadOnly={!editProfile}
                            isDisabled={!editProfile}
                        >
                            <FormLabel>Email</FormLabel>
                            <InputGroup>
                                <Input
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                />
                            </InputGroup>
                            <FormErrorMessage> {errors.username}</FormErrorMessage>
                        </FormControl>
                        <ComboBox
                            isDisabled={!editProfile}
                            places={places}
                            handleInputValueChange={(selection) =>
                                setComboBoxInput(selection)
                            }
                            value={values?.location.name}
                            handleSelection={locationSelected}
                        />
                        <FormControl mt={5} isDisabled={!editProfile}>
                            <Flex justifyContent={"space-between"}>
                                <Button
                                    colorScheme="purple"
                                    variant={!editProfile ? "outline" : "solid"}
                                    p={5}
                                    leftIcon={<FiEdit />}
                                    onClick={() => setEditProfile(!editProfile)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    type="submit"
                                    variant="outline"
                                    colorScheme="purple"
                                    name="submit"
                                    isDisabled={isSubmitting || !editProfile}
                                    loadingText="updating..."
                                    isLoading={isSubmitting}
                                >
                                    Update
                                </Button>
                            </Flex>
                        </FormControl>
                    </form>
                </Stack>
            </Flex>
        </Box>
    );
}