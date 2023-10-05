import { useFormValidation } from "../../hooks/useFormValidation"
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, FormControl, FormLabel, Input, FormHelperText, FormErrorMessage, Heading, VStack, Center, useToast, Container, useOptionalPart } from '@chakra-ui/react'
import { cancelAccountDeleteRequest, confirmAccountDeletion, deleteProfilePicture } from "../../api/user"
import { useEffect, useState } from "react"
import Error404Page from "./Error404Page"

export default function CancelDeleteAccountRequestPage() {
      const alert = useToast()
      const navigate = useNavigate()
      const [value, setValue] = useState("Cancelling Delete Request Please Wait")
      const { deletionToken } = useParams()

      useEffect(() => {
            const contoller = new AbortController()
            const cancelRequest = async () => {
                  if (deletionToken.length != 32) navigate("/")
                  try {
                        const reposne = await cancelAccountDeleteRequest({ deletionToken }, contoller.signal)
                        alert({
                              title: " Cancel Delete Request",
                              description: reposne.data.message,
                              duration: 3000,
                              position: "top",
                              isClosable: true,
                              status: "success"
                        })
                        navigate("/")
                  } catch (error) {
                        console.log(error)
                  }
            }
            cancelRequest()
            return () => {
                  contoller.abort()
            }
      }, [deletionToken])


      return (
            value && deletionToken ?
                  <Container shadow={"lg"} padding={10} borderRadius={10}>
                        <Center>
                              <Heading my="30px">{value}</Heading>
                        </Center>

                  </Container>
                  :
                  <Error404Page />
      )
}
