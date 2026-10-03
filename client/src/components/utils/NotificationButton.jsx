import { Badge, Button, Center, HStack, IconButton, List, ListItem, Spacer, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAllData } from "../../hooks/useAllData";
import { useAuth } from "../../hooks/useAuth";
import CustomModal from "./CustomModal";
// CustomModal passes its onClose to this child, so items can close the modal before navigating.
function NotificationList({ notifications, onClose }) {
      const navigate = useNavigate()

      const visitProfile = (username) => {
            onClose?.()
            navigate(`/profile/@${username}`)
      }

      if (!notifications.length) {
            return (
                  <Center>
                        <Text> No Notifications </Text>
                  </Center>
            )
      }

      return (
            <List spacing={3}>
                  {notifications.map((item, index) => (
                        <ListItem
                              onClick={() => item?.action?.redirect && visitProfile(item.action.redirect)}
                              key={`${item.message}${index}`}
                              _hover={{ bg: "purple.50" }}
                              borderRadius={5} p={3}
                              cursor="pointer"
                        >
                              <HStack>
                                    <Text>
                                          {item.message}
                                    </Text>
                                    <Button
                                          onClick={(e) => {
                                                e.stopPropagation()
                                                visitProfile(item.key)
                                          }}
                                          variant={"outline"}
                                          colorScheme="purple">Visit Profile</Button>
                              </HStack>
                        </ListItem>
                  ))}
            </List>
      )
}

function NotificationButton() {
      const { user, } = useAuth()
      const { notifications, setNotifications } = useAllData()

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
                  <CustomModal
                        title={"Notifications"}
                        trigger={(onOpen) => {
                              return <>
                                    <IconButton variant="ghost" pl={2} size="sm" position={"relative"} leftIcon={<FiBell size="20" />} onClick={() => onOpen()} >
                                          {
                                                <Badge
                                                      hidden={!notifications.length > 0}
                                                      colorScheme="red" variant="solid" aspectRatio={"1/1"} borderRadius={"1000px"} style={{
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
                              </>
                        }}
                        footer={(onClose) => {
                              return <>
                                    <Button variant={"outline"} colorScheme="purple" isDisabled={!notifications.length} onClick={() => setNotifications([])}>Clear</Button>
                                    <Spacer />
                                    <Button onClick={onClose}>Close</Button>
                              </>
                        }}
                  >
                        <NotificationList notifications={notifications} />

                  </CustomModal>

            </>
      )
}

export default NotificationButton