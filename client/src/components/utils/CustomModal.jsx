import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import React from "react";
function CustomModal({ title, trigger, children, size, footer }) {
      const { isOpen, onOpen, onClose } = useDisclosure()
      return (
            <>
                  {trigger(onOpen)}
                  <Modal isCentered isOpen={isOpen} size={size} onClose={onClose}>
                        <ModalOverlay
                              bg='blackAlpha.300'
                              backdropFilter='blur(10px) hue-rotate(90deg)'
                        />
                        <ModalContent>
                              <ModalHeader>{title}</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                    {React.cloneElement(children, { onClose: onClose })}
                              </ModalBody>
                              <ModalFooter>
                                    {
                                          footer ?
                                                footer(onClose)
                                                :
                                                <Button onClick={() => onClose()} >Close</Button>

                                    }
                              </ModalFooter>
                        </ModalContent>
                  </Modal>
            </>
      )
}

export default CustomModal;