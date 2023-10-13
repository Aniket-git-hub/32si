import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { forwardRef, useImperativeHandle } from 'react';

const CustomModal = forwardRef(({ title, trigger, children, size, footer, variant = 'default', closable = true }, ref) => {
      const { isOpen, onOpen, onClose } = useDisclosure();

      // Expose the onOpen function to parent components
      useImperativeHandle(ref, () => ({
            openModal: () => onOpen(),
      }));

      return (
            <>
                  {trigger && trigger(onOpen)}
                  <Modal isOpen={isOpen} size={size} onClose={closable ? onClose : undefined}>
                        <ModalOverlay
                              bg={variant === 'warning' ? 'orangeAlpha.300' : 'blackAlpha.300'}
                              backdropFilter='blur(10px) hue-rotate(90deg)'
                        />
                        <ModalContent>
                              <ModalHeader>{title}</ModalHeader>
                              {closable && <ModalCloseButton />}
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
      );
});

export default CustomModal;