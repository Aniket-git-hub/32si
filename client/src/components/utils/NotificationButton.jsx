import { Badge, Button, HStack, IconButton, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAllData } from "../../hooks/useAllData";
import { useAuth } from "../../hooks/useAuth";
function NotificationButton() {
      const { user, } = useAuth()
      const { username, name, email, profilePhoto } = user
      const navigate = useNavigate()
      const { isOpen, onOpen, onClose } = useDisclosure()
      const { notifications, setNotifications } = useAllData()

      const handleVisitProfile = async (username) => {
            onClose()
            navigate(`/profile/@${username}`)
      }
      const handleClickOnNotificationItem = (action) => {
            if (action.redirect) {
                  console.log(action.redirect)
                  onClose()
                  navigate(`/profile/@${action.redirect}`)
            }
      }

      useEffect(() => {
            if (user.connectionRequests?.length !== 0) {
                  user.connectionRequests.forEach(username => {
                        let notificationsExist = notifications.some(n => n.key === username)
                        if (!notificationsExist) {
                              setNotifications(prev => [
                                    ...prev,
                                    {
                                          key: username,
                                          message: `${username} wants to connect with you`,
                                          action: { redirect: username }
                                    }
                              ])
                        }
                  })
            }
            return () => {
                  setNotifications([])
            }
      }, [user.connectionRequests])
      return (
            <>
                  <IconButton variant="ghost" size="sm" position={"relative"} leftIcon={<FiBell size="20" />} onClick={() => onOpen()} >
                        {
                              notifications.length > 0 &&
                              <Badge colorScheme="red" variant="solid" aspectRatio={"1/1"} borderRadius={"1000px"} style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "5px",
                                    fontSize: "10px",
                                    fontStyle: "regular",
                                    fontWeight: "lighter",
                              }}>
                                    {notifications.length}
                              </Badge>
                        }
                  </IconButton>
                  <Modal isCentered isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay
                              bg='blackAlpha.300'
                              backdropFilter='blur(10px) hue-rotate(90deg)'
                        />
                        <ModalContent>
                              <ModalHeader>Notifications</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                    <List spacing={3}>
                                          {notifications && notifications.map((item, index) => (
                                                <ListItem
                                                      onClick={(e) => handleClickOnNotificationItem(item?.action)}
                                                      key={`${item.message}${index}`}
                                                      _hover={{ bg: "purple.50" }}
                                                      borderRadius={5} p={3}
                                                >
                                                      <HStack>
                                                            <Text>
                                                                  {item.message}
                                                            </Text>
                                                            <Button
                                                                  onClick={(e) => handleVisitProfile(item.key)}
                                                                  variant={"outline"}
                                                                  colorScheme="purple">Visit Profile</Button>
                                                      </HStack>
                                                </ListItem>
                                          ))}
                                    </List>
                              </ModalBody>
                              <ModalFooter>
                                    <Button variant={"outline"} colorScheme="purple" isDisabled={!notifications.length} onClick={() => setNotifications([])}>Clear</Button>
                                    <Spacer />
                                    <Button onClick={onClose}>Close</Button>
                              </ModalFooter>
                        </ModalContent>
                  </Modal>
            </>
      )
}

export default NotificationButton