import { Box, Heading, Stack, Flex, Image, Button, FormControl, InputGroup, FormLabel, Input, FormErrorMessage, IconButton, InputLeftElement, Icon } from "@chakra-ui/react";
import { useFormValidation } from "../../../hooks/useFormValidation";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { FiEdit, FiFile, FiImage } from "react-icons/fi";
import { CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useEffect } from "react";
import useDebounce from "../../../hooks/useDebounce.jsx";
import getPlaces from "../../../api/getPlaces";
import ComboBox from "../../utils/comboBox";
import { deleteProfilePicture, getProfilePicture, updateProfilePicture, updateUser } from "../../../api/user";
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
                    const res = await getPlaces(debouncedValue);
                    setPlaces(
                        res.data.map((item) => ({
                            name: item.name,
                            coordinates: [item.lat, item.lng],
                            type: "Point",
                        }))
                    );
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    }, [debouncedValue]);

    const locationSelected = (selection) => {
        setValues({
            ...values,
            location: selection,
        });
    };

    let imageInput;
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [previewFileSrc, setPreviewFileSrc] = useState(null);
    const [savingProfilePicture, setSavingProfilePicture] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const imageInputOnChange = (event) => {
        const file = event.target.files[0]
        setSelectedFileName(file.name);
        setSelectedImage(file)
        const reader = new FileReader()
        reader.onload = () => setPreviewFileSrc(reader.result)
        if (file) {
            reader.readAsDataURL(file)
        }
    }
    const removePreviewImageHandler = () => {
        setSelectedFileName(null);
        setPreviewFileSrc(null);
        setSelectedImage(null)
    }
    const saveImageHandler = async () => {
        try {
            setSavingProfilePicture(true);
            if (user.profilePhoto !== "") {
                await deleteProfilePicture(user.profilePhoto);
            }
            const formData = new FormData
            if (selectedImage === undefined) throw new Error("No files selected")
            formData.append("profile_Picture", selectedImage)
            const response = await updateProfilePicture(formData)
            save(response.data.user)
            setSelectedFileName(null);
            setPreviewFileSrc(null);
        } catch (error) {
            console.log(error)
        } finally {
            setSavingProfilePicture(false)
        }
    }
    const removeProfilePictureHandler = async () => {
        try {
            const response = await deleteProfilePicture(user.profilePhoto)
            save(response.data.user)
        } catch (error) {
            console.log(error)
        } finally {
            setSelectedFileName(null);
            setPreviewFileSrc(null);
            setSelectedImage(null)
        }
    }

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
                <Box flex={2} p={10} >
                    {
                        user.profilePhoto !== ""
                            ?
                            <Box>
                                <IconButton onClick={removeProfilePictureHandler} rounded={"100"} shadow={"lg"} size={"sm"} icon={<CloseIcon />} transform={"translate(-50%, 50%)"} />
                                <Image
                                    shadow={"lg"}
                                    borderRadius={10}
                                    objectFit="cover"
                                    boxSize="100%"
                                    src={getProfilePicture(user.profilePhoto)}
                                    alt={user.username}
                                />
                            </Box>
                            :
                            <>
                                {
                                    previewFileSrc &&
                                    <Box>
                                        <IconButton onClick={removePreviewImageHandler} rounded={"100"} shadow={"lg"} size={"sm"} icon={<CloseIcon />} transform={"translate(-50%, 50%)"} />
                                        <Image
                                            shadow={"lg"}
                                            borderRadius={10}
                                            objectFit="cover"
                                            boxSize="100%"
                                            src={previewFileSrc && previewFileSrc}
                                            alt={user.username}
                                        />
                                    </Box>
                                }
                                <InputGroup my={3}>
                                    <InputLeftElement>
                                        <Icon as={FiImage} />
                                    </InputLeftElement>
                                    <Input value={selectedFileName ? selectedFileName : "Choose Photo"} readOnly _hover={{ "cursor": "pointer" }} onClick={() => imageInput.click()} />
                                    <Input m={1} type="file" accept=" image/*" display={"none"} ref={node => imageInput = node} onChange={imageInputOnChange} />
                                </InputGroup>
                                <Button
                                    loadingText="Saving..."
                                    isLoading={savingProfilePicture}
                                    isDisabled={!selectedFileName}
                                    colorScheme="purple"
                                    onClick={saveImageHandler}
                                >Save</Button>
                            </>

                    }
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
